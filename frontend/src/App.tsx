import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { HomeCmsProvider } from "@/contexts/HomeCmsContext";
import { WebsiteBrandingEffect } from "@/components/WebsiteBrandingEffect";
import { RouteFallback } from "@/components/common/RouteFallback";
import { Analytics } from "@/components/Analytics";
import { ClickSpark } from "@/components/ui/ClickSpark";
import { queryClient } from "@/lib/queryClient";

// Public pages — code-split per route
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Work = lazy(() => import("./pages/Work"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const Industries = lazy(() => import("./pages/Industries"));
const IndustryDetails = lazy(() => import("./pages/IndustryDetails"));
const Careers = lazy(() => import("./pages/Careers"));
const JobDetails = lazy(() => import("./pages/JobDetails").then((m) => ({ default: m.JobDetails })));
const JobApplication = lazy(() => import("./pages/JobApplication").then((m) => ({ default: m.JobApplication })));
const Contact = lazy(() => import("./pages/Contact"));
const Solutions = lazy(() => import("./pages/Solutions"));
const SolutionDetails = lazy(() => import("./pages/SolutionDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin — fully isolated chunk
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./components/admin/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminServices = lazy(() => import("./pages/admin/Services"));
const AdminServicesSettings = lazy(() => import("./pages/admin/ServicesSettings"));
const AdminPageSeoSettings = lazy(() => import("./pages/admin/PageSeoSettings"));
const AdminHomeSettings = lazy(() => import("./pages/admin/HomeSettings"));
const AdminAboutSettings = lazy(() => import("./pages/admin/AboutSettings"));
const AdminContactSettings = lazy(() => import("./pages/admin/ContactSettings"));
const AdminSolutionsLandingSettings = lazy(() => import("./pages/admin/SolutionsLandingSettings"));
const AdminIndustriesLandingSettings = lazy(() => import("./pages/admin/IndustriesLandingSettings"));
const AdminPortfolioLandingSettings = lazy(() => import("./pages/admin/PortfolioLandingSettings"));
const AdminCareersLandingSettings = lazy(() => import("./pages/admin/CareersLandingSettings"));
const AdminWebsiteSettings = lazy(() => import("./pages/admin/WebsiteSettings"));
const AdminIndustries = lazy(() => import("./pages/admin/Industries"));
const AdminSolutions = lazy(() => import("./pages/admin/Solutions"));
const AdminPortfolio = lazy(() => import("./pages/admin/Portfolio"));
const AdminFAQs = lazy(() => import("./pages/admin/FAQs"));
const AdminJobs = lazy(() => import("./pages/admin/Jobs"));
const AdminApplications = lazy(() => import("./pages/admin/Applications"));
const AdminContacts = lazy(() => import("./pages/admin/Contacts"));
const AdminNewsletter = lazy(() => import("./pages/admin/Newsletter"));

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

// Sleek top progress loading bar that reacts to route changes
const PageTransitionLoader = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(15);

    const timer1 = setTimeout(() => {
      setProgress(60);
    }, 100);

    const timer2 = setTimeout(() => {
      setProgress(85);
    }, 250);

    const timer3 = setTimeout(() => {
      setProgress(100);
    }, 450);

    const timer4 = setTimeout(() => {
      setVisible(false);
    }, 650);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-[3px] bg-emerald-500/10 z-[99999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: progress === 100 ? 0 : 1 }}
    >
      <div 
        className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-all ease-out"
        style={{ 
          width: `${progress}%`, 
          transitionDuration: progress === 15 ? '0ms' : '350ms'
        }}
      />
    </div>
  );
};

// Helper component to handle smooth hash scrolls and page transitions
const ScrollToHashElement = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = hash.replace("#", "").toLowerCase();
    if (section === "contact") {
      let cancelled = false;
      const timer = setTimeout(() => {
        void import("@/lib/heroScroll").then(({ scrollToContactSection }) => {
          if (!cancelled) void scrollToContactSection();
        });
      }, 120);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    if (section !== "services") {
      const element = document.getElementById(section);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return () => clearTimeout(timer);
      }
      return;
    }

    let cancelled = false;
    const run = async () => {
      for (let attempt = 0; attempt < 20 && !cancelled; attempt += 1) {
        if (document.getElementById(section)) break;
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      if (cancelled) return;
      const { scrollToHomeSection } = await import("@/lib/heroScroll");
      await scrollToHomeSection(section as "contact" | "services");
    };

    const timer = setTimeout(() => {
      void run();
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ClickSpark
        sparkColor="#14B8A6"
        sparkSize={8}
        sparkRadius={18}
        sparkCount={8}
        duration={420}
        extraScale={1}
        easing="ease-out"
      />
      <HomeCmsProvider>
      <WebsiteBrandingEffect />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Analytics />
        <PageTransitionLoader />
        <ScrollToHashElement />
        <Routes>
          <Route path="/" element={withSuspense(<Index />)} />
          <Route path="/about" element={withSuspense(<About />)} />
          <Route path="/work" element={withSuspense(<Work />)} />
          <Route path="/work/:slug" element={withSuspense(<ProjectDetails />)} />
          <Route path="/services" element={withSuspense(<Services />)} />
          <Route path="/services/:slug" element={withSuspense(<ServiceDetails />)} />
          <Route path="/industries" element={withSuspense(<Industries />)} />
          <Route path="/industries/:slug" element={withSuspense(<IndustryDetails />)} />
          <Route path="/careers" element={withSuspense(<Careers />)} />
          <Route path="/careers/:slug" element={withSuspense(<JobDetails />)} />
          <Route path="/careers/apply/:slug" element={withSuspense(<JobApplication />)} />
          <Route path="/contact" element={withSuspense(<Contact />)} />

          <Route path="/solutions" element={withSuspense(<Solutions />)} />
          <Route path="/solutions/:slug" element={withSuspense(<SolutionDetails />)} />

          <Route path="/admin/login" element={withSuspense(<AdminLogin />)} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={withSuspense(<AdminLayout />)}>
              <Route index element={withSuspense(<AdminDashboard />)} />
              <Route path="dashboard" element={withSuspense(<AdminDashboard />)} />
              <Route path="services" element={withSuspense(<AdminServices />)} />
              <Route path="services-settings" element={withSuspense(<AdminServicesSettings />)} />
              <Route path="home-settings" element={withSuspense(<AdminHomeSettings />)} />
              <Route path="about-settings" element={withSuspense(<AdminAboutSettings />)} />
              <Route path="contact-settings" element={withSuspense(<AdminContactSettings />)} />
              <Route path="solutions-landing" element={withSuspense(<AdminSolutionsLandingSettings />)} />
              <Route path="industries-landing" element={withSuspense(<AdminIndustriesLandingSettings />)} />
              <Route path="portfolio-landing" element={withSuspense(<AdminPortfolioLandingSettings />)} />
              <Route path="careers-landing" element={withSuspense(<AdminCareersLandingSettings />)} />
              <Route path="website-settings" element={withSuspense(<AdminWebsiteSettings />)} />
              <Route path="page-seo" element={withSuspense(<AdminPageSeoSettings />)} />
              <Route path="industries" element={withSuspense(<AdminIndustries />)} />
              <Route path="solutions" element={withSuspense(<AdminSolutions />)} />
              <Route path="portfolio" element={withSuspense(<AdminPortfolio />)} />
              <Route path="faqs" element={withSuspense(<AdminFAQs />)} />
              <Route path="jobs" element={withSuspense(<AdminJobs />)} />
              <Route path="applications" element={withSuspense(<AdminApplications />)} />
              <Route path="contacts" element={withSuspense(<AdminContacts />)} />
              <Route path="newsletter" element={withSuspense(<AdminNewsletter />)} />
            </Route>
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={withSuspense(<NotFound />)} />
        </Routes>
      </BrowserRouter>
      </HomeCmsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
