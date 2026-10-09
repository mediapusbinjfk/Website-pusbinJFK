import { NextResponse } from "next/server";
import { 
  getGoogleEvents, 
  createGoogleEvent, 
  updateGoogleEvent, 
  deleteGoogleEvent,
  syncScheduleToGoogle,
  type SyncSchedulePayload 
} from "@/lib/googleCalendar";

// GET /api/calendar?timeMin=...&timeMax=...
export async function GET(request: Request) {
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

// POST /api/calendar -> create/sync a single schedule to Google Calendar
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // If it is a full schedule payload
    if (body.scheduleId && body.date && body.startTime && body.endTime) {
      const result = await syncScheduleToGoogle(body as SyncSchedulePayload);
      return NextResponse.json({ success: result.success, result });
    }

    // Direct event creation
    if (body.summary && body.startDateTime && body.endDateTime) {
      const created = await createGoogleEvent({
        summary: body.summary,
        description: body.description,
        location: body.location,
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

// PUT /api/calendar -> update an event
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.eventId) {
      return NextResponse.json(
        { success: false, message: "eventId wajib diisi." },
        { status: 400 }
      );
    }

    await updateGoogleEvent(body.eventId, {
      summary: body.summary,
      description: body.description,
      location: body.location,
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

// DELETE /api/calendar?eventId=...
export async function DELETE(request: Request) {
  try {
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
