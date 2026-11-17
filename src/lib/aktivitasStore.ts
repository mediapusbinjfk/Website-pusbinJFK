/**
 * aktivitasStore.ts
 * 
 * SINGLE SOURCE OF TRUTH untuk data Dokumentasi Kegiatan.
 * 
 * Cara kerjanya:
 * - Admin portal (/admin/dokumentasi) -> WRITE: tambah, edit, hapus
 * - Halaman publik (/informasi-publik/dokumentasi-kegiatan) -> READ: baca data yang sama
 * 
 * Karena Zustand menyimpan state di memori browser yang sama (in-memory),
 * perubahan dari admin akan LANGSUNG tercermin di halaman publik
 * tanpa perlu refresh selama masih dalam satu browser session.
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

// Inisialisasi awal kosong mengikuti database Supabase (0 records)
const INITIAL_AKTIVITAS: Aktivitas[] = [];

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
