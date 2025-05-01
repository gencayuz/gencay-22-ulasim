
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MPlaka from "./pages/MPlaka";
import SPlaka from "./pages/SPlaka";
import JPlaka from "./pages/JPlaka";
import Raporlar from "./pages/Raporlar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/m-plaka" element={<MPlaka />} />
          <Route path="/s-plaka" element={<SPlaka />} />
          <Route path="/j-plaka" element={<JPlaka />} />
          <Route path="/raporlar" element={<Raporlar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
