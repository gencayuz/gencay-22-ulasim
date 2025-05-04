
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import MPlaka from "./pages/MPlaka";
import SPlaka from "./pages/SPlaka";
import JPlaka from "./pages/JPlaka";
import D4Plaka from "./pages/D4Plaka";
import D4SPlaka from "./pages/D4SPlaka";
import Archives from "./pages/Archives";
import Raporlar from "./pages/Raporlar";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Apply the saved theme when the app first loads
    const initTheme = () => {
      const storedTheme = localStorage.getItem("theme") || 
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    };
    
    initTheme();
    
    // Check if user is logged in
    const checkAuth = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-transition bg-background text-foreground">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Keşan Belediyesi</h2>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/m-plaka" element={<ProtectedRoute><MPlaka /></ProtectedRoute>} />
            <Route path="/s-plaka" element={<ProtectedRoute><SPlaka /></ProtectedRoute>} />
            <Route path="/j-plaka" element={<ProtectedRoute><JPlaka /></ProtectedRoute>} />
            <Route path="/d4-plaka" element={<ProtectedRoute><D4Plaka /></ProtectedRoute>} />
            <Route path="/d4s-plaka" element={<ProtectedRoute><D4SPlaka /></ProtectedRoute>} />
            <Route path="/arsiv" element={<ProtectedRoute><Archives /></ProtectedRoute>} />
            <Route path="/raporlar" element={<ProtectedRoute><Raporlar /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
