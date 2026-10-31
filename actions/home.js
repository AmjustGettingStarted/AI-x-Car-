"use server";
import aj from "@/lib/arcjet";
import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { identifyCarFromImage, toSearchDetails } from "@/lib/gemini";
import { request } from "@arcjet/next";

export async function getFeaturedCars(limit = 15) {
  try {
    const cars = await db.car.findMany({
      where: {
        featured: true,
        status: { in: ["AVAILABLE", "UNAVAILABLE"] },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return cars.map(serializeCarData);
  } catch (error) {
    throw new Error("Error fetching featured cars:" + error.message);
  }
}

export async function processImageSearch(file) {
  try {
    //  Rate Limiting with ArcJet
    const req = await request();
    const decision = aj.protect(req, {
      requested: 1,
    });

    if ((await decision).isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = (await decision).reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request Blocked");
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    const identified = await identifyCarFromImage(file);
    if (!identified) {
      console.error("Failed to parse AI response");
      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }

    return {
      success: true,
      data: toSearchDetails(identified),
    };
  } catch (error) {
    throw new Error("AI Search error:" + error.message);
  }
}
