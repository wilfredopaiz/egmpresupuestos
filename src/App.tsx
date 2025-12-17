import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NuevaObra from "./pages/NuevaObra";
import Partidas from "./pages/Partidas";
import SeccionDetalle from "./pages/SeccionDetalle";
import Presupuesto from "./pages/Presupuesto";
import ProyectoDetalle from "./pages/ProyectoDetalle";
import Ajustes from "./pages/Ajustes";
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
          <Route path="/nueva-obra" element={<NuevaObra />} />
          <Route path="/partidas" element={<Partidas />} />
          <Route path="/partidas/:sectionId" element={<SeccionDetalle />} />
          <Route path="/presupuesto" element={<Presupuesto />} />
          <Route path="/proyecto/:id" element={<ProyectoDetalle />} />
          <Route path="/ajustes" element={<Ajustes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
