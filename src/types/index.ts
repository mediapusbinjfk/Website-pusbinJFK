export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export interface Employee {
  id: string;
  nip: string;
  name: string;
  position: string;
  roleLevel: 'Utama' | 'Madya' | 'Muda' | 'Pertama' | 'Pelaksana' | 'Terampil';
  unit: string;
  education: string;
  expertise: string[];
  photoUrl: string;
  email: string;
  phone?: string;
  bio?: string;
  certification?: string[];
}

export interface WorkProgram {
  id: string;
  code: string;
  title: string;
  objective: string;
  timeline: string;
  status: 'Direncanakan' | 'Berjalan' | 'Selesai' | 'Arsip';
  responsiblePerson: string;
  targetOutput: string;
  progressPercent: number;
  category: string;
  budgetYear: number;
}

export interface Activity {
  id: string;
  title: string;
  category: 'Rapat Koordinasi' | 'Bimbingan Teknis' | 'Evaluasi' | 'Penyusunan Regulasi' | 'Sosialisasi';
  date: string;
  time?: string;
  location: string;
  description: string;
  image: string;
  participantsCount: number;
  organizer: string;
  status: 'Akan Datang' | 'Selesai' | 'Sedang Berlangsung';
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: 'Berita' | 'Pengumuman' | 'Kegiatan' | 'Informasi Internal' | 'Program Kerja';
  date: string;
  author: string;
  summary: string;
  content: string[];
  thumbnail: string;
  isFeatured?: boolean;
  tags: string[];
}

export interface DocumentItem {
  id: string;
  code: string;
  title: string;
  category: 'SOP' | 'Pedoman Kerja' | 'Laporan Kinerja' | 'Regulasi' | 'Materi Paparan' | 'Formulir';
  year: number;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  downloadUrl: string;
  description: string;
  publishDate: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Dokumentasi Rapat' | 'Pelatihan' | 'Kunjungan Kerja' | 'Sosialisasi';
  type: 'image' | 'video';
  thumbnail: string;
  mediaUrl: string;
  date: string;
  description: string;
  caption?: string;
}

export interface OrgNode {
  id: string;
  name: string;
  title: string;
  level: number;
  unitName: string;
  description?: string;
  children?: OrgNode[];
}

export interface StatisticMetric {
  label: string;
  value: number;
  suffix?: string;
  description: string;
  iconName: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  type: 'berita' | 'dokumen' | 'sdm' | 'kegiatan' | 'program' | 'halaman';
  url: string;
  date?: string;
  description?: string;
}
