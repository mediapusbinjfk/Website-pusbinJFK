import { OrgNode } from "@/types";

export const mockOrgStructure: OrgNode = {
  id: "org-01",
  name: "Kepala Badan Nasional Penanggulangan Bencana",
  title: "Pimpinan Lembaga",
  level: 1,
  unitName: "BNPB Pusat",
  description: "Penanggung jawab utama penyelenggaraan penanggulangan bencana di Indonesia.",
  children: [
    {
      id: "org-02",
      name: "Sekretaris Utama BNPB",
      title: "Pimpinan Tinggi Madya",
      level: 2,
      unitName: "Sekretariat Utama",
      description: "Pengarah administrasi, pembinaan SDM aparatur, dan tata kelola organisasi.",
      children: [
        {
          id: "org-03",
          name: "Kepala Biro Sumber Daya Manusia & Organisasi",
          title: "Pimpinan Tinggi Pratama",
          level: 3,
          unitName: "Biro SDM dan Organisasi",
          description: "Pembina administratif dan kelembagaan seluruh jabatan fungsional.",
          children: [
            {
              id: "org-04",
              name: "Ketua Tim Kerja Pembinaan Jabatan Fungsional",
              title: "Koordinator / JF Madya",
              level: 4,
              unitName: "Unit Kerja Pengelola JF",
              description: "Penanggung jawab operasional pembinaan, uji kompetensi, dan karir jabatan fungsional.",
              children: [
                {
                  id: "org-05",
                  name: "Sub-Tim Standardisasi & Uji Kompetensi",
                  title: "Jabatan Fungsional Madya & Muda",
                  level: 5,
                  unitName: "Kelompok Kerja Teknis 1",
                  description: "Pelaksana evaluasi materi uji, asesmen berkas, dan standarisasi silabus."
                },
                {
                  id: "org-06",
                  name: "Sub-Tim Penilaian Kinerja & Angka Kredit",
                  title: "Jabatan Fungsional Madya & Muda",
                  level: 5,
                  unitName: "Kelompok Kerja Teknis 2",
                  description: "Pelaksana verifikasi konversi SKP, penetapan PAK, dan koordinasi instansi pengusul."
                },
                {
                  id: "org-07",
                  name: "Sub-Tim Advokasi & Pengembangan Profesi",
                  title: "Jabatan Fungsional Muda & Pertama",
                  level: 5,
                  unitName: "Kelompok Kerja Teknis 3",
                  description: "Layanan konsultasi regulasi, seminar profesi, bimbingan teknis, dan publikasi jurnal."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
