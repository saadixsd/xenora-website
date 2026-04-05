import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/app/ThemeProvider";
import { ScrollManager } from "@/components/app/ScrollManager";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Index from "./pages/Index.tsx";
import FAQ from "./pages/FAQ.tsx";
import Privacy from "./pages/Privacy.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardNora from "./pages/DashboardNora.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import AuthCallback from "./pages/AuthCallback.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import WorkflowRun from "./pages/WorkflowRun.tsx";
import History from "./pages/History.tsx";
import Settings from "./pages/Settings.tsx";
import AgentWorkspacePage from "./pages/AgentWorkspacePage.tsx";
import AgentsManagePage from "./pages/AgentsManagePage.tsx";
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
          <Route
            path="/try-nora"
            element={
              <ProtectedRoute loginMessage="Sign in to access Nora.">
                <Navigate to="/dashboard/nora" replace />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute loginMessage="Sign in to access the dashboard.">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="nora" element={<DashboardNora />} />
            <Route path="run/:id" element={<WorkflowRun />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="agents/manage" element={<AgentsManagePage />} />
            <Route path="agents/:slug" element={<AgentWorkspacePage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
