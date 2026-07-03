import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Work from "./pages/Work";
import ProjectDetails from "./pages/ProjectDetails";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Careers from "./pages/Careers";
import FAQ from "./pages/FAQ";
import Industries from "./pages/Industries";
import IndustryDetails from "./pages/IndustryDetails";
import Contact from "./pages/Contact";
import Solutions from "./pages/Solutions";
import SolutionDetails from "./pages/SolutionDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTransitionLoader />
        <ScrollToHashElement />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/:slug" element={<IndustryDetails />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<SolutionDetails />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
