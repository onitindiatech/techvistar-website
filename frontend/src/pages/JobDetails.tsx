import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobBySlug, Job } from "@/services/job.service";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Clock, Briefcase, DollarSign, Calendar, ArrowLeft,
  CheckCircle2, ChevronRight, Users, Code2, Rocket, ShieldCheck,
  Zap, Sparkles, ArrowRight, Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { RichTextContent } from "@/components/common/RichTextContent";
import { PageSeo } from "@/components/common/PageSeo";
import { buildCanonical, seoFromApi } from "@/lib/seoResolve";
import { stripHtmlToText } from "@/lib/sanitizeHtml";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Technology icon mapping — SimpleIcons CDN with normalised key lookup
// ---------------------------------------------------------------------------
interface TechEntry { icon: string; bg: string; }

const TECH_MAP: Record<string, TechEntry> = {
  react:           { icon: "https://cdn.simpleicons.org/react/61DAFB",          bg: "bg-sky-50" },
  "react.js":      { icon: "https://cdn.simpleicons.org/react/61DAFB",          bg: "bg-sky-50" },
  "node.js":       { icon: "https://cdn.simpleicons.org/nodedotjs/339933",       bg: "bg-green-50" },
  nodejs:          { icon: "https://cdn.simpleicons.org/nodedotjs/339933",       bg: "bg-green-50" },
  node:            { icon: "https://cdn.simpleicons.org/nodedotjs/339933",       bg: "bg-green-50" },
  typescript:      { icon: "https://cdn.simpleicons.org/typescript/3178C6",      bg: "bg-blue-50" },
  javascript:      { icon: "https://cdn.simpleicons.org/javascript/F7DF1E",      bg: "bg-yellow-50" },
  js:              { icon: "https://cdn.simpleicons.org/javascript/F7DF1E",      bg: "bg-yellow-50" },
  "next.js":       { icon: "https://cdn.simpleicons.org/nextdotjs/000000",       bg: "bg-slate-100" },
  nextjs:          { icon: "https://cdn.simpleicons.org/nextdotjs/000000",       bg: "bg-slate-100" },
  python:          { icon: "https://cdn.simpleicons.org/python/3776AB",          bg: "bg-blue-50" },
  mongodb:         { icon: "https://cdn.simpleicons.org/mongodb/47A248",         bg: "bg-green-50" },
  postgresql:      { icon: "https://cdn.simpleicons.org/postgresql/4169E1",      bg: "bg-indigo-50" },
  postgres:        { icon: "https://cdn.simpleicons.org/postgresql/4169E1",      bg: "bg-indigo-50" },
  mysql:           { icon: "https://cdn.simpleicons.org/mysql/4479A1",           bg: "bg-blue-50" },
  aws:             { icon: "https://cdn.simpleicons.org/amazonaws/FF9900",       bg: "bg-orange-50" },
  docker:          { icon: "https://cdn.simpleicons.org/docker/2496ED",          bg: "bg-sky-50" },
  kubernetes:      { icon: "https://cdn.simpleicons.org/kubernetes/326CE5",      bg: "bg-blue-50" },
  k8s:             { icon: "https://cdn.simpleicons.org/kubernetes/326CE5",      bg: "bg-blue-50" },
  graphql:         { icon: "https://cdn.simpleicons.org/graphql/E10098",         bg: "bg-pink-50" },
  redis:           { icon: "https://cdn.simpleicons.org/redis/DC382D",           bg: "bg-red-50" },
  vue:             { icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D",        bg: "bg-emerald-50" },
  "vue.js":        { icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D",        bg: "bg-emerald-50" },
  angular:         { icon: "https://cdn.simpleicons.org/angular/DD0031",         bg: "bg-red-50" },
  flutter:         { icon: "https://cdn.simpleicons.org/flutter/02569B",         bg: "bg-blue-50" },
  dart:            { icon: "https://cdn.simpleicons.org/dart/0175C2",            bg: "bg-blue-50" },
  java:            { icon: "https://cdn.simpleicons.org/openjdk/437291",         bg: "bg-orange-50" },
  kotlin:          { icon: "https://cdn.simpleicons.org/kotlin/7F52FF",          bg: "bg-purple-50" },
  swift:           { icon: "https://cdn.simpleicons.org/swift/F05138",           bg: "bg-orange-50" },
  go:              { icon: "https://cdn.simpleicons.org/go/00ADD8",              bg: "bg-cyan-50" },
  golang:          { icon: "https://cdn.simpleicons.org/go/00ADD8",              bg: "bg-cyan-50" },
  rust:            { icon: "https://cdn.simpleicons.org/rust/000000",            bg: "bg-slate-100" },
  terraform:       { icon: "https://cdn.simpleicons.org/terraform/7B42BC",       bg: "bg-purple-50" },
  git:             { icon: "https://cdn.simpleicons.org/git/F05032",             bg: "bg-orange-50" },
  github:          { icon: "https://cdn.simpleicons.org/github/181717",          bg: "bg-slate-100" },
  figma:           { icon: "https://cdn.simpleicons.org/figma/F24E1E",           bg: "bg-orange-50" },
  tailwindcss:     { icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",     bg: "bg-cyan-50" },
  tailwind:        { icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",     bg: "bg-cyan-50" },
  firebase:        { icon: "https://cdn.simpleicons.org/firebase/FFCA28",        bg: "bg-yellow-50" },
  supabase:        { icon: "https://cdn.simpleicons.org/supabase/3ECF8E",        bg: "bg-emerald-50" },
  prisma:          { icon: "https://cdn.simpleicons.org/prisma/2D3748",          bg: "bg-slate-100" },
  express:         { icon: "https://cdn.simpleicons.org/express/000000",         bg: "bg-slate-100" },
  "express.js":    { icon: "https://cdn.simpleicons.org/express/000000",         bg: "bg-slate-100" },
  django:          { icon: "https://cdn.simpleicons.org/django/092E20",          bg: "bg-green-50" },
  fastapi:         { icon: "https://cdn.simpleicons.org/fastapi/009688",         bg: "bg-teal-50" },
  jenkins:         { icon: "https://cdn.simpleicons.org/jenkins/D24939",         bg: "bg-red-50" },
  gitlab:          { icon: "https://cdn.simpleicons.org/gitlab/FC6D26",          bg: "bg-orange-50" },
  azure:           { icon: "https://cdn.simpleicons.org/microsoftazure/0078D4",  bg: "bg-blue-50" },
  gcp:             { icon: "https://cdn.simpleicons.org/googlecloud/4285F4",     bg: "bg-blue-50" },
  "google cloud":  { icon: "https://cdn.simpleicons.org/googlecloud/4285F4",     bg: "bg-blue-50" },
  nginx:           { icon: "https://cdn.simpleicons.org/nginx/009639",           bg: "bg-green-50" },
  kafka:           { icon: "https://cdn.simpleicons.org/apachekafka/231F20",     bg: "bg-slate-100" },
  elasticsearch:   { icon: "https://cdn.simpleicons.org/elasticsearch/005571",   bg: "bg-teal-50" },
  sass:            { icon: "https://cdn.simpleicons.org/sass/CC6699",            bg: "bg-pink-50" },
  webpack:         { icon: "https://cdn.simpleicons.org/webpack/8DD6F9",         bg: "bg-sky-50" },
};

function TechCard({ name }: { name: string }) {
  const entry = TECH_MAP[name.toLowerCase().trim()] || null;
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md hover:border-slate-300/80 cursor-default"
    >
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", entry && !imgErr ? entry.bg : "bg-slate-100")}>
        {entry && !imgErr ? (
          <img src={entry.icon} alt={name} className="h-7 w-7 object-contain" onError={() => setImgErr(true)} />
        ) : (
          <Code2 className="h-6 w-6 text-slate-400" />
        )}
      </div>
      <span className="text-center text-xs font-semibold leading-tight text-slate-700 max-w-[80px] truncate">{name}</span>
    </motion.div>
  );
}

const MODULE_SHELL = "relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8";

export const JobDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeId, setActiveId] = useState("summary");
  const subnavRef = useRef<HTMLElement>(null);

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ["job", slug],
    queryFn: () => getJobBySlug(slug || ""),
    enabled: !!slug,
    retry: 1,
  });

  const jobSeo = job ? seoFromApi(job as unknown as Record<string, unknown>) : undefined;
  const seoBlock = (
    <PageSeo
      seo={jobSeo}
      defaults={{
        title: job ? (job.title + " | TechVistar Careers") : "Job Opening Not Found | TechVistar",
        description: job ? stripHtmlToText(job.description).slice(0, 160) : "",
        url: job ? buildCanonical("/careers/" + job.slug) : buildCanonical("/careers"),
      }}
    />
  );

  const rawDesc = job?.description || "";
  let shortDesc = rawDesc;
  let fullDesc = "";
  let bannerImg = "";

  if (rawDesc.includes("<!-- split -->")) {
    const parts = rawDesc.split("<!-- split -->");
    shortDesc = parts[0] || "";
    fullDesc  = parts[1] || "";
    bannerImg = parts[2] || "";
  } else {
    bannerImg = job?.bannerImage || "";
  }

  const resolvedBanner = bannerImg || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200";

  const heroOverview   = job?.roleOverview?.trim() || (shortDesc && shortDesc !== job?.title ? shortDesc : "");
  const heroHighlights = job?.keyHighlights?.length ? job.keyHighlights
    : (job?.responsibilities?.length ? job.responsibilities.slice(0, 4) : (job?.requirements?.length ? job.requirements.slice(0, 4) : []));
  const heroSkills     = job?.skills?.length ? job.skills : (job?.techStack?.length ? job.techStack : []);

  const navItems = useMemo(() => {
    if (!job) return [];
    return [
      ...(shortDesc || job.roleOverview              ? [{ id: "summary",          label: "Summary" }]              : []),
      ...(fullDesc                                   ? [{ id: "details",          label: "Details" }]              : []),
      ...(job.whatYouWillWorkOn?.length              ? [{ id: "work-on",          label: "What You'll Do" }]       : []),
      ...(job.responsibilities?.length               ? [{ id: "responsibilities", label: "Responsibilities" }]      : []),
      ...(job.requirements?.length                   ? [{ id: "requirements",     label: "Requirements" }]         : []),
      ...(job.preferredQualifications?.length        ? [{ id: "preferred",        label: "Preferred" }]            : []),
      ...(heroSkills.length                          ? [{ id: "competencies",     label: "Core Competencies" }]    : []),
      ...(job.benefits?.length                       ? [{ id: "benefits",         label: "What We Offer" }]        : []),
      ...(job.hiringProcess?.length                  ? [{ id: "hiring-process",   label: "Hiring Process" }]       : []),
    ];
  }, [job, shortDesc, fullDesc, heroSkills.length]);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    const subnav = subnavRef.current;
    if (!subnav) return;
    const update = () => document.documentElement.style.setProperty("--secondary-nav-height", subnav.offsetHeight + "px");
    update();
    const ro = new ResizeObserver(update);
    ro.observe(subnav);
    return () => { ro.disconnect(); document.documentElement.style.removeProperty("--secondary-nav-height"); };
  }, [navItems.length]);

  useEffect(() => {
    if (!navItems.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 }
    );
    navItems.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [navItems, job]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 140;
    window.scrollTo({ top: el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset, behavior: "smooth" });
  };

  if (error) return (
    <>
      {seoBlock}
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 pt-20">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
          <h1 className="mb-3 font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Job Opening Not Found
          </h1>
          <p className="mb-8 text-base leading-relaxed text-slate-600">
            We couldn't retrieve the details for this position. It may have been closed or removed.
          </p>
          <Button asChild className="w-full bg-primary text-white hover:bg-primary/95">
            <Link to="/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Link>
          </Button>
        </div>
        <Footer />
      </main>
    </>
  );

  if (isLoading || !job) return (
    <>
      {seoBlock}
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
        <div className="font-display text-slate-500">Loading job details...</div>
      </main>
      <Footer />
    </>
  );

  const hlIcons = [Code2, Rocket, ShieldCheck, Zap, Sparkles, CheckCircle2];

  return (
    <>
      {seoBlock}
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-0">

        {/* HERO SECTION */}
        <section className="bg-white border-b border-slate-200/80 pt-[4.5rem] pb-8 md:pt-28 md:pb-12 mb-6 md:mb-8">
          <div className="w-full mx-auto px-4 md:px-6 lg:px-12 xl:px-20 detail-page-gutter">
            <div className="mb-6">
              <Link
                to="/careers"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
                <span>All Careers</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="md:col-span-7 space-y-5">
                {job.department && (
                  <Badge className="border-none bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-none">
                    {job.department}
                  </Badge>
                )}

                <h1 className="text-3xl md:text-5xl font-extrabold font-display text-slate-900 leading-tight">
                  {job.title}
                </h1>

                {shortDesc && (
                  <p className="text-xl md:text-2xl font-bold font-display text-[#041a3d] leading-snug">
                    {stripHtmlToText(shortDesc).split(/(?<=[.!?])s+/)[0]}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3 border-y border-slate-100 text-base font-semibold text-slate-700">
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      {job.location}
                    </span>
                  )}
                  {job.employmentType && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      {job.employmentType}
                    </span>
                  )}
                  {job.experience && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-emerald-600" />
                      {job.experience}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      {job.salary}
                    </span>
                  )}
                </div>

                {heroOverview && (
                  <RichTextContent
                    content={heroOverview}
                    className="text-slate-600 !text-base md:!text-lg leading-relaxed font-normal [&_p]:!text-base md:[&_p]:!text-lg"
                  />
                )}

                {/* Key Highlights */}
                {heroHighlights.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-2xl md:text-3xl font-bold font-display text-slate-900 leading-snug">
                      Key Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                      {heroHighlights.map((highlight, idx) => {
                        const IconComp = hlIcons[idx % hlIcons.length];
                        return (
                          <div key={idx} className="flex gap-2.5 items-start text-base md:text-lg text-slate-600 font-medium leading-relaxed">
                            <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 flex items-center justify-center p-0.5 mt-1 shrink-0 border border-emerald-100">
                              <Check className="h-3 w-3 text-emerald-600" />
                            </div>
                            <span>{highlight}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Cover Image Column */}
              <div className="md:col-span-5 flex items-center justify-center py-4 md:py-0">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-sky-50/40 via-slate-50/60 to-white p-6 shadow-sm flex items-center justify-center w-full">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.07),transparent_65%)]" />
                  <img
                    src={resolvedBanner}
                    alt={job.title}
                    className="relative z-10 w-full max-w-[280px] md:max-w-full h-auto max-h-[300px] object-contain drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY SECTION NAVIGATION */}
        {navItems.length > 0 && (
          <nav
            ref={subnavRef}
            className="sticky z-40 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-all duration-300 mb-8"
            style={{ top: "var(--primary-nav-height, 80px)" }}
          >
            <div className="w-full mx-auto px-4 md:px-6 lg:px-12 xl:px-20 detail-page-gutter">
              <div className="scrollbar-none flex items-center gap-2 overflow-x-auto scroll-smooth whitespace-nowrap py-2.5 md:gap-4 md:py-3">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={"#" + item.id}
                    onClick={scrollTo(item.id)}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all focus:outline-none",
                      activeId === item.id
                        ? "bg-emerald-600 text-white font-bold"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* MAIN CONTENT + SIDEBAR GRID */}
        <section className="w-full mx-auto px-4 md:px-6 lg:px-12 xl:px-20 mt-8 pb-16 detail-page-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Role Summary */}
              {shortDesc && (
                <section id="summary" className={MODULE_SHELL}>
                  <h2 className="mb-4 font-display text-2xl md:text-3xl font-bold text-slate-900">Role Summary</h2>
                  <RichTextContent
                    content={shortDesc}
                    className="text-base md:text-lg leading-relaxed text-slate-600 [&_p]:!text-base md:[&_p]:!text-lg"
                  />
                </section>
              )}

              {/* Job Details */}
              {fullDesc && (
                <section id="details" className={MODULE_SHELL}>
                  <h2 className="mb-4 font-display text-2xl md:text-3xl font-bold text-slate-900">Job Details</h2>
                  <RichTextContent
                    content={fullDesc}
                    className="text-base md:text-lg leading-relaxed text-slate-600 [&_p]:!text-base md:[&_p]:!text-lg"
                  />
                </section>
              )}

              {/* What You'll Work On */}
              {job.whatYouWillWorkOn && job.whatYouWillWorkOn.length > 0 && (
                <section id="work-on" className={MODULE_SHELL}>
                  <h2 className="mb-5 font-display text-2xl md:text-3xl font-bold text-slate-900">What You'll Work On</h2>
                  <div className="flex flex-col gap-3">
                    {job.whatYouWillWorkOn.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 text-base md:text-lg text-slate-700 leading-relaxed items-start p-3.5 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-[#041a3d]/20 hover:shadow transition-all"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-normal">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Key Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <section id="responsibilities" className={MODULE_SHELL}>
                  <h2 className="mb-5 font-display text-2xl md:text-3xl font-bold text-slate-900">Key Responsibilities</h2>
                  <div className="flex flex-col gap-3">
                    {job.responsibilities.map((resp, index) => (
                      <div
                        key={index}
                        className="flex gap-3 text-base md:text-lg text-slate-700 leading-relaxed items-start p-3.5 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-emerald-500/20 hover:shadow transition-all"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-normal">{resp}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <section id="requirements" className={MODULE_SHELL}>
                  <h2 className="mb-5 font-display text-2xl md:text-3xl font-bold text-slate-900">Requirements</h2>
                  <div className="flex flex-col gap-3">
                    {job.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex gap-3 text-base md:text-lg text-slate-700 leading-relaxed items-start p-3.5 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-[#041a3d]/20 hover:shadow transition-all"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[#041a3d] border border-slate-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-normal">{req}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Preferred Qualifications */}
              {job.preferredQualifications && job.preferredQualifications.length > 0 && (
                <section id="preferred" className={MODULE_SHELL}>
                  <h2 className="mb-5 font-display text-2xl md:text-3xl font-bold text-slate-900">Preferred Qualifications</h2>
                  <div className="flex flex-col gap-3">
                    {job.preferredQualifications.map((pref, index) => (
                      <div
                        key={index}
                        className="flex gap-3 text-base md:text-lg text-slate-700 leading-relaxed items-start p-3.5 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-sky-500/20 hover:shadow transition-all"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-600 border border-sky-100">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-normal">{pref}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Core Competencies (Technology Logo Grid) */}
              {heroSkills.length > 0 && (
                <section id="competencies" className={MODULE_SHELL}>
                  <h2 className="mb-6 font-display text-2xl font-bold text-slate-900">Core Competencies</h2>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                    {heroSkills.map((skill, idx) => (
                      <TechCard key={idx} name={skill} />
                    ))}
                  </div>
                </section>
              )}

              {/* What We Offer */}
              {job.benefits && job.benefits.length > 0 && (
                <section id="benefits" className={MODULE_SHELL}>
                  <h2 className="mb-6 font-display text-2xl md:text-3xl font-bold text-slate-900">What We Offer</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:border-emerald-200/60 hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-base md:text-lg font-normal leading-snug text-slate-700">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hiring Process */}
              {job.hiringProcess && job.hiringProcess.length > 0 && (
                <section id="hiring-process" className={MODULE_SHELL}>
                  <h2 className="mb-6 font-display text-2xl md:text-3xl font-bold text-slate-900">Our Hiring Process</h2>
                  <div className="space-y-0">
                    {job.hiringProcess.map((stepItem, index) => (
                      <div key={index} className="relative flex gap-4">
                        {index < job.hiringProcess!.length - 1 && (
                          <div className="absolute left-[17px] top-9 h-full w-px bg-slate-200" />
                        )}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#041a3d] text-white font-bold text-sm z-10">
                          {stepItem.step || index + 1}
                        </div>
                        <div className="flex-1 pb-6">
                          <h3 className="font-bold text-slate-900 text-lg leading-snug">{stepItem.title}</h3>
                          {stepItem.description && (
                            <p className="text-base md:text-lg text-slate-600 mt-1 leading-relaxed">{stepItem.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar Column */}
            <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              {/* Job Overview Card ONLY — NO Duplicate Ready to Apply, NO Need Help */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold font-display text-slate-900 border-b border-slate-100 pb-3 mb-5">
                  Job Overview
                </h2>
                <div className="space-y-5">
                  {[
                    { icon: Briefcase, label: "Department", value: job.department },
                    { icon: Users, label: "Experience", value: job.experience },
                    { icon: Clock, label: "Employment Type", value: job.employmentType },
                    { icon: MapPin, label: "Location", value: job.location },
                    ...(job.salary ? [{ icon: DollarSign, label: "Salary", value: job.salary }] : []),
                  ].filter(r => r.value).map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                        <p className="mt-0.5 text-base font-semibold text-slate-800">{value}</p>
                      </div>
                    </div>
                  ))}
                  {job.applicationDeadline && (
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Deadline</p>
                        <p className="mt-0.5 text-base font-semibold text-slate-800">
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SINGLE FINAL "READY TO APPLY?" CTA SECTION AT THE BOTTOM */}
          <div className="mt-16">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              id="apply"
              className="relative overflow-hidden bg-[#041a3d] border border-[#041a3d]/30 rounded-3xl p-8 md:p-12 text-white shadow-xl scroll-mt-24 text-center w-full"
            >
              <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold select-none">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300 animate-pulse" />
                  <span>CAREER OPPORTUNITY</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold font-display leading-tight max-w-2xl mx-auto text-white">
                  Ready to Apply?
                </h2>

                <p className="text-blue-100/90 text-base max-w-xl mx-auto leading-relaxed font-normal">
                  Take the next step in your career with TechVistar and help us build something remarkable.
                </p>

                <div className="flex flex-wrap gap-4 justify-center pt-2">
                  <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0, scale: 0.98 }}>
                    <Button
                      asChild
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 text-base font-extrabold text-white shadow-md transition-all hover:bg-emerald-500 cursor-pointer"
                    >
                      <Link to={"/careers/apply/" + job.slug}>
                        <span>Apply Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default JobDetails;
