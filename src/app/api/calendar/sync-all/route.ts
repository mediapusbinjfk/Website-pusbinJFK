import { NextResponse } from "next/server";
import { syncScheduleToGoogle, type SyncSchedulePayload } from "@/lib/googleCalendar";

// POST /api/calendar/sync-all
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const schedules: SyncSchedulePayload[] = body.schedules || [];

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada jadwal untuk disinkronkan." },
        { status: 400 }
      );
    }

    const results = [];
    for (const schedule of schedules) {
      const res = await syncScheduleToGoogle(schedule);
      results.push({ scheduleId: schedule.scheduleId, ...res });
    }

    const createdCount = results.filter((r) => r.action === "created").length;
    const updatedCount = results.filter((r) => r.action === "updated").length;

    return NextResponse.json({
      success: true,
      message: `Berhasil sinkronisasi: ${createdCount} baru dibuat, ${updatedCount} diperbarui di Google Calendar.`,
      details: results,
    });
  } catch (error) {
    console.error("[POST /api/calendar/sync-all] Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat menyinkronkan semua jadwal." },
      { status: 500 }
    );
  }
}
