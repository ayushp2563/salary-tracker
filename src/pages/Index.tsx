
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from "@/components/LandingPage";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SalaryForm from "@/components/SalaryForm";
import TipsForm from "@/components/TipsForm";
import StatsOverview from "@/components/StatsOverview";
import IncomeChart from "@/components/IncomeChart";
import SalarySearch from "@/components/SalarySearch";
import SalaryEntriesList from "@/components/SalaryEntriesList";
import { HoursCalculator } from "@/components/HoursCalculator";
import { DailyHoursForm } from "@/components/DailyHoursForm";
import { DailyHoursList } from "@/components/DailyHoursList";
import { NotificationSettings } from "@/components/NotificationSettings";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTracker from "@/components/ExpenseTracker";
import { MoneyPoolsCard, WorkHourGuard } from "@/components/StudentFinanceCards";

const MenuTrigger = () => {
  const { open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen(!open);
    }
  };

  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-primary transition-colors hover:bg-primary/20"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      <span className="font-medium">Menu</span>
    </button>
  );
};

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-canvas">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (showAuth && !user) {
    return <AuthForm onBack={() => setShowAuth(false)} />;
  }

  if (!user) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-app-canvas">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex flex-1 flex-col">
          <Header />

          <div className="flex-1 p-3 pb-24 sm:p-4 lg:p-6 lg:pb-6">
            <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <MenuTrigger />
                <p className="text-sm text-muted-foreground">
                  Track income, tips, and campus spending in one place
                </p>
              </div>

              {activeTab === "overview" && (
                <div className="space-y-5 animate-fade-up">
                  <div className="space-y-1">
                    <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                      Dashboard
                    </h1>
                    <p className="max-w-2xl text-muted-foreground">
                      Income, expenses, and student work limits at a glance
                    </p>
                  </div>
                  <StatsOverview />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <MoneyPoolsCard />
                    <WorkHourGuard />
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <SalaryEntriesList />
                    <ExpenseTracker />
                  </div>
                </div>
              )}

              {activeTab === "add" && (
                <div className="space-y-5 animate-fade-up">
                  <div>
                    <h1 className="font-display text-3xl font-bold">Add Income</h1>
                    <p className="text-muted-foreground">Log paycheques and tips from work</p>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <SalaryForm />
                    <TipsForm />
                  </div>
                </div>
              )}

              {activeTab === "expenses" && (
                <div className="space-y-5 animate-fade-up">
                  <div>
                    <h1 className="font-display text-3xl font-bold">Expenses</h1>
                    <p className="text-muted-foreground">
                      Add spending, search by name, and tag tips vs bank income
                    </p>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                    <ExpenseForm />
                    <ExpenseTracker />
                  </div>
                </div>
              )}

              {activeTab === "search" && (
                <div className="mx-auto max-w-4xl space-y-5 animate-fade-up">
                  <div>
                    <h1 className="font-display text-3xl font-bold">Search</h1>
                    <p className="text-muted-foreground">Find salary entries by date range</p>
                  </div>
                  <SalarySearch />
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-5 animate-fade-up">
                  <div>
                    <h1 className="font-display text-3xl font-bold">Insights</h1>
                    <p className="text-muted-foreground">Trends across income and spending</p>
                  </div>
                  <MoneyPoolsCard />
                  <IncomeChart />
                </div>
              )}

              {activeTab === "daily-hours" && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <h1 className="font-display text-3xl font-bold">Hours</h1>
                    <p className="text-muted-foreground">
                      Log shifts and estimate hours from your bank deposit
                    </p>
                  </div>
                  <WorkHourGuard />
                  <div className="grid gap-6 md:grid-cols-2">
                    <DailyHoursForm />
                    <NotificationSettings />
                  </div>
                  <DailyHoursList />
                  <HoursCalculator />
                </div>
              )}
            </div>
          </div>

          <Footer />
          <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
