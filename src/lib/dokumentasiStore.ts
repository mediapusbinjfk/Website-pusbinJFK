import { create } from 'zustand';
import type { DocumentationStatus } from '@/types/admin';

export interface Documentation {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  photoCount: number;
  status: DocumentationStatus;
  createdBy: string;
  createdAt: string;
  content?: string;
}

interface DokumentasiStore {
  docs: Documentation[];
  addDoc: (doc: Documentation) => void;
  updateDoc: (id: string, updatedDoc: Partial<Documentation>) => void;
  deleteDoc: (id: string) => void;
}

const INITIAL_DOCS: Documentation[] = [
  {
    id: "DOK-001",
    title: "Rapat Koordinasi Nasional Pembinaan JF Kebencanaan 2026",
    date: "2026-08-14",
    location: "Graha BNPB, Jakarta",
    category: "Dokumentasi Rapat",
    photoCount: 12,
    status: "published",
    createdBy: "Admin",
    createdAt: "2026-08-15",
  },
  {
    id: "DOK-002",
    title: "Pelaksanaan Asesmen Uji Kompetensi Kenaikan Jenjang",
    date: "2026-09-10",
    location: "Pusdiklat PB Sentul, Bogor",
    category: "Pelatihan",
    photoCount: 8,
    status: "published",
    createdBy: "Admin",
    createdAt: "2026-09-11",
  },
  {
    id: "DOK-003",
    title: "Workshop Portofolio Kinerja Digital & Penilaian PAK",
    date: "2026-07-20",
    location: "Ruang Rapat Lt. 12 BNPB",
    category: "Pelatihan",
    photoCount: 6,
    status: "draft",
    createdBy: "Admin",
    createdAt: "2026-07-21",
  },
  {
    id: "DOK-004",
    title: "Kunjungan Kerja Supervisi ke Jawa Timur",
    date: "2026-06-05",
    location: "Kantor BPBD Jawa Timur, Sidoarjo",
    category: "Kunjungan Kerja",
    photoCount: 15,
    status: "published",
    createdBy: "Admin",
    createdAt: "2026-06-06",
  },
  {
    id: "DOK-005",
    title: "Sosialisasi Virtual Kebijakan Baru PermenPANRB",
    date: "2026-05-18",
    location: "Studio Multimedia BNPB",
    category: "Sosialisasi",
    photoCount: 4,
    status: "archived",
    createdBy: "Admin",
    createdAt: "2026-05-19",
  },
];

export const useDokumentasiStore = create<DokumentasiStore>((set) => ({
  docs: INITIAL_DOCS,
  addDoc: (doc) => set((state) => ({ docs: [doc, ...state.docs] })),
  updateDoc: (id, updatedDoc) =>
    set((state) => ({
      docs: state.docs.map((d) => (d.id === id ? { ...d, ...updatedDoc } : d)),
    })),
  deleteDoc: (id) =>
    set((state) => ({ docs: state.docs.filter((d) => d.id !== id) })),
}));
