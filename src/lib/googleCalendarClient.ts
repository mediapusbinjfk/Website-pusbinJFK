import type { SyncSchedulePayload } from "./googleCalendar";

/**
 * Kirim 1 jadwal konsultasi ke Google Calendar
 */
export async function pushScheduleToGoogleCalendar(schedule: SyncSchedulePayload): Promise<boolean> {
  try {
    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("Gagal sinkronkan jadwal ke Google Calendar:", err);
    return false;
  }
}

/**
 * Kirim SEMUA jadwal lokal yang ada di portal ke Google Calendar sekaligus
 */
export async function pushAllSchedulesToGoogleCalendar(
  schedules: SyncSchedulePayload[]
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("/api/calendar/sync-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedules }),
    });
    const data = await res.json();
    return {
      success: data.success === true,
      message: data.message || "Sinkronisasi selesai.",
    };
  } catch (err) {
    console.error("Gagal sinkronkan semua jadwal:", err);
    return {
      success: false,
      message: "Gagal terhubung ke server Google Calendar.",
    };
  }
}
