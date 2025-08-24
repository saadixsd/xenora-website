import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import Home from "./pages/Home";
import Models from "./pages/Models";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Nora from "./pages/Nora";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Toaster />
        <Sonner />
        <HashRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/models" element={<Models />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/nora" element={<Nora />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CookieConsent />
          </div>
        </HashRouter>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
