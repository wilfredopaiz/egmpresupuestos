import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Proyectos from "./pages/Proyectos";
import Clientes from "./pages/Clientes";
import NuevaObra from "./pages/NuevaObra";
import Partidas from "./pages/Partidas";
import SeccionDetalle from "./pages/SeccionDetalle";
import Presupuesto from "./pages/Presupuesto";
import ProyectoDetalle from "./pages/ProyectoDetalle";
import PdfPreview from "./pages/PdfPreview";
import Ajustes from "./pages/Ajustes";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proyectos"
              element={
                <ProtectedRoute>
                  <Proyectos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nueva-obra"
              element={
                <ProtectedRoute>
                  <NuevaObra />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <Clientes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partidas"
              element={
                <ProtectedRoute>
                  <Partidas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partidas/:sectionId"
              element={
                <ProtectedRoute>
                  <SeccionDetalle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/presupuesto"
              element={
                <ProtectedRoute>
                  <Presupuesto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proyecto/:id"
              element={
                <ProtectedRoute>
                  <ProyectoDetalle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pdf-preview"
              element={
                <ProtectedRoute>
                  <PdfPreview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ajustes"
              element={
                <ProtectedRoute>
                  <Ajustes />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
