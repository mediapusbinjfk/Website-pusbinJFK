import { StatisticMetric } from "@/types";

export const mockUnitStatistics: StatisticMetric[] = [
  {
    label: "Personel Pengelola",
    value: 12,
    suffix: " Orang",
    description: "Pejabat fungsional dan pelaksana teknis di unit pembina",
    iconName: "Users"
  },
  {
    label: "Program Kerja",
    value: 8,
    suffix: " Agenda",
    description: "Program pembinaan, regulasi, dan sertifikasi berjalan",
    iconName: "Briefcase"
  },
  {
    label: "Kegiatan & Bimtek",
    value: 24,
    suffix: " Kali",
    description: "Total kegiatan koordinasi, bimtek, dan ukom terselenggara",
    iconName: "CalendarDays"
  },
  {
    label: "Dokumen & SOP",
    value: 56,
    suffix: " Berkas",
    description: "Pedoman, regulasi, materi diklat, dan format standar",
    iconName: "FileText"
  }
];

export const mockDashboardMetrics = {
  activeProgramsCount: 3,
  completedProgramsCount: 4,
  upcomingEventsCount: 2,
  totalCertifiedJF: 480,
  provincesCovered: 38,
  averageUkomScore: 84.5
};
