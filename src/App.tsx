import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/app/ThemeProvider";
import { ScrollManager } from "@/components/app/ScrollManager";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { ROUTES } from "@/config/routes";

// Lazy-loaded pages — splits the bundle so the landing page loads instantly
const Index = lazy(() => import("./pages/Index.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const DashboardNora = lazy(() => import("./pages/DashboardNora.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const SignUp = lazy(() => import("./pages/SignUp.tsx"));
const AuthCallback = lazy(() => import("./pages/AuthCallback.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const WorkflowRun = lazy(() => import("./pages/WorkflowRun.tsx"));
const History = lazy(() => import("./pages/History.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const AgentWorkspacePage = lazy(() => import("./pages/AgentWorkspacePage.tsx"));
const AgentsManagePage = lazy(() => import("./pages/AgentsManagePage.tsx"));
const AgentEditPage = lazy(() => import("./pages/AgentEditPage.tsx"));
const Connections = lazy(() => import("./pages/Connections.tsx"));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--dash-accent)] border-t-transparent" />
  </div>
);

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <ScrollManager />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={ROUTES.home} element={<Index />} />
            <Route path={ROUTES.faq} element={<FAQ />} />
            <Route path={ROUTES.about} element={<About />} />
            <Route path={ROUTES.privacy} element={<Privacy />} />
            <Route
              path={ROUTES.tryNora}
              element={
                <ProtectedRoute loginMessage="Sign in to open Nora in your dashboard.">
                  <Navigate to={ROUTES.dashboard.nora} replace />
                </ProtectedRoute>
              }
            />
            <Route path={ROUTES.login} element={<Login />} />
            <Route path={ROUTES.signup} element={<SignUp />} />
            <Route path={ROUTES.authCallback} element={<AuthCallback />} />

            <Route
              path={ROUTES.dashboard.root}
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
              <Route path="agents/:id/edit" element={<AgentEditPage />} />
              <Route path="agents/:slug" element={<AgentWorkspacePage />} />
              <Route path="connections" element={<Connections />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
