import { NextRequest, NextResponse } from "next/server";
import { 
  getGoogleEvents, 
  createGoogleEvent, 
  updateGoogleEvent, 
  deleteGoogleEvent,
  syncScheduleToGoogle,
  type SyncSchedulePayload 
} from "@/lib/googleCalendar";
import { verifyAdminSession } from "@/lib/auth";

// GET /api/calendar?timeMin=...&timeMax=... (Dapat diakses untuk view jadwal)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get("timeMin") ?? undefined;
    const timeMax = searchParams.get("timeMax") ?? undefined;

    const events = await getGoogleEvents(timeMin, timeMax);
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("[GET /api/calendar] Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data dari Google Calendar." },
      { status: 500 }
    );
  }
}

// POST /api/calendar -> create/sync a single schedule to Google Calendar (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    const body = await request.json();

    // If it is a full schedule payload
    if (body.scheduleId && body.date && body.startTime && body.endTime) {
      const result = await syncScheduleToGoogle(body as SyncSchedulePayload);
      return NextResponse.json({ success: result.success, result });
    }

    // Direct event creation
    if (body.summary && body.startDateTime && body.endDateTime) {
      const created = await createGoogleEvent({
        summary: String(body.summary).slice(0, 200),
        description: body.description ? String(body.description).slice(0, 2000) : undefined,
        location: body.location ? String(body.location).slice(0, 200) : undefined,
        startDateTime: body.startDateTime,
        endDateTime: body.endDateTime,
      });
      return NextResponse.json({ success: true, event: created });
    }

    return NextResponse.json(
      { success: false, message: "Parameter tidak lengkap." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[POST /api/calendar] Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan jadwal ke Google Calendar." },
      { status: 500 }
    );
  }
}

// PUT /api/calendar -> update an event (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body.eventId) {
      return NextResponse.json(
        { success: false, message: "eventId wajib diisi." },
        { status: 400 }
      );
    }

    await updateGoogleEvent(body.eventId, {
      summary: String(body.summary || "").slice(0, 200),
      description: body.description ? String(body.description).slice(0, 2000) : undefined,
      location: body.location ? String(body.location).slice(0, 200) : undefined,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime,
    });

    return NextResponse.json({ success: true, message: "Event berhasil diperbarui di Google Calendar." });
  } catch (error) {
    console.error("[PUT /api/calendar] Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui event di Google Calendar." },
      { status: 500 }
    );
  }
}

// DELETE /api/calendar?eventId=... (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "eventId wajib diisi." },
        { status: 400 }
      );
    }

    await deleteGoogleEvent(eventId);
    return NextResponse.json({ success: true, message: "Event berhasil dihapus dari Google Calendar." });
  } catch (error) {
    console.error("[DELETE /api/calendar] Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus event dari Google Calendar." },
      { status: 500 }
    );
  }
}
