import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockNews } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";

export const LatestInformation: React.FC = () => {
  const featuredNews = mockNews.find((n) => n.isFeatured) || mockNews[0];
  const otherNews = mockNews.filter((n) => n.id !== featuredNews.id).slice(0, 3);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Informasi Terkini Institusi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Siaran pers resmi, pengumuman uji kompetensi, dan pembaruan regulasi aparatur kebencanaan.
            </p>
          </div>

          <Link href="/informasi-publik/dokumentasi-kegiatan">
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Lihat Seluruh Informasi
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured News Card */}
          <div className="lg:col-span-7">
            <Card
              hoverable
              className="h-full flex flex-col overflow-hidden border border-slate-200 bg-white"
            >
              <div className="relative h-64 sm:h-72 w-full bg-slate-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredNews.thumbnail}
                  alt={featuredNews.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="primary" className="bg-[#005BAA] text-white border-none font-bold">
                    Utama
                  </Badge>
                  <Badge variant="secondary" className="bg-white/95 text-slate-800 font-semibold">
                    {featuredNews.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#F7941D]" />
                      {formatDate(featuredNews.date)}
                    </span>
                    <span>•</span>
                    <span>Oleh: {featuredNews.author}</span>
                  </div>

                  <Link href="/informasi-publik/dokumentasi-kegiatan">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 hover:text-[#005BAA] transition-colors leading-snug">
                      {featuredNews.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {featuredNews.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {featuredNews.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/informasi-publik/dokumentasi-kegiatan"
                    className="text-xs font-bold text-[#005BAA] hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Other Latest News List */}
          <div className="lg:col-span-5 space-y-4">
            {otherNews.map((item) => (
              <Card
                key={item.id}
                hoverable
                className="p-4 border border-slate-200 bg-white hover:border-blue-200 transition-all"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#F7941D] uppercase">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[10px] text-slate-500">
                          {formatDate(item.date)}
                        </span>
                      </div>

                      <Link href="/informasi-publik/dokumentasi-kegiatan">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#005BAA] transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                      </Link>
                    </div>

                    <Link
                      href="/informasi-publik/dokumentasi-kegiatan"
                      className="text-[11px] font-semibold text-slate-600 hover:text-[#005BAA] flex items-center gap-1"
                    >
                      <span>Selengkapnya</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
