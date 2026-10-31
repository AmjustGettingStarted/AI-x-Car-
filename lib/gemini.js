import { GoogleGenAI } from "@google/genai";

/** Stable Flash model. https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash */
export const GEMINI_MODEL = "gemini-3.8-flash";

const CAR_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    make: { type: "string" },
    model: { type: "string" },
    year: { type: "integer" },
    bodyType: { type: "string" },
    fuel: { type: "string" },
    transmission: { type: "string" },
    color: { type: "string" },
    estimatedPriceRange: { type: "string" },
  },
  required: [
    "make",
    "model",
    "year",
    "bodyType",
    "fuel",
    "transmission",
    "color",
    "estimatedPriceRange",
  ],
};

const IDENTIFY_PROMPT = `Identify the car in this photo.
Return strict JSON only, with these fields:
make, model, year, bodyType, fuel, transmission, color, estimatedPriceRange.
year is the model year as an integer, or 0 if unknown.
bodyType is the body type (SUV, Sedan, Hatchback, Coupe, Truck, Van, or the closest match).
fuel is the fuel type.
transmission is Automatic or Manual, or your best guess.
color is the exterior color.
estimatedPriceRange is a USD range such as "20000-30000", or "" if unknown.
Use "" for unknown text fields. No markdown.`;

function asText(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function normalizeCar(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  const yearValue = parsed.year;
  const yearNumber =
    typeof yearValue === "number"
      ? yearValue
      : Number.parseInt(asText(yearValue), 10);

  return {
    make: asText(parsed.make),
    model: asText(parsed.model),
    year: Number.isFinite(yearNumber) ? Math.trunc(yearNumber) : 0,
    bodyType: asText(
      parsed.bodyType ?? parsed.body_type ?? parsed["body type"]
    ),
    fuel: asText(parsed.fuel ?? parsed.fuelType ?? parsed.fuel_type),
    transmission: asText(parsed.transmission),
    color: asText(parsed.color),
    estimatedPriceRange: asText(
      parsed.estimatedPriceRange ??
        parsed.estimated_price_range ??
        parsed.priceRange ??
        parsed["estimated price range"]
    ),
  };
}

function parseCarIdentification(text) {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return null;

  const candidates = [raw];
  const unfenced = raw.replace(/```(?:json)?/gi, "").trim();
  if (unfenced && unfenced !== raw) candidates.push(unfenced);
  const objectMatch = raw.match(/\{[\s\S]*\}/);
  if (objectMatch) candidates.push(objectMatch[0]);

  for (const candidate of candidates) {
    try {
      const normalized = normalizeCar(JSON.parse(candidate));
      if (normalized) return normalized;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

function confidenceScore(car) {
  const checks = [
    car.make,
    car.model,
    car.year >= 1900 ? car.year : "",
    car.bodyType,
    car.fuel,
    car.transmission,
    car.color,
    car.estimatedPriceRange,
  ];
  const filled = checks.filter((value) => {
    if (typeof value === "number") return Number.isFinite(value);
    return typeof value === "string" && value.trim() !== "";
  }).length;
  return Number((filled / checks.length).toFixed(2));
}

function priceFromRange(range) {
  const matches = String(range ?? "")
    .replace(/,/g, "")
    .match(/\d+(?:\.\d+)?/g);
  if (!matches) return "";
  const numbers = matches.map(Number).filter((value) => Number.isFinite(value));
  if (numbers.length === 0) return "";
  if (numbers.length === 1) return String(Math.round(numbers[0]));
  return String(Math.round((numbers[0] + numbers[1]) / 2));
}

function listingYear(year) {
  return year >= 1900 && year <= 2100 ? year : "";
}

/** Shape consumed by the admin AI entry form. */
export function toListingDetails(car) {
  const year = listingYear(car.year);
  const description = [year, car.make, car.model, car.color, car.bodyType]
    .filter((part) => part !== "" && part != null)
    .join(" ");

  return {
    make: car.make,
    model: car.model,
    year,
    color: car.color,
    price: priceFromRange(car.estimatedPriceRange),
    mileage: "",
    bodyType: car.bodyType,
    fuelType: car.fuel,
    transmission: car.transmission,
    description,
    confidence: confidenceScore(car),
  };
}

/** Shape consumed by the public image search. */
export function toSearchDetails(car) {
  return {
    make: car.make,
    bodyType: car.bodyType,
    color: car.color,
    confidence: confidenceScore(car),
  };
}

export async function identifyCarFromImage(file) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not set");
  }

  const bytes = await file.arrayBuffer();
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        inlineData: {
          mimeType: file.type || "image/jpeg",
          data: Buffer.from(bytes).toString("base64"),
        },
      },
      { text: IDENTIFY_PROMPT },
    ],
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseJsonSchema: CAR_RESPONSE_SCHEMA,
    },
  });

  return parseCarIdentification(response?.text);
}
