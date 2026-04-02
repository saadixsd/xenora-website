import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/app/ThemeProvider";
import { ScrollManager } from "@/components/app/ScrollManager";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Index from "./pages/Index.tsx";
import FAQ from "./pages/FAQ.tsx";
import Privacy from "./pages/Privacy.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";
import TryNora from "./pages/TryNora.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import WorkflowRun from "./pages/WorkflowRun.tsx";
import History from "./pages/History.tsx";
import Settings from "./pages/Settings.tsx";

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/try-nora" element={<TryNora />} />
          <Route path="/talentgraph" element={<TalentGraph />} />
          <Route path="/login" element={<Login />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="run/:id" element={<WorkflowRun />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
