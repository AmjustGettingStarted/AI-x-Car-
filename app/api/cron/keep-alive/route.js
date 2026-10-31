import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const KEEP_ALIVE_ID = 1;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    return unauthorized();
  }

  const pingedAt = new Date();
  const probe = `keep-alive:${pingedAt.toISOString()}`;

  try {
    await db.keepAlive.upsert({
      where: { id: KEEP_ALIVE_ID },
      create: { id: KEEP_ALIVE_ID, pingedAt, note: probe },
      update: { pingedAt, note: probe },
    });

    const readBack = await db.keepAlive.findUnique({
      where: { id: KEEP_ALIVE_ID },
    });
    const noteReadAt = new Date();

    if (!readBack || readBack.note !== probe) {
      return NextResponse.json(
        {
          ok: false,
          error: "Keep-alive readback mismatch",
          pingedAt: pingedAt.toISOString(),
          noteReadAt: noteReadAt.toISOString(),
        },
        { status: 500 }
      );
    }

    const reverted = await db.keepAlive.update({
      where: { id: KEEP_ALIVE_ID },
      data: { note: null },
    });
    const noteRevertedAt = new Date();

    let supabase = { ok: false, readAt: null, error: null };
    try {
      const supabaseReadAt = new Date();
      const cookieStore = await cookies();
      const supabaseClient = createClient(cookieStore);
      const { error } = await supabaseClient.storage
        .from("car-images")
        .list("", { limit: 1 });
      supabase = {
        ok: !error,
        readAt: supabaseReadAt.toISOString(),
        error: error?.message ?? null,
      };
    } catch (error) {
      supabase = {
        ok: false,
        readAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Supabase read failed",
      };
    }

    return NextResponse.json({
      ok: true,
      id: reverted.id,
      pingedAt: reverted.pingedAt.toISOString(),
      noteWritten: probe,
      noteRead: readBack.note,
      noteReadAt: noteReadAt.toISOString(),
      note: reverted.note,
      noteRevertedAt: noteRevertedAt.toISOString(),
      supabase,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Keep-alive failed",
        pingedAt: pingedAt.toISOString(),
      },
      { status: 500 }
    );
  }
}
