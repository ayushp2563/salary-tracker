
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LandingPage from "@/components/LandingPage";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import SalaryForm from "@/components/SalaryForm";
import TipsForm from "@/components/TipsForm";
import StatsOverview from "@/components/StatsOverview";
import IncomeChart from "@/components/IncomeChart";
import SalarySummaryOptions from "@/components/SalarySummaryOptions";
import SalarySearch from "@/components/SalarySearch";
import SalaryEntriesList from "@/components/SalaryEntriesList";
import { ExtraHoursCard } from "@/components/ExtraHoursCard";

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 sm:space-y-4 py-4 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Salary Tracker
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Track your earnings, monitor trends, and manage your income with ease
            </p>
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-white dark:bg-gray-800">
              <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900">
                Overview
              </TabsTrigger>
              <TabsTrigger value="add" className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900">
                Add Entry
              </TabsTrigger>
              <TabsTrigger value="search" className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900">
                Search
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <SalaryEntriesList />
                <div className="space-y-4">
                  <SalarySummaryOptions />
                  <ExtraHoursCard />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="add" className="mt-4 sm:mt-6">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
                <SalaryForm />
                <TipsForm />
              </div>
            </TabsContent>

            <TabsContent value="search" className="mt-4 sm:mt-6">
              <div className="max-w-4xl mx-auto">
                <SalarySearch />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4 sm:mt-6">
              <IncomeChart />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
