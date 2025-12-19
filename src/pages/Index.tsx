
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from "@/components/LandingPage";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SalaryForm from "@/components/SalaryForm";
import TipsForm from "@/components/TipsForm";
import ExtraHoursForm from "@/components/ExtraHoursForm";
import StatsOverview from "@/components/StatsOverview";
import IncomeChart from "@/components/IncomeChart";
import SalarySummaryOptions from "@/components/SalarySummaryOptions";
import SalarySearch from "@/components/SalarySearch";
import SalaryEntriesList from "@/components/SalaryEntriesList";
import { ExtraHoursCard } from "@/components/ExtraHoursCard";
import { HoursCalculator } from "@/components/HoursCalculator";
import { DailyHoursForm } from "@/components/DailyHoursForm";
import { DailyHoursList } from "@/components/DailyHoursList";
import { NotificationSettings } from "@/components/NotificationSettings";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { IncomeHoursWidget } from "@/components/widgets/IncomeHoursWidget";
import { AnalyticsWidget } from "@/components/widgets/AnalyticsWidget";

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication form if requested
  if (showAuth && !user) {
    return <AuthForm onBack={() => setShowAuth(false)} />;
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // Show dashboard for authenticated users
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="p-2 sm:p-4 lg:p-6 flex-1">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              {/* Mobile Sidebar Trigger with Menu Label */}
              <div className="lg:hidden flex items-center gap-2 p-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 w-fit">
                <SidebarTrigger />
                <span className="text-sm font-medium text-muted-foreground">Menu</span>
              </div>

              {/* Header */}
              <div className="text-center space-y-2 sm:space-y-4 py-4 sm:py-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Salary Tracker
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                  Track your earnings, monitor trends, and manage your income with ease
                </p>
              </div>

              {/* Widgets Section */}
              {activeTab === "overview" && (
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6">
                  <IncomeHoursWidget />
                  <AnalyticsWidget />
                </div>
              )}

              {/* Stats Overview and Extra Hours */}
              {activeTab === "overview" && (
                <div className="space-y-4 sm:space-y-6">
                  <StatsOverview />
                  <div className="px-6">
                    <ExtraHoursCard />
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="mt-4 sm:mt-6">
                {activeTab === "overview" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                      <SalaryEntriesList />
                      <SalarySummaryOptions />
                    </div>
                  </div>
                )}

                {activeTab === "add" && (
                  <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 max-w-7xl mx-auto">
                    <SalaryForm />
                    <TipsForm />
                    <ExtraHoursForm />
                  </div>
                )}

                {activeTab === "calculator" && (
                  <div className="max-w-4xl mx-auto">
                    <HoursCalculator />
                  </div>
                )}

                {activeTab === "search" && (
                  <div className="max-w-4xl mx-auto">
                    <SalarySearch />
                  </div>
                )}

                {activeTab === "analytics" && (
                  <IncomeChart />
                )}

                {activeTab === "daily-hours" && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <DailyHoursForm />
                      <NotificationSettings />
                    </div>
                    <DailyHoursList />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
