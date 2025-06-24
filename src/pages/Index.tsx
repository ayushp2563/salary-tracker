
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalaryForm from "@/components/SalaryForm";
import TipsForm from "@/components/TipsForm";
import StatsOverview from "@/components/StatsOverview";
import IncomeChart from "@/components/IncomeChart";
import SalarySummaryOptions from "@/components/SalarySummaryOptions";
import SalarySearch from "@/components/SalarySearch";
import SalaryEntriesList from "@/components/SalaryEntriesList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4 py-4 sm:py-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Salary Tracker
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Track your earnings, monitor trends, and manage your income with ease
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="add" className="text-xs sm:text-sm py-2">
              Add Entry
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs sm:text-sm py-2">
              Search
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <SalaryEntriesList />
              <SalarySummaryOptions />
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
  );
};

export default Index;
