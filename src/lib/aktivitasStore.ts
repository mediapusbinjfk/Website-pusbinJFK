/**
 * aktivitasStore.ts
 * 
 * SINGLE SOURCE OF TRUTH untuk data Dokumentasi Kegiatan.
 * 
 * Cara kerjanya:
 * - Admin portal (/admin/dokumentasi) → WRITE: tambah, edit, hapus
 * - Halaman publik (/informasi-publik/dokumentasi-kegiatan) → READ: baca data yang sama
 * 
 * Karena Zustand menyimpan state di memori browser yang sama (in-memory),
 * perubahan dari admin akan LANGSUNG tercermin di halaman publik
 * tanpa perlu refresh — selama masih dalam satu browser session.
 */

import { create } from 'zustand';

export interface Aktivitas {
  id: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  image: string;
  participantsCount: number;
  organizer: string;
  status: 'Akan Datang' | 'Selesai' | 'Sedang Berlangsung';
  photoCount?: number;
  createdAt?: string;
}

interface AktivitasStore {
  aktivitas: Aktivitas[];
  addAktivitas: (item: Aktivitas) => void;
  updateAktivitas: (id: string, updated: Partial<Aktivitas>) => void;
  deleteAktivitas: (id: string) => void;
}

const INITIAL_AKTIVITAS: Aktivitas[] = [
  {
    id: "ACT-001",
    title: "Rapat Koordinasi Nasional Pembinaan Jabatan Fungsional Kebencanaan 2026",
    category: "Rapat Koordinasi",
    date: "2026-08-14",
    time: "08:30 - 16:30 WIB",
    location: "Graha BNPB Jakarta & Daring (Hybrid)",
    description: "Pertemuan strategis bersama perwakilan BKD/BKPSDM dan BPBD dari 38 Provinsi guna sinkronisasi petunjuk teknis penilaian kinerja aparatur dan formasi jabatan fungsional.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    participantsCount: 220,
    organizer: "Unit Pembina JF BNPB",
    status: "Selesai",
    photoCount: 12,
  },
  {
    id: "ACT-002",
    title: "Pelaksanaan Uji Kompetensi Kenaikan Jenjang Jabatan Fungsional Periode I",
    category: "Bimbingan Teknis",
    date: "2026-09-10",
    time: "08:00 - 17:00 WIB",
    location: "Pusdiklat PB BNPB, Sentul, Jawa Barat",
    description: "Asesmen portofolio, tes tertulis situasional, dan wawancara kompetensi teknis bagi calon Penata Penanggulangan Bencana Ahli Muda dan Madya.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    participantsCount: 85,
    organizer: "Tim Asesor Ukom BNPB",
    status: "Selesai",
    photoCount: 8,
  },
  {
    id: "ACT-003",
    title: "Workshop Penyusunan Portofolio Bukti Kerja Berbasis Digital",
    category: "Bimbingan Teknis",
    date: "2026-09-28",
    time: "09:00 - 15:00 WIB",
    location: "Ruang Rapat Utama Lt. 12, Graha BNPB",
    description: "Pendampingan teknis tata cara pengunggahan bukti dukung capaian kinerja, penulisan artikel ilmiah, dan integrasi angka kredit ke portal nasional.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    participantsCount: 60,
    organizer: "Sub-Tim Advokasi & Pengembangan Profesi",
    status: "Akan Datang",
    photoCount: 6,
  },
  {
    id: "ACT-004",
    title: "Fasilitasi Harmonisasi Standar Kompetensi Kerja Nasional Indonesia (SKKNI)",
    category: "Penyusunan Regulasi",
    date: "2026-07-22",
    time: "09:00 - 17:00 WIB",
    location: "Hotel Grand Sahid Jaya, Jakarta",
    description: "Sinergi bersama Kemnaker dan BNSP dalam rangka peninjauan ulang unit kompetensi teknis penanggulangan bencana era modern.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    participantsCount: 45,
    organizer: "Sub-Tim Standardisasi & Uji Kompetensi",
    status: "Selesai",
    photoCount: 15,
  },
  {
    id: "ACT-005",
    title: "Sosialisasi Peraturan Baru Konversi Predikat Kinerja ke Angka Kredit",
    category: "Sosialisasi",
    date: "2026-10-05",
    time: "09:30 - 12:00 WIB",
    location: "Webinar Zoom & Youtube Live",
    description: "Sosialisasi terbuka bagi seluruh ASN pemangku jabatan fungsional kebencanaan di kementerian, lembaga, dan pemerintah daerah se-Indonesia.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    participantsCount: 500,
    organizer: "Sub-Tim Penilaian Kinerja",
    status: "Akan Datang",
    photoCount: 4,
  },
  {
    id: "ACT-006",
    title: "Evaluasi Tahunan Pelaksanaan Pembinaan JF & Asesmen Kebutuhan Diklat",
    category: "Evaluasi",
    date: "2026-06-18",
    time: "09:00 - 16:00 WIB",
    location: "Auditorium Pusdiklat Sentul",
    description: "Rapat pleno peninjauan efektivitas kurikulum pelatihan teknis dan rekomendasi formasi aparatur fungsional di instansi pembina.",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    participantsCount: 70,
    organizer: "Unit Pembina JF BNPB",
    status: "Selesai",
    photoCount: 10,
  },
];

export const useAktivitasStore = create<AktivitasStore>((set) => ({
  aktivitas: INITIAL_AKTIVITAS,
  addAktivitas: (item) => set((state) => ({ aktivitas: [item, ...state.aktivitas] })),
  updateAktivitas: (id, updated) =>
    set((state) => ({
      aktivitas: state.aktivitas.map((a) => (a.id === id ? { ...a, ...updated } : a)),
    })),
  deleteAktivitas: (id) =>
    set((state) => ({ aktivitas: state.aktivitas.filter((a) => a.id !== id) })),
}));
