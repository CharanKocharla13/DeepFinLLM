import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import QAPage from "./pages/QAPage";
import SettingsPage from "./pages/SettingsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";

function Router() {
  const [activeTab, setActiveTab] = useState("qa");
  
  // Handle tab switching
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {activeTab === "qa" ? (
          <QAPage />
        ) : activeTab === "settings" ? (
          <SettingsPage />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Saved Responses</h2>
            <p className="text-muted-foreground">Your saved financial advice will appear here.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  // Generate unique user ID for this session if not already in localStorage
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      const userId = `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
      localStorage.setItem("userId", userId);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
