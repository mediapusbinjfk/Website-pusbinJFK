/**
 * WhatsAppService
 * 
 * Abstraksi untuk pengiriman notifikasi WhatsApp.
 * Mendukung template pesan dinamis untuk penjadwalan dan reschedule.
 * 
 * PENTING: Service ini hanya boleh digunakan di server-side.
 */

import { ServiceResult } from "@/types/admin";
import type { ConsultationSchedule, TemplateType } from "@/types/admin";

// ============================================================
// TEMPLATE PESAN DEFAULT
// ============================================================
export const DEFAULT_WHATSAPP_TEMPLATES: Record<TemplateType, string> = {
  jadwal: `Yth. Bapak/Ibu {{nama}},

Pengajuan konsultasi Jabatan Fungsional Anda telah dijadwalkan.

Detail konsultasi:

Tanggal : {{tanggal}}
Waktu   : {{jam_mulai}} – {{jam_selesai}} WIB
Metode  : {{metode}}
{{detail}}

Mohon hadir sesuai dengan jadwal yang telah ditentukan.

Terima kasih.

Portal Jabatan Fungsional BNPB`,

  reschedule: `Yth. Bapak/Ibu {{nama}},

Kami informasikan bahwa jadwal konsultasi Jabatan Fungsional Anda mengalami perubahan.

Jadwal sebelumnya:
Tanggal : {{tanggal_lama}}
Waktu   : {{waktu_lama}}

Jadwal terbaru:
Tanggal : {{tanggal_baru}}
Waktu   : {{waktu_baru}} WIB
Metode  : {{metode}}
{{detail}}

Mohon memperhatikan jadwal terbaru tersebut.

Terima kasih.

Portal Jabatan Fungsional BNPB`,

  penolakan: `Yth. Bapak/Ibu {{nama}},

Kami informasikan bahwa pengajuan konsultasi Jabatan Fungsional Anda (ID: {{id_pengajuan}}) tidak dapat kami proses untuk saat ini.

Alasan: {{alasan}}

Anda dapat mengajukan kembali melalui portal kami.

Terima kasih.

Portal Jabatan Fungsional BNPB`,

  selesai: `Yth. Bapak/Ibu {{nama}},

Konsultasi Jabatan Fungsional Anda telah selesai dilaksanakan.

Terima kasih atas partisipasi Anda. Semoga konsultasi yang telah diberikan bermanfaat.

Portal Jabatan Fungsional BNPB`,
};

// ============================================================
// TIPE KONTEKS TEMPLATE
// ============================================================
export interface ScheduleTemplateContext {
  nama: string;
  id_pengajuan: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  metode: string;
  // Online
  platform?: string;
  link_meeting?: string;
  // Offline
  lokasi?: string;
  ruangan?: string;
  alamat?: string;
}

export interface RescheduleTemplateContext extends ScheduleTemplateContext {
  tanggal_lama: string;
  waktu_lama: string;
  tanggal_baru: string;
  waktu_baru: string;
}

// ============================================================
// HELPER: RENDER TEMPLATE
// ============================================================

/**
 * Ganti semua placeholder {{variable}} dalam template dengan nilai aktual.
 */
export function renderTemplate(
  template: string,
  context: Record<string, string | undefined>
): string {
  let rendered = template;
  for (const [key, value] of Object.entries(context)) {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, "g"), value || "");
  }
  return rendered;
}

/**
 * Build detail section untuk pesan WhatsApp berdasarkan metode (online/offline).
 */
export function buildScheduleDetail(schedule: ConsultationSchedule): string {
  if (schedule.method === "online") {
    return [
      schedule.platform ? `Platform : ${schedule.platform}` : "",
      schedule.meetingLink ? `Link     : ${schedule.meetingLink}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    return [
      schedule.location ? `Lokasi   : ${schedule.location}` : "",
      schedule.room ? `Ruangan  : ${schedule.room}` : "",
      schedule.address ? `Alamat   : ${schedule.address}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
}

// ============================================================
// WHATSAPP SERVICE CLASS
// ============================================================
class WhatsAppService {
  private apiUrl: string;
  private apiToken: string;
  private phoneNumberId: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || "";
    this.apiToken = process.env.WHATSAPP_API_TOKEN || "";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  }

  private isConfigured(): boolean {
    return !!this.apiUrl && !!this.apiToken && !!this.phoneNumberId;
  }

  /**
   * Kirim pesan WhatsApp ke nomor tujuan.
   */
  async sendMessage(
    recipientPhone: string,
    message: string
  ): Promise<ServiceResult<{ messageId: string; providerResponse: string }>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error:
          "WhatsApp API belum dikonfigurasi. Isi WHATSAPP_API_URL, WHATSAPP_API_TOKEN, dan WHATSAPP_PHONE_NUMBER_ID di .env.local",
      };
    }

    // Normalisasi nomor telepon (hapus karakter non-digit, pastikan diawali kode negara)
    const normalizedPhone = this.normalizePhone(recipientPhone);

    try {
      // TODO: Implementasi dengan WhatsApp Business API
      // Contoh menggunakan fetch ke Meta WhatsApp Cloud API:
      //
      // const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     messaging_product: 'whatsapp',
      //     to: normalizedPhone,
      //     type: 'text',
      //     text: { body: message },
      //   }),
      // });
      //
      // const result = await response.json();
      // if (!response.ok) {
      //   return { success: false, error: JSON.stringify(result) };
      // }
      //
      // return {
      //   success: true,
      //   data: {
      //     messageId: result.messages[0].id,
      //     providerResponse: JSON.stringify(result),
      //   }
      // };

      console.warn(
        `[WhatsAppService] sendMessage(${normalizedPhone}) - Belum diimplementasi`
      );
      return {
        success: true,
        data: {
          messageId: `mock-msg-${Date.now()}`,
          providerResponse: "PLACEHOLDER - WA API belum dikonfigurasi",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Gagal mengirim WhatsApp: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  /**
   * Normalisasi nomor telepon ke format internasional Indonesia.
   * Contoh: 0812... → 62812...
   */
  normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      return "62" + digits.slice(1);
    }
    if (!digits.startsWith("62")) {
      return "62" + digits;
    }
    return digits;
  }
}

// Export singleton instance
export const whatsAppService = new WhatsAppService();
