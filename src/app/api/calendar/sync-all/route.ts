import { NextRequest, NextResponse } from "next/server";
import { syncScheduleToGoogle, type SyncSchedulePayload } from "@/lib/googleCalendar";
import { verifyAdminSession } from "@/lib/auth";

// POST /api/calendar/sync-all (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: Autentikasi sesi admin diperlukan." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const schedules: SyncSchedulePayload[] = body.schedules || [];

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada jadwal untuk disinkronkan." },
        { status: 400 }
      );
    }

    // Limit batch sync to max 100 items per request
    const boundedSchedules = schedules.slice(0, 100);

    const results = [];
    for (const schedule of boundedSchedules) {
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
      { success: false, message: "Terjadi kesalahan saat menyinkronkan jadwal." },
      { status: 500 }
    );
  }
}
