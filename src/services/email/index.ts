/**
 * EmailNotificationService
 * 
 * Modul untuk pengiriman notifikasi email otomatis ke pegawai / pemohon konsultasi.
 * Mengirim email riil melalui Zimbra/SMTP (Next.js API /api/send-email) serta menyimpan riwayat log.
 */

export interface EmailDispatchPayload {
  to: string;
  applicantName: string;
  consultationId: string;
  scheduleId: string;
  date: string;
  time: string;
  method: "online" | "offline";
  locationOrZoom: string;
  notes?: string;
}

export interface RescheduleEmailDispatchPayload extends EmailDispatchPayload {
  oldDate: string;
  oldTime: string;
  reason?: string;
}

export interface CancelEmailDispatchPayload {
  to: string;
  applicantName: string;
  consultationId: string;
  scheduleId: string;
  date: string;
  time: string;
  reason?: string;
}

export interface EmailLogEntry {
  id: string;
  sentAt: string;
  to: string;
  subject: string;
  body: string;
  status: "sent" | "queued" | "failed";
}

const STORAGE_KEY_EMAIL_LOGS = "jf_bnpb_email_logs";

/**
 * 1. Format Template Email: Persetujuan / Jadwal Baru (Approved)
 */
export function formatScheduleEmailContent(payload: EmailDispatchPayload): {
  subject: string;
  body: string;
} {
  const methodLabel = payload.method === "online" ? "Daring / Online (Zoom Meeting)" : "Luring / Tatap Muka di Graha BNPB Lt. 8";
  const detailLabel = payload.method === "online"
    ? `Tautan Zoom      : ${payload.locationOrZoom}`
    : `Lokasi Pertemuan : ${payload.locationOrZoom}`;

  const subject = `[JF BNPB] Konfirmasi Persetujuan Jadwal Konsultasi - ${payload.scheduleId}`;

  const body = `Yth. Bapak/Ibu ${payload.applicantName},

Semoga Bapak/Ibu senantiasa dalam keadaan sehat dan dilancarkan dalam menjalankan seluruh tugas kedinasan.

Sehubungan dengan permohonan konsultasi Jabatan Fungsional Kebencanaan yang telah Bapak/Ibu ajukan, kami menginformasikan dengan hormat bahwa permohonan tersebut telah disetujui dan dijadwalkan dengan rincian sebagai berikut:

RINCIAN JADWAL KONSULTASI
• No. Tiket Jadwal : ${payload.scheduleId}
• No. Pengajuan    : ${payload.consultationId}
• Nama Pemohon     : ${payload.applicantName}
• Tanggal          : ${payload.date}
• Waktu            : ${payload.time}
• Metode           : ${methodLabel}
• ${detailLabel}
${payload.notes ? `• Catatan Topik    : ${payload.notes}\n` : ""}
Demi kelancaran dan ketepatan waktu konsultasi, kami mengimbau Bapak/Ibu berkenan hadir atau bergabung 10 menit sebelum sesi dimulai. Apabila terdapat dokumen dukung yang ingin dibahas, silakan disiapkan terlebih dahulu.

Apabila Bapak/Ibu memerlukan koordinasi atau informasi lebih lanjut, silakan menghubungi Tim Helpdesk Pembinaan JF Kebencanaan BNPB melalui:
- Surel (Email) : PusbinJFKebencanaan@bnpb.go.id
- Telepon       : 085111380175 / 117
- Lokasi        : Gedung Graha BNPB Lt. 8, Jl. Pramuka No. 38, Matraman, Jakarta Timur

Demikian pemberitahuan ini kami sampaikan. Atas perhatian, kerja sama, dan dedikasi Bapak/Ibu, kami mengucapkan terima kasih.

Hormat kami,
Pusat Pembinaan Jabatan Fungsional Kebencanaan
Badan Nasional Penanggulangan Bencana (BNPB)`;

  return { subject, body };
}

/**
 * 2. Format Template Email: Reschedule (Perubahan Jadwal)
 */
export function formatRescheduleEmailContent(payload: RescheduleEmailDispatchPayload): {
  subject: string;
  body: string;
} {
  const methodLabel = payload.method === "online" ? "Daring / Online (Zoom Meeting)" : "Luring / Tatap Muka di Graha BNPB Lt. 8";
  const detailLabel = payload.method === "online"
    ? `Tautan Zoom      : ${payload.locationOrZoom}`
    : `Lokasi Pertemuan : ${payload.locationOrZoom}`;

  const subject = `[JF BNPB] Penyesuaian Jadwal (Reschedule) Konsultasi - ${payload.scheduleId}`;

  const body = `Yth. Bapak/Ibu ${payload.applicantName},

Semoga Bapak/Ibu senantiasa dalam keadaan sehat walafiat.

Sehubungan dengan permohonan konsultasi Jabatan Fungsional Kebencanaan yang telah terdaftar, kami menyampaikan permohonan maaf terlebih dahulu atas ketidaknyamanan yang mungkin timbul. Bersama ini kami informasikan bahwa terdapat penyesuaian jadwal pelaksanaan sesi konsultasi dengan rincian sebagai berikut:

INFORMASI PENYESUAIAN JADWAL KONSULTASI
• No. Tiket Jadwal : ${payload.scheduleId}
• No. Pengajuan    : ${payload.consultationId}
• Nama Pemohon     : ${payload.applicantName}

Jadwal Sebelumnya:
• Tanggal          : ${payload.oldDate}
• Waktu            : ${payload.oldTime}

Jadwal Terbaru:
• Tanggal          : ${payload.date}
• Waktu            : ${payload.time}
• Metode           : ${methodLabel}
• ${detailLabel}
${payload.reason ? `• Alasan Perubahan : ${payload.reason}\n` : ""}${payload.notes ? `• Catatan Topik    : ${payload.notes}\n` : ""}
Kami memohon kesediaan Bapak/Ibu untuk menyesuaikan agenda dengan jadwal terbaru tersebut, serta berkenan hadir atau bergabung 10 menit sebelum waktu konsultasi.

Apabila terdapat pertanyaan atau kendala terkait jadwal baru ini, Bapak/Ibu dapat menghubungi kami melalui:
- Surel (Email) : PusbinJFKebencanaan@bnpb.go.id
- Telepon       : 085111380175 / 117
- Lokasi        : Gedung Graha BNPB Lt. 8, Jl. Pramuka No. 38, Matraman, Jakarta Timur

Atas pengertian, kerja sama, dan kelapangan hati Bapak/Ibu, kami mengucapkan terima kasih.

Hormat kami,
Pusat Pembinaan Jabatan Fungsional Kebencanaan
Badan Nasional Penanggulangan Bencana (BNPB)`;

  return { subject, body };
}

/**
 * 3. Format Template Email: Pembatalan Jadwal (Cancel)
 */
export function formatCancelEmailContent(payload: CancelEmailDispatchPayload): {
  subject: string;
  body: string;
} {
  const subject = `[JF BNPB] Pemberitahuan Pembatalan Jadwal Konsultasi - ${payload.scheduleId}`;

  const body = `Yth. Bapak/Ibu ${payload.applicantName},

Semoga Bapak/Ibu senantiasa dalam keadaan sehat walafiat.

Sehubungan dengan rencana sesi konsultasi Jabatan Fungsional Kebencanaan BNPB yang telah terdaftar sebelumnya, kami menyampaikan permohonan maaf yang sebesar-besarnya. Bersama ini kami menginformasikan bahwa sesi konsultasi tersebut untuk saat ini dibatalkan dengan rincian sebagai berikut:

RINCIAN PEMBATALAN JADWAL KONSULTASI
• No. Tiket Jadwal  : ${payload.scheduleId}
• No. Pengajuan     : ${payload.consultationId}
• Nama Pemohon      : ${payload.applicantName}
• Tanggal Semula    : ${payload.date}
• Waktu Semula      : ${payload.time}
${payload.reason ? `• Alasan Pembatalan : ${payload.reason}\n` : ""}
Kami memohon maaf atas kendala maupun ketidaknyamanan yang terjadi. Apabila Bapak/Ibu masih memerlukan pendampingan atau konsultasi di kesempatan berikutnya, Bapak/Ibu disilakan untuk mengajukan permohonan jadwal kembali melalui Portal Layanan JF BNPB.

Untuk bantuan atau konfirmasi lebih lanjut, Bapak/Ibu dapat menghubungi kami melalui:
- Surel (Email) : PusbinJFKebencanaan@bnpb.go.id
- Telepon       : 085111380175 / 117
- Lokasi        : Gedung Graha BNPB Lt. 8, Jl. Pramuka No. 38, Matraman, Jakarta Timur

Demikian pemberitahuan ini kami sampaikan. Atas perhatian dan pengertian Bapak/Ibu, kami mengucapkan terima kasih.

Hormat kami,
Pusat Pembinaan Jabatan Fungsional Kebencanaan
Badan Nasional Penanggulangan Bencana (BNPB)`;

  return { subject, body };
}

/**
 * Helper internal untuk mengirim email dan mencatat log
 */
async function dispatchEmail(to: string, subject: string, body: string): Promise<EmailLogEntry> {
  const timestamp = new Date().toISOString();
  const logId = `EML-${Date.now()}`;

  // Panggil API backend untuk mengirim email betulan via Zimbra SMTP
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to || "pegawai@instansi.go.id",
          subject,
          body
        })
      });
    } catch (error) {
      console.error("Gagal menautkan ke Zimbra API:", error);
    }
  }

  // Log ke localStorage agar dapat dimonitor di dashboard admin
  const logEntry: EmailLogEntry = {
    id: logId,
    sentAt: timestamp,
    to: to || "pegawai@instansi.go.id",
    subject,
    body,
    status: "sent",
  };

  if (typeof window !== "undefined") {
    try {
      const existingStr = window.localStorage.getItem(STORAGE_KEY_EMAIL_LOGS);
      const list: EmailLogEntry[] = existingStr ? JSON.parse(existingStr) : [];
      list.unshift(logEntry);
      window.localStorage.setItem(STORAGE_KEY_EMAIL_LOGS, JSON.stringify(list));
    } catch (e) {
      console.error("Gagal menyimpan log email:", e);
    }
  }

  return logEntry;
}

/**
 * Mengirim email jadwal baru / persetujuan (Approved)
 */
export async function sendScheduleEmailNotification(payload: EmailDispatchPayload): Promise<EmailLogEntry> {
  const { subject, body } = formatScheduleEmailContent(payload);
  return dispatchEmail(payload.to, subject, body);
}

/**
 * Mengirim email perubahan jadwal (Reschedule)
 */
export async function sendRescheduleEmailNotification(payload: RescheduleEmailDispatchPayload): Promise<EmailLogEntry> {
  const { subject, body } = formatRescheduleEmailContent(payload);
  return dispatchEmail(payload.to, subject, body);
}

/**
 * Mengirim email pembatalan jadwal (Cancel)
 */
export async function sendCancelEmailNotification(payload: CancelEmailDispatchPayload): Promise<EmailLogEntry> {
  const { subject, body } = formatCancelEmailContent(payload);
  return dispatchEmail(payload.to, subject, body);
}

export function getEmailLogs(): EmailLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_EMAIL_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
