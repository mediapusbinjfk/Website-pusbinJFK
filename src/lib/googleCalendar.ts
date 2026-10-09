import { google } from "googleapis";

// ─── Auth Service Account ───────────────────────────────────────────────────
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

export const calendar = google.calendar({ version: "v3", auth });
export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;

// ─── Types ──────────────────────────────────────────────────────────────────
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: string;       // ISO 8601
  end: string;         // ISO 8601
  isAllDay: boolean;
  htmlLink?: string;
  source: "google";    // selalu "google" untuk membedakan dari jadwal lokal
}

export interface SyncSchedulePayload {
  scheduleId: string;
  consultationId?: string;
  name: string;
  institution?: string;
  topic?: string;
  notes?: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "09:00"
  endTime: string;     // "10:00"
  method: "online" | "offline";
  platform?: string;
  meetingLink?: string;
  location?: string;
  room?: string;
  status?: "aktif" | "selesai" | "dibatalkan";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseDateTime(val: { dateTime?: string | null; date?: string | null }): { iso: string; isAllDay: boolean } {
  if (val.dateTime) return { iso: val.dateTime, isAllDay: false };
  if (val.date) return { iso: `${val.date}T00:00:00+07:00`, isAllDay: true };
  return { iso: new Date().toISOString(), isAllDay: false };
}

export function formatDateTimeISO(dateStr: string, timeStr: string): string {
  // normalize time to HH:MM:SS
  const parts = timeStr.trim().split(":");
  const hh = (parts[0] || "09").padStart(2, "0");
  const mm = (parts[1] || "00").padStart(2, "0");
  return `${dateStr}T${hh}:${mm}:00+07:00`;
}

// ─── Read: Ambil semua event dari Google Calendar ────────────────────────────
export async function getGoogleEvents(
  timeMin?: string,
  timeMax?: string
): Promise<GoogleCalendarEvent[]> {
  const now = new Date();
  const defaultMin = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString();
  const defaultMax = new Date(now.getFullYear(), now.getMonth() + 6, 0).toISOString();

  const response = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: timeMin ?? defaultMin,
    timeMax: timeMax ?? defaultMax,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 500,
  });

  const items = response.data.items ?? [];

  return items.map((ev) => {
    const start = parseDateTime(ev.start ?? {});
    const end = parseDateTime(ev.end ?? {});
    return {
      id: ev.id ?? crypto.randomUUID(),
      summary: ev.summary ?? "(Tanpa Judul)",
      description: ev.description ?? undefined,
      location: ev.location ?? undefined,
      start: start.iso,
      end: end.iso,
      isAllDay: start.isAllDay,
      htmlLink: ev.htmlLink ?? undefined,
      source: "google",
    };
  });
}

// ─── Write: Buat event baru di Google Calendar ───────────────────────────────
export async function createGoogleEvent(params: {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string;   // ISO 8601 dengan timezone, e.g. "2026-10-15T10:00:00+07:00"
  endDateTime: string;
}): Promise<{ id: string; htmlLink: string }> {
  const response = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary: params.summary,
      description: params.description,
      location: params.location,
      start: { dateTime: params.startDateTime, timeZone: "Asia/Jakarta" },
      end: { dateTime: params.endDateTime, timeZone: "Asia/Jakarta" },
    },
  });

  return {
    id: response.data.id!,
    htmlLink: response.data.htmlLink || "",
  };
}

// ─── Write: Update event yang sudah ada ─────────────────────────────────────
export async function updateGoogleEvent(
  eventId: string,
  params: {
    summary?: string;
    description?: string;
    location?: string;
    startDateTime?: string;
    endDateTime?: string;
  }
): Promise<void> {
  await calendar.events.patch({
    calendarId: CALENDAR_ID,
    eventId,
    requestBody: {
      ...(params.summary && { summary: params.summary }),
      ...(params.description !== undefined && { description: params.description }),
      ...(params.location !== undefined && { location: params.location }),
      ...(params.startDateTime && {
        start: { dateTime: params.startDateTime, timeZone: "Asia/Jakarta" },
      }),
      ...(params.endDateTime && {
        end: { dateTime: params.endDateTime, timeZone: "Asia/Jakarta" },
      }),
    },
  });
}

// ─── Write: Hapus event ──────────────────────────────────────────────────────
export async function deleteGoogleEvent(eventId: string): Promise<void> {
  await calendar.events.delete({ calendarId: CALENDAR_ID, eventId });
}

// ─── Helper untuk sinkronisasi jadwal portal ke Google Calendar ──────────────
export async function syncScheduleToGoogle(
  schedule: SyncSchedulePayload
): Promise<{ success: boolean; eventId?: string; action: "created" | "updated" | "skipped" }> {
  try {
    const startDateTime = formatDateTimeISO(schedule.date, schedule.startTime);
    const endDateTime = formatDateTimeISO(schedule.date, schedule.endTime);
    
    const summary = `[Konsultasi JF] ${schedule.name} - ${schedule.topic || "Konsultasi Kebencanaan"}`;
    const location = schedule.method === "online" 
      ? (schedule.meetingLink || schedule.platform || "Online via Zoom") 
      : `${schedule.location || "Gedung Graha BNPB"} - ${schedule.room || "Ruang Konsultasi"}`;
    
    const description = [
      `🏛️ INSTANSI: ${schedule.institution || "-"}`,
      `👤 PEMOHON: ${schedule.name}`,
      `📌 TOPIK: ${schedule.topic || "-"}`,
      `📅 STATUS: ${schedule.status?.toUpperCase() || "AKTIF"}`,
      `📍 METODE: ${schedule.method === "online" ? "Online (Video)" : "Tatap Muka (Offline)"}`,
      schedule.meetingLink ? `🔗 LINK: ${schedule.meetingLink}` : "",
      schedule.notes ? `📝 CATATAN: ${schedule.notes}` : "",
      `\n🆔 [PORTAL_SCHEDULE_ID:${schedule.scheduleId}]`,
    ].filter(Boolean).join("\n");

    // Cari apakah event dengan schedule ID ini sudah ada di Google Calendar
    const allGoogleEvents = await getGoogleEvents();
    const existing = allGoogleEvents.find((e) => 
      e.description?.includes(`[PORTAL_SCHEDULE_ID:${schedule.scheduleId}]`) ||
      e.summary.includes(`[Konsultasi JF] ${schedule.name}`)
    );

    if (existing) {
      await updateGoogleEvent(existing.id, {
        summary,
        description,
        location,
        startDateTime,
        endDateTime,
      });
      return { success: true, eventId: existing.id, action: "updated" };
    } else {
      const created = await createGoogleEvent({
        summary,
        description,
        location,
        startDateTime,
        endDateTime,
      });
      return { success: true, eventId: created.id, action: "created" };
    }
  } catch (error) {
    console.error(`[syncScheduleToGoogle] Error for schedule ${schedule.scheduleId}:`, error);
    return { success: false, action: "skipped" };
  }
}
