import { useEffect } from "react";
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
import ForgotPasswordPage from "./pages/ForgotPassword";
import UpdatePasswordPage from "./pages/UpdatePassword";
import { supabase } from "./lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const checkScheduledAuctions = async () => {
      const now = new Date().toISOString();
      
      // Find auctions that are 'Tervezett' (scheduled) and whose start time has passed.
      const { data: auctionsToStart, error: selectError } = await supabase
        .from('auctions')
        .select('id')
        .eq('status', 'Tervezett')
        .lte('start_time', now);

      if (selectError) {
        console.error("Error fetching scheduled auctions:", selectError.message);
        return;
      }

      if (auctionsToStart && auctionsToStart.length > 0) {
        const idsToUpdate = auctionsToStart.map(a => a.id);
        
        // Update their status to 'Aktív'.
        const { error: updateError } = await supabase
          .from('auctions')
          .update({ status: 'Aktív' })
          .in('id', idsToUpdate);

        if (updateError) {
          console.error("Error updating auction statuses:", updateError.message);
        } else {
          // The real-time subscription on the auction page will handle the UI update.
        }
      }
    };

    // Run the check immediately on load.
    checkScheduledAuctions();

    // Then, run it every minute.
    const intervalId = setInterval(checkScheduledAuctions, 60000);

    // Clean up the interval when the component unmounts.
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once on mount.

  return (
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
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/update-password" element={<UpdatePasswordPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;