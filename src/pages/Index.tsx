
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';
import SalaryForm from '@/components/SalaryForm';
import WeeklySummaryCard from '@/components/WeeklySummaryCard';
import IncomeChart from '@/components/IncomeChart';
import StatsOverview from '@/components/StatsOverview';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { getWeeklySummaries, loading: dataLoading } = useSalaryEntries();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const weeklySummaries = getWeeklySummaries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your earnings, monitor trends, and gain insights into your income patterns
          </p>
        </div>

        {dataLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <StatsOverview />

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Form and Charts */}
              <div className="lg:col-span-2 space-y-8">
                <SalaryForm />
                <IncomeChart />
              </div>

              {/* Right Column - Weekly Summaries */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Weekly Summaries</h2>
                  {weeklySummaries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">No entries yet</p>
                      <p className="text-sm">Add your first salary entry to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {weeklySummaries.slice(0, 6).map((week, index) => (
                        <WeeklySummaryCard
                          key={`${week.weekStart}-${week.weekEnd}`}
                          weekStart={week.weekStart}
                          weekEnd={week.weekEnd}
                          totalHours={week.totalHours}
                          totalIncome={week.totalIncome}
                          totalTips={week.totalTips}
                          previousWeekIncome={weeklySummaries[index + 1]?.totalIncome}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                Keep track of your earnings and watch your income grow! 📈
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
