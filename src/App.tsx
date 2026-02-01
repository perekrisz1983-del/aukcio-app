import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import AuctionPage from "./pages/Auction";
import Admin from "./pages/Admin";
import Profil from "./pages/Profil";
import AuthPage from "./pages/Auth";
import AdoptionPage from "./pages/AdoptionPage";
import AdminAnimals from "./pages/AdminAnimals";
import About from "./pages/About";
import Support from "./pages/Support";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import SuccessStoriesPage from "./pages/SuccessStories";
import FaqPage from "./pages/Faq";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auction" element={<AuctionPage />} />
              <Route path="/orokbefogadas" element={<AdoptionPage />} />
              <Route path="/sikersztorik" element={<SuccessStoriesPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="/gyik" element={<FaqPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/animals" element={<AdminAnimals />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;