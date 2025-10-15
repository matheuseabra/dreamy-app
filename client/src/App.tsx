import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import Layout from "./components/Layout";
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AccountPage from "./pages/Account";
import BigllingPage from "./pages/Billing";
import Assets from "./pages/Assets";
import Contact from "./pages/Contact";
import Edit from "./pages/Edit";
import Explore from "./pages/Explore";
import Feedback from "./pages/Feedback";
import Generate from "./pages/Generate";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/Profile";
import Signup from "./pages/Signup";
import Support from "./pages/Support";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Support />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Feedback />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/imagine"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Generate />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Explore />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Edit />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assets"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Assets />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Support />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Feedback />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AccountPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <BigllingPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
