import { Consultation, ConsultationSchedule, ConsultationStatus, MeetingMethod } from "@/types/admin";
import { 
  sendScheduleEmailNotification,
  sendRescheduleEmailNotification,
  sendCancelEmailNotification,
} from "@/services/email";

// Key for LocalStorage
const STORAGE_KEYS = {
  CONSULTATIONS: "jf_bnpb_consultations",
  SCHEDULES: "jf_bnpb_schedules",
};

// Helper: Sync directly to Google Calendar in background
function syncToGoogleCalendarBackground(payload: {
  scheduleId: string;
  consultationId?: string;
  name: string;
  institution?: string;
  topic?: string;
  notes?: string;
  date: string;
  startTime: string;
  endTime: string;
  method: "online" | "offline";
  platform?: string;
  meetingLink?: string;
  location?: string;
  room?: string;
  status?: "aktif" | "selesai" | "dibatalkan";
}) {
  if (typeof window === "undefined") return;
  fetch("/api/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.error("[GoogleCalendarSync] Background sync error:", err);
  });
}

function getSeedData(): { consultations: Consultation[]; schedules: ConsultationSchedule[] } {
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatDate = (offsetDays: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const c1: Consultation = {
    id: "KNS-000001",
    createdAt: new Date().toISOString(),
    name: "Dr. Hendra Gunawan, S.T., M.Sc",
    whatsapp: "081234567890",
    email: "hendra.gunawan@jabarprov.go.id",
    institution: "BPBD Provinsi Jawa Barat",
    position: "Penata Penanggulangan Bencana Ahli Madya",
    consultationMethod: "zoom",
    topic: "Uji Kompetensi (UKOM) Jenjang Madya",
    notes: "Konsultasi kelengkapan berkas portofolio dan jadwal uji kompetensi.",
    estimatedDate: formatDate(0),
    estimatedTime: "09.00 – 10.00 WIB",
    status: "terjadwal",
  };

  const s1: ConsultationSchedule = {
    scheduleId: "SCH-001",
    consultationId: "KNS-000001",
    date: formatDate(0),
    startTime: "09:00",
    endTime: "10:00",
    method: "online",
    platform: "Zoom Meeting",
    meetingLink: "https://zoom.us/j/9876543210?pwd=BNPB",
    notes: "Uji kelengkapan berkas portofolio UKOM",
    status: "aktif",
    createdBy: "Admin BNPB",
    createdAt: new Date().toISOString(),
  };

  const c2: Consultation = {
    id: "KNS-000002",
    createdAt: new Date().toISOString(),
    name: "Siti Rahmawati, S.Sos",
    whatsapp: "085712345678",
    email: "siti.rahma@bogorkab.go.id",
    institution: "BPBD Kab. Bogor",
    position: "Analis Kebencanaan Ahli Pertama",
    consultationMethod: "tatap-muka",
    topic: "Penilaian Angka Kredit (PAK) Tahunan",
    notes: "Konsultasi perhitungan DUPAK dan bukti dukung lapangan.",
    estimatedDate: formatDate(1),
    estimatedTime: "10.00 – 11.00 WIB",
    status: "terjadwal",
  };

  const s2: ConsultationSchedule = {
    scheduleId: "SCH-002",
    consultationId: "KNS-000002",
    date: formatDate(1),
    startTime: "10:00",
    endTime: "11:00",
    method: "offline",
    location: "Gedung Graha BNPB Lt. 8",
    room: "Ruang Konsultasi Pembinaan JF Kebencanaan",
    notes: "Membawa salinan fisik dokumen DUPAK.",
    status: "aktif",
    createdBy: "Admin BNPB",
    createdAt: new Date().toISOString(),
  };

  const c3: Consultation = {
    id: "KNS-000003",
    createdAt: new Date().toISOString(),
    name: "Agus Prasetyo, M.T.",
    whatsapp: "081398765432",
    email: "agus.prasetyo@bnpb.go.id",
    institution: "Direktorat PKRR BNPB",
    position: "Penata Penanggulangan Bencana Ahli Muda",
    consultationMethod: "zoom",
    topic: "Inpassing / Pengangkatan Pertama",
    notes: "Koordinasi perpindahan jabatan struktural ke fungsional.",
    estimatedDate: formatDate(3),
    estimatedTime: "13.00 – 14.00 WIB",
    status: "terjadwal",
  };

  const s3: ConsultationSchedule = {
    scheduleId: "SCH-003",
    consultationId: "KNS-000003",
    date: formatDate(3),
    startTime: "13:00",
    endTime: "14:00",
    method: "online",
    platform: "Zoom Meeting",
    meetingLink: "https://zoom.us/j/8123456789",
    notes: "Pembahasan formasi dan rekomendasi PPK.",
    status: "aktif",
    createdBy: "Admin BNPB",
    createdAt: new Date().toISOString(),
  };

  const c4: Consultation = {
    id: "KNS-000004",
    createdAt: new Date().toISOString(),
    name: "Rina Marlina, S.Kom",
    whatsapp: "081987654321",
    email: "rina.marlina@bnpb.go.id",
    institution: "Pusdatinkom Kebencanaan BNPB",
    position: "Pranata Komputer Ahli Muda",
    consultationMethod: "zoom",
    topic: "Kenaikan Pangkat / Jabatan",
    notes: "Konsultasi syarat penetapan angka kredit konversi.",
    estimatedDate: formatDate(-2),
    estimatedTime: "09.00 – 10.00 WIB",
    status: "selesai",
  };

  const s4: ConsultationSchedule = {
    scheduleId: "SCH-004",
    consultationId: "KNS-000004",
    date: formatDate(-2),
    startTime: "09:00",
    endTime: "10:00",
    method: "online",
    platform: "Google Meet",
    meetingLink: "https://meet.google.com/bnpb-jf-sesi",
    notes: "Selesai dilaksanakan.",
    status: "selesai",
    createdBy: "Admin BNPB",
    createdAt: new Date().toISOString(),
  };

  return {
    consultations: [c1, c2, c3, c4],
    schedules: [s1, s2, s3, s4],
  };
}

// Helper functions for safely accessing localStorage
function getStorage<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) {
      window.localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(item) as T;
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(seed) && seed.length > 0) {
      window.localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch (e) {
    return seed;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

function generateNextConsultationId(consultations: Consultation[]): string {
  let max = 0;
  for (const c of consultations) {
    const match = c.id.match(/KNS-(\d+)/);
    if (match) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > max) max = val;
    }
  }
  return `KNS-${(max + 1).toString().padStart(6, "0")}`;
}

function generateNextScheduleId(schedules: ConsultationSchedule[]): string {
  let max = 0;
  for (const s of schedules) {
    const match = s.scheduleId.match(/SCH-(\d+)/);
    if (match) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > max) max = val;
    }
  }
  return `SCH-${(max + 1).toString().padStart(3, "0")}`;
}

export const ConsultationStore = {
  // Get all consultations with automatic deduplication
  getConsultations(): Consultation[] {
    const seed = getSeedData();
    const raw = getStorage<Consultation[]>(STORAGE_KEYS.CONSULTATIONS, seed.consultations);
    
    // Deduplicate by id if any duplicates exist in storage
    const seen = new Set<string>();
    let hasDuplicate = false;
    const unique = raw.filter((item) => {
      if (seen.has(item.id)) {
        hasDuplicate = true;
        return false;
      }
      seen.add(item.id);
      return true;
    });

    if (hasDuplicate) {
      setStorage(STORAGE_KEYS.CONSULTATIONS, unique);
    }
    return unique;
  },

  // Get only pending/un-scheduled consultations so they do not pile up!
  getPendingConsultations(): Consultation[] {
    const list = this.getConsultations();
    return list.filter((c) => c.status === "menunggu" || c.status === "diproses");
  },

  // Get all schedules with automatic deduplication
  getSchedules(): ConsultationSchedule[] {
    const seed = getSeedData();
    const raw = getStorage<ConsultationSchedule[]>(STORAGE_KEYS.SCHEDULES, seed.schedules);

    const seen = new Set<string>();
    let hasDuplicate = false;
    const unique = raw.filter((item) => {
      if (seen.has(item.scheduleId)) {
        hasDuplicate = true;
        return false;
      }
      seen.add(item.scheduleId);
      return true;
    });

    if (hasDuplicate) {
      setStorage(STORAGE_KEYS.SCHEDULES, unique);
    }
    return unique;
  },

  // Add a standard consultation (status: menunggu)
  addConsultation(payload: {
    name: string;
    whatsapp: string;
    email?: string;
    institution: string;
    position: string;
    topic: string;
    notes?: string;
    method: "zoom" | "tatap-muka";
    documentFileName?: string;
    estimatedDate?: string;
    estimatedTime?: string;
  }): Consultation {
    const consultations = this.getConsultations();
    const newConsultationId = generateNextConsultationId(consultations);

    const newConsultation: Consultation = {
      id: newConsultationId,
      createdAt: new Date().toISOString(),
      name: payload.name,
      whatsapp: payload.whatsapp,
      email: payload.email,
      institution: payload.institution,
      position: payload.position,
      consultationMethod: payload.method,
      topic: payload.topic,
      notes: payload.notes,
      documentFileName: payload.documentFileName,
      estimatedDate: payload.estimatedDate || new Date().toISOString().split("T")[0],
      estimatedTime: payload.estimatedTime,
      status: "menunggu",
    };

    consultations.unshift(newConsultation);
    setStorage(STORAGE_KEYS.CONSULTATIONS, consultations);
    return newConsultation;
  },

  // Add a schedule directly from consultation form or admin
  addDirectSchedule(payload: {
    name: string;
    whatsapp: string;
    email?: string;
    institution: string;
    position: string;
    topic: string;
    notes?: string;
    date: string;
    startTime: string;
    endTime: string;
    method: MeetingMethod;
    platform?: string;
    meetingLink?: string;
    location?: string;
    room?: string;
    documentFileName?: string;
  }): { consultation: Consultation; schedule: ConsultationSchedule } {
    const consultations = this.getConsultations();
    const schedules = this.getSchedules();

    const timestamp = new Date().toISOString();
    const newConsultationId = generateNextConsultationId(consultations);
    const newScheduleId = generateNextScheduleId(schedules);

    const newConsultation: Consultation = {
      id: newConsultationId,
      createdAt: timestamp,
      name: payload.name,
      whatsapp: payload.whatsapp,
      email: payload.email,
      institution: payload.institution,
      position: payload.position,
      consultationMethod: payload.method === "online" ? "zoom" : "tatap-muka",
      topic: payload.topic,
      notes: payload.notes,
      estimatedDate: payload.date,
      estimatedTime: `${payload.startTime} – ${payload.endTime} WIB`,
      documentFileName: payload.documentFileName,
      status: "terjadwal",
      processedAt: timestamp,
    };

    const newSchedule: ConsultationSchedule = {
      scheduleId: newScheduleId,
      consultationId: newConsultationId,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      method: payload.method,
      platform: payload.method === "online" ? (payload.platform || "Zoom Meeting") : undefined,
      meetingLink: payload.method === "online" ? (payload.meetingLink || "https://zoom.us/j/9876543210") : undefined,
      location: payload.method === "offline" ? (payload.location || "Gedung Graha BNPB Lt. 8") : undefined,
      room: payload.method === "offline" ? (payload.room || "Ruang Rapat Pembinaan JF Kebencanaan Lt. 8") : undefined,
      notes: payload.notes,
      status: "aktif",
      createdBy: "Sistem (Opsi Jadwal Langsung)",
      createdAt: timestamp,
    };

    // Save
    consultations.unshift(newConsultation);
    schedules.unshift(newSchedule);

    setStorage(STORAGE_KEYS.CONSULTATIONS, consultations);
    setStorage(STORAGE_KEYS.SCHEDULES, schedules);

    // Otomatis kirim format template ke email pegawai
    sendScheduleEmailNotification({
      to: payload.email || "pegawai@instansi.go.id",
      applicantName: payload.name,
      consultationId: newConsultationId,
      scheduleId: newScheduleId,
      date: payload.date,
      time: `${payload.startTime} – ${payload.endTime} WIB`,
      method: payload.method,
      locationOrZoom: payload.method === "online" 
        ? (payload.meetingLink || "https://zoom.us/j/9876543210")
        : "Gedung Graha BNPB Lt. 8 (Ruang Rapat Pembinaan JF Kebencanaan Lt. 8)",
      notes: payload.notes,
    });

    // Otomatis sinkronkan ke Google Calendar secara realtime!
    syncToGoogleCalendarBackground({
      scheduleId: newScheduleId,
      consultationId: newConsultationId,
      name: payload.name,
      institution: payload.institution,
      topic: payload.topic,
      notes: payload.notes,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      method: payload.method,
      platform: payload.platform,
      meetingLink: payload.meetingLink,
      location: payload.location,
      room: payload.room,
      status: "aktif",
    });

    return { consultation: newConsultation, schedule: newSchedule };
  },

  // Turn an existing pending consultation into a schedule (Admin action)
  scheduleConsultation(consultationId: string, scheduleData: {
    date: string;
    startTime: string;
    endTime: string;
    method: MeetingMethod;
    platform?: string;
    meetingLink?: string;
    location?: string;
    room?: string;
    notes?: string;
  }): ConsultationSchedule | null {
    const consultations = this.getConsultations();
    const schedules = this.getSchedules();

    const targetIdx = consultations.findIndex((c) => c.id === consultationId);
    if (targetIdx === -1) return null;

    consultations[targetIdx].status = "terjadwal";
    consultations[targetIdx].processedAt = new Date().toISOString();

    const target = consultations[targetIdx];
    const newScheduleId = generateNextScheduleId(schedules);

    const newSchedule: ConsultationSchedule = {
      scheduleId: newScheduleId,
      consultationId,
      date: scheduleData.date,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      method: scheduleData.method,
      platform: scheduleData.platform,
      meetingLink: scheduleData.meetingLink,
      location: scheduleData.location,
      room: scheduleData.room,
      notes: scheduleData.notes,
      status: "aktif",
      createdBy: "Admin BNPB",
      createdAt: new Date().toISOString(),
    };

    schedules.unshift(newSchedule);

    setStorage(STORAGE_KEYS.CONSULTATIONS, consultations);
    setStorage(STORAGE_KEYS.SCHEDULES, schedules);

    // Otomatis kirim format template ke email pegawai
    sendScheduleEmailNotification({
      to: target.email || "pegawai@instansi.go.id",
      applicantName: target.name,
      consultationId: target.id,
      scheduleId: newScheduleId,
      date: scheduleData.date,
      time: `${scheduleData.startTime} – ${scheduleData.endTime} WIB`,
      method: scheduleData.method,
      locationOrZoom: scheduleData.method === "online"
        ? (scheduleData.meetingLink || "https://zoom.us/j/9876543210")
        : "Gedung Graha BNPB Lt. 8 (Ruang Rapat Pembinaan JF Kebencanaan Lt. 8)",
      notes: scheduleData.notes || target.notes,
    });

    // Otomatis sinkronkan ke Google Calendar secara realtime!
    syncToGoogleCalendarBackground({
      scheduleId: newScheduleId,
      consultationId,
      name: target.name,
      institution: target.institution,
      topic: target.topic,
      notes: scheduleData.notes || target.notes,
      date: scheduleData.date,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      method: scheduleData.method,
      platform: scheduleData.platform,
      meetingLink: scheduleData.meetingLink,
      location: scheduleData.location,
      room: scheduleData.room,
      status: "aktif",
    });

    return newSchedule;
  },

  // Reschedule an existing schedule
  reschedule(scheduleId: string, updates: {
    newDate: string;
    newStartTime: string;
    newEndTime: string;
    method: MeetingMethod;
    platform?: string;
    meetingLink?: string;
    location?: string;
    room?: string;
    reason: string;
  }): boolean {
    const schedules = this.getSchedules();
    const idx = schedules.findIndex((s) => s.scheduleId === scheduleId);
    if (idx === -1) return false;

    const oldDate = schedules[idx].date;
    const oldTime = `${schedules[idx].startTime} – ${schedules[idx].endTime} WIB`;

    schedules[idx].date = updates.newDate;
    schedules[idx].startTime = updates.newStartTime;
    schedules[idx].endTime = updates.newEndTime;
    schedules[idx].method = updates.method;
    if (updates.platform) schedules[idx].platform = updates.platform;
    if (updates.meetingLink) schedules[idx].meetingLink = updates.meetingLink;
    if (updates.location) schedules[idx].location = updates.location;
    if (updates.room) schedules[idx].room = updates.room;

    setStorage(STORAGE_KEYS.SCHEDULES, schedules);

    const consultations = this.getConsultations();
    const c = consultations.find((item) => item.id === schedules[idx].consultationId);

    // Otomatis kirim email reschedule ke pemohon
    sendRescheduleEmailNotification({
      to: c?.email || "pegawai@instansi.go.id",
      applicantName: c?.name || "Pemohon Terdaftar",
      consultationId: schedules[idx].consultationId,
      scheduleId,
      oldDate,
      oldTime,
      date: updates.newDate,
      time: `${updates.newStartTime} – ${updates.newEndTime} WIB`,
      method: updates.method,
      locationOrZoom: updates.method === "online"
        ? (updates.meetingLink || "https://zoom.us/j/9876543210")
        : "Gedung Graha BNPB Lt. 8 (Ruang Rapat Pembinaan JF Kebencanaan Lt. 8)",
      reason: updates.reason,
      notes: c?.notes,
    });

    // Sync to Google Calendar
    syncToGoogleCalendarBackground({
      scheduleId,
      name: c?.name || "Pemohon Terdaftar",
      institution: c?.institution,
      topic: c?.topic,
      notes: updates.reason,
      date: updates.newDate,
      startTime: updates.newStartTime,
      endTime: updates.newEndTime,
      method: updates.method,
      platform: updates.platform,
      meetingLink: updates.meetingLink,
      location: updates.location,
      room: updates.room,
      status: schedules[idx].status,
    });

    return true;
  },

  // Mark schedule completed
  completeSchedule(scheduleId: string): boolean {
    const schedules = this.getSchedules();
    const idx = schedules.findIndex((s) => s.scheduleId === scheduleId);
    if (idx === -1) return false;

    schedules[idx].status = "selesai";
    setStorage(STORAGE_KEYS.SCHEDULES, schedules);

    // Also update consultation status
    const consultations = this.getConsultations();
    const cIdx = consultations.findIndex((c) => c.id === schedules[idx].consultationId);
    if (cIdx !== -1) {
      consultations[cIdx].status = "selesai";
      setStorage(STORAGE_KEYS.CONSULTATIONS, consultations);
    }
    return true;
  },

  // Cancel schedule
  cancelSchedule(scheduleId: string, reason?: string): boolean {
    const schedules = this.getSchedules();
    const idx = schedules.findIndex((s) => s.scheduleId === scheduleId);
    if (idx === -1) return false;

    const targetSchedule = schedules[idx];
    targetSchedule.status = "dibatalkan";
    setStorage(STORAGE_KEYS.SCHEDULES, schedules);

    const consultations = this.getConsultations();
    const c = consultations.find((item) => item.id === targetSchedule.consultationId);

    // Otomatis kirim email pembatalan ke pemohon
    sendCancelEmailNotification({
      to: c?.email || "pegawai@instansi.go.id",
      applicantName: c?.name || "Pemohon Terdaftar",
      consultationId: targetSchedule.consultationId,
      scheduleId,
      date: targetSchedule.date,
      time: `${targetSchedule.startTime} – ${targetSchedule.endTime} WIB`,
      reason: reason || "Pembatalan oleh Administrator / Tim Pembina JF BNPB",
    });

    return true;
  },

  // Update schedule and associated consultation info
  updateSchedule(
    scheduleId: string,
    payload: {
      name?: string;
      institution?: string;
      whatsapp?: string;
      email?: string;
      topic?: string;
      date?: string;
      startTime?: string;
      endTime?: string;
      method?: MeetingMethod;
      platform?: string;
      meetingLink?: string;
      location?: string;
      room?: string;
      notes?: string;
      status?: "aktif" | "selesai" | "dibatalkan";
    }
  ): boolean {
    const schedules = this.getSchedules();
    const sIdx = schedules.findIndex((s) => s.scheduleId === scheduleId);
    if (sIdx === -1) return false;

    const currentSchedule = schedules[sIdx];

    if (payload.date) currentSchedule.date = payload.date;
    if (payload.startTime) currentSchedule.startTime = payload.startTime;
    if (payload.endTime) currentSchedule.endTime = payload.endTime;
    if (payload.method) currentSchedule.method = payload.method;
    if (payload.platform !== undefined) currentSchedule.platform = payload.platform;
    if (payload.meetingLink !== undefined) currentSchedule.meetingLink = payload.meetingLink;
    if (payload.location !== undefined) currentSchedule.location = payload.location;
    if (payload.room !== undefined) currentSchedule.room = payload.room;
    if (payload.notes !== undefined) currentSchedule.notes = payload.notes;
    if (payload.status) currentSchedule.status = payload.status;

    setStorage(STORAGE_KEYS.SCHEDULES, schedules);

    // Update matched consultation
    const consultations = this.getConsultations();
    const cIdx = consultations.findIndex((c) => c.id === currentSchedule.consultationId);
    if (cIdx !== -1) {
      if (payload.name) consultations[cIdx].name = payload.name;
      if (payload.institution) consultations[cIdx].institution = payload.institution;
      if (payload.whatsapp) consultations[cIdx].whatsapp = payload.whatsapp;
      if (payload.email) consultations[cIdx].email = payload.email;
      if (payload.topic) consultations[cIdx].topic = payload.topic;
      if (payload.notes) consultations[cIdx].notes = payload.notes;
      if (payload.date) consultations[cIdx].estimatedDate = payload.date;
      if (payload.startTime && payload.endTime) {
        consultations[cIdx].estimatedTime = `${payload.startTime} – ${payload.endTime} WIB`;
      }
      if (payload.status === "selesai") consultations[cIdx].status = "selesai";
      else if (payload.status === "dibatalkan") consultations[cIdx].status = "dibatalkan";
      else if (payload.status === "aktif") consultations[cIdx].status = "terjadwal";

      setStorage(STORAGE_KEYS.CONSULTATIONS, consultations);
    }

    // Sync to Google Calendar
    syncToGoogleCalendarBackground({
      scheduleId,
      name: payload.name || consultations[cIdx]?.name || "Pemohon Terdaftar",
      institution: payload.institution || consultations[cIdx]?.institution,
      topic: payload.topic || consultations[cIdx]?.topic,
      notes: payload.notes || currentSchedule.notes,
      date: currentSchedule.date,
      startTime: currentSchedule.startTime,
      endTime: currentSchedule.endTime,
      method: currentSchedule.method,
      platform: currentSchedule.platform,
      meetingLink: currentSchedule.meetingLink,
      location: currentSchedule.location,
      room: currentSchedule.room,
      status: currentSchedule.status,
    });

    return true;
  },

  // Delete schedule
  deleteSchedule(scheduleId: string): boolean {
    const schedules = this.getSchedules();
    const target = schedules.find((s) => s.scheduleId === scheduleId);
    if (!target) return false;

    const filteredSchedules = schedules.filter((s) => s.scheduleId !== scheduleId);
    setStorage(STORAGE_KEYS.SCHEDULES, filteredSchedules);

    const consultations = this.getConsultations();
    const filteredConsultations = consultations.filter((c) => c.id !== target.consultationId);
    setStorage(STORAGE_KEYS.CONSULTATIONS, filteredConsultations);

    return true;
  },

  // Get enriched schedule list with consultation data joined
  getEnrichedSchedules() {
    const schedules = this.getSchedules();
    const consultations = this.getConsultations();

    return schedules.map((s) => {
      const c = consultations.find((item) => item.id === s.consultationId);
      return {
        ...s,
        name: c?.name || "Pemohon Terdaftar",
        institution: c?.institution || "Instansi Terkait",
        position: c?.position || "-",
        whatsapp: c?.whatsapp || "",
        email: c?.email || "",
        topic: c?.topic || "Konsultasi JF Kebencanaan",
        consultationNotes: c?.notes || "",
      };
    });
  }
};
