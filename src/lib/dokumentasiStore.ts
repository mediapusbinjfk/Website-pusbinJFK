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

const INITIAL_DOCS: Documentation[] = [];

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
