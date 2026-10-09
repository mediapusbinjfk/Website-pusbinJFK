import { SearchResultItem } from "@/types";
import { mockNews } from "@/data/mockNews";
import { mockDocuments } from "@/data/mockDocuments";
import { mockEmployees } from "@/data/mockEmployees";
import { mockPrograms } from "@/data/mockPrograms";
import { mockActivities } from "@/data/mockActivities";
import { unitProfileData } from "@/data/mockProfile";

export function globalSearch(query: string): SearchResultItem[] {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const results: SearchResultItem[] = [];

  // Search News
  mockNews.forEach((item) => {
    if (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        id: item.id,
        title: item.title,
        category: `Berita (${item.category})`,
        type: "berita",
        url: `/berita/${item.slug}`,
        date: item.date,
        description: item.summary,
      });
    }
  });

  // Search Documents
  mockDocuments.forEach((doc) => {
    if (
      doc.title.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.code.toLowerCase().includes(q)
    ) {
      results.push({
        id: doc.id,
        title: `${doc.code} - ${doc.title}`,
        category: `Dokumen (${doc.category})`,
        type: "dokumen",
        url: `/dokumen`,
        date: doc.publishDate,
        description: doc.description,
      });
    }
  });

  // Search Employees
  mockEmployees.forEach((emp) => {
    if (
      emp.name.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      emp.unit.toLowerCase().includes(q) ||
      emp.expertise.some((e) => e.toLowerCase().includes(q))
    ) {
      results.push({
        id: emp.id,
        title: `${emp.name} (${emp.position})`,
        category: `SDM (${emp.roleLevel})`,
        type: "sdm",
        url: `/sdm`,
        description: `Keahlian: ${emp.expertise.join(", ")}`,
      });
    }
  });

  // Search Programs
  mockPrograms.forEach((prog) => {
    if (
      prog.title.toLowerCase().includes(q) ||
      prog.objective.toLowerCase().includes(q) ||
      prog.code.toLowerCase().includes(q)
    ) {
      results.push({
        id: prog.id,
        title: prog.title,
        category: `Program Kerja (${prog.status})`,
        type: "program",
        url: `/program-kerja`,
        description: prog.objective,
      });
    }
  });

  // Search Activities
  mockActivities.forEach((act) => {
    if (
      act.title.toLowerCase().includes(q) ||
      act.description.toLowerCase().includes(q) ||
      act.location.toLowerCase().includes(q)
    ) {
      results.push({
        id: act.id,
        title: act.title,
        category: `Kegiatan (${act.category})`,
        type: "kegiatan",
        url: `/kegiatan`,
        date: act.date,
        description: `${act.location} - ${act.description}`,
      });
    }
  });

  // Search Profile Pages / Content
  if (unitProfileData.unitFullName.toLowerCase().includes(q) || "visi misi".includes(q) || "sejarah".includes(q) || "dasar hukum".includes(q)) {
    results.push({
      id: "page-profil",
      title: "Profil & Visi Misi Unit Kerja JF BNPB",
      category: "Halaman Institusi",
      type: "halaman",
      url: "/profil",
      description: "Kedudukan, sejarah pembentukan, visi misi, dan dasar hukum kelembagaan.",
    });
  }

  if ("struktur organisasi hierarki pimpinan".includes(q)) {
    results.push({
      id: "page-org",
      title: "Bagan Struktur Organisasi Unit Kerja JF",
      category: "Halaman Institusi",
      type: "halaman",
      url: "/struktur-organisasi",
      description: "Hierarki pimpinan BNPB hingga kelompok kerja teknis jabatan fungsional.",
    });
  }

  if ("tugas fungsi tanggung jawab wewenang".includes(q)) {
    results.push({
      id: "page-tusi",
      title: "Tugas Pokok & Fungsi Pembinaan JF",
      category: "Halaman Institusi",
      type: "halaman",
      url: "/tugas-fungsi",
      description: "Rincian tugas utama, fungsi, koordinasi, dan output kerja fungsional.",
    });
  }

  return results;
}
