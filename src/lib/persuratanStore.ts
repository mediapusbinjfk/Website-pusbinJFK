export type LetterChannel = "eksternal_srikandi" | "internal_email";

export type LetterUrgency = "biasa" | "penting" | "segera" | "rahasia";

export type LetterStatus = 
  | "terkirim" 
  | "diverifikasi" 
  | "disposisi" 
  | "selesai" 
  | "ditolak";

export interface IntegratedLetter {
  id: string; // Misal: SRT-INT-20261012-001 atau SRT-EXT-20261012-002
  channel: LetterChannel;
  senderName: string;
  senderNip?: string;
  senderInstitution: string;
  senderEmail: string;
  senderPhone: string;
  letterNumber: string; // Nomor Surat Dinas
  letterDate: string;   // Tanggal Surat
  classification: string; // Klasifikasi perihal
  urgency: LetterUrgency;
  subject: string;      // Perihal surat
  summary?: string;     // Ringkasan isi naskah
  srikandiAgendaNumber?: string; // Khusus Eksternal
  fileName?: string;
  fileSize?: string;
  targetEmail: string;
  destination: string;
  status: LetterStatus;
  submittedAt: string;
  dispositionNotes?: string;
}

const STORAGE_KEY = "jf_bnpb_integrated_letters";

const SEED_LETTERS: IntegratedLetter[] = [
  {
    id: "SRT-INT-20261008-0012",
    channel: "internal_email",
    senderName: "Andi Kurniawan, S.Kom., M.T.",
    senderNip: "198705122010121002",
    senderInstitution: "Pusat Data, Informasi dan Komunikasi Kebencanaan (Pusdatinkom BNPB)",
    senderEmail: "andi.kurniawan@bnpb.go.id",
    senderPhone: "081288990011",
    letterNumber: "ND.204/BNPB/PDIK/KP.02/10/2026",
    letterDate: "2026-10-08",
    classification: "Usulan Formasi & Kebutuhan JF",
    urgency: "penting",
    subject: "Usulan Kebutuhan dan Formasi Penata Penanggulangan Bencana Ahli Pertama s.d. Madya TA 2027",
    summary: "Penyampaian telaahan analisis beban kerja (ABK) dan usulan kebutuhan 12 formasi JF Penata PB untuk penguatan kesiapsiagaan digital.",
    fileName: "Usulan_Formasi_PenataPB_Pusdatinkom_2026.pdf",
    fileSize: "2.4 MB",
    targetEmail: "SetPusbinJFK@bnpb.go.id",
    destination: "Pusat Pembinaan Jabatan Fungsional BNPB",
    status: "disposisi",
    submittedAt: "2026-10-08T09:30:00.000Z",
    dispositionNotes: "Telah didisposisikan ke Tim Pokja Formasi & Pembinaan Karir JF untuk verifikasi data ABK.",
  },
  {
    id: "SRT-EXT-20261009-0005",
    channel: "eksternal_srikandi",
    senderName: "Dra. Hj. Sri Wahyuningsih, M.Si.",
    senderNip: "197509141999032001",
    senderInstitution: "Badan Penanggulangan Bencana Daerah (BPBD) Provinsi Jawa Timur",
    senderEmail: "sekretariat@bpbd.jatimprov.go.id",
    senderPhone: "081133445566",
    letterNumber: "005/1842/BPBD/X/2026",
    letterDate: "2026-10-09",
    classification: "Permohonan Rekomendasi Uji Kompetensi (UKOM)",
    urgency: "segera",
    subject: "Permohonan Rekomendasi Pelaksanaan Uji Kompetensi Kenaikan Jenjang Jabatan Fungsional Penata PB",
    summary: "Pengajuan verifikasi kelengkapan berkas portofolio dan rekomendasi UKOM bagi 5 pejabat fungsional Penata PB yang akan naik ke jenjang Ahli Madya.",
    srikandiAgendaNumber: "SRK-JTM-2026-98124",
    fileName: "Surat_Permohonan_UKOM_BPBD_Jatim_1842.pdf",
    fileSize: "4.1 MB",
    targetEmail: "SetPusbinJFK@bnpb.go.id",
    destination: "Badan Nasional Penanggulangan Bencana (Pusbin JFK)",
    status: "diverifikasi",
    submittedAt: "2026-10-09T14:15:00.000Z",
    dispositionNotes: "Dokumen naskah masuk via SRIKANDI terverifikasi. Berkas sedang dicek kelengkapannya oleh Subbag Tata Usaha.",
  },
  {
    id: "SRT-INT-20261011-0019",
    channel: "internal_email",
    senderName: "Bambang Sudarmanto, S.T.",
    senderNip: "199104052014021004",
    senderInstitution: "Direktorat Kesiapsiagaan, Deputi Pencegahan BNPB",
    senderEmail: "bambang.s@bnpb.go.id",
    senderPhone: "081377889922",
    letterNumber: "B-412/BNPB/D-II/KS/10/2026",
    letterDate: "2026-10-11",
    classification: "Permohonan Undangan Narasumber / Pendampingan",
    urgency: "biasa",
    subject: "Permohonan Narasumber Sosialisasi Butir Kegiatan dan Penilaian Kinerja JF Penata PB",
    summary: "Permohonan fasilitator/narasumber dari Pusat Pembinaan JF untuk workshop penguatan kapasitas aparatur bencana daerah.",
    fileName: "Permohonan_Narasumber_Sosialisasi_JF.pdf",
    fileSize: "1.8 MB",
    targetEmail: "SetPusbinJFK@bnpb.go.id",
    destination: "Pusat Pembinaan Jabatan Fungsional BNPB",
    status: "terkirim",
    submittedAt: "2026-10-11T10:45:00.000Z",
  },
];

export const PersuratanStore = {
  getLetters(): IntegratedLetter[] {
    if (typeof window === "undefined") return SEED_LETTERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LETTERS));
        return SEED_LETTERS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error("[PersuratanStore] Failed to read letters:", e);
      return SEED_LETTERS;
    }
  },

  addLetter(
    data: Omit<IntegratedLetter, "id" | "submittedAt" | "status" | "targetEmail" | "destination"> & {
      status?: LetterStatus;
    }
  ): IntegratedLetter {
    const letters = this.getLetters();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const prefix = data.channel === "eksternal_srikandi" ? "SRT-EXT" : "SRT-INT";
    const id = `${prefix}-${dateStr}-${randomSeq}`;

    const newLetter: IntegratedLetter = {
      ...data,
      id,
      targetEmail: "SetPusbinJFK@bnpb.go.id",
      destination: data.channel === "eksternal_srikandi" 
        ? "Badan Nasional Penanggulangan Bencana (Pusbin JFK)"
        : "Pusat Pembinaan Jabatan Fungsional BNPB",
      status: data.status || "terkirim",
      submittedAt: new Date().toISOString(),
    };

    const updated = [newLetter, ...letters];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("[PersuratanStore] Failed to save letter:", e);
      }
    }
    return newLetter;
  },

  getLetterById(id: string): IntegratedLetter | undefined {
    return this.getLetters().find((l) => l.id.toLowerCase() === id.toLowerCase());
  },

  updateStatus(id: string, status: LetterStatus, dispositionNotes?: string): IntegratedLetter | null {
    const letters = this.getLetters();
    const index = letters.findIndex((l) => l.id === id);
    if (index === -1) return null;

    letters[index] = {
      ...letters[index],
      status,
      dispositionNotes: dispositionNotes !== undefined ? dispositionNotes : letters[index].dispositionNotes,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
      } catch (e) {
        console.error("[PersuratanStore] Failed to update letter status:", e);
      }
    }
    return letters[index];
  },
};
