
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { useSalaryEntries, WeeklySummary } from '@/hooks/useSalaryEntries';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const SalarySummaryOptions = () => {
  const [summaryType, setSummaryType] = useState<'weekly' | 'biweekly'>('weekly');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { getWeeklySummaries } = useSalaryEntries();

  const getCustomSummaries = (): WeeklySummary[] => {
    const weeklySummaries = getWeeklySummaries();
    
    if (summaryType === 'weekly') {
      return weeklySummaries;
    }
    
    // For bi-weekly, combine every two weeks
    const biweeklySummaries: WeeklySummary[] = [];
    for (let i = 0; i < weeklySummaries.length; i += 2) {
      const firstWeek = weeklySummaries[i];
      const secondWeek = weeklySummaries[i + 1];
      
      if (firstWeek) {
        const combinedSummary: WeeklySummary = {
          weekStart: secondWeek ? secondWeek.weekStart : firstWeek.weekStart,
          weekEnd: firstWeek.weekEnd,
          totalHours: firstWeek.totalHours + (secondWeek?.totalHours || 0),
          totalExtraHours: firstWeek.totalExtraHours + (secondWeek?.totalExtraHours || 0),
          totalIncome: firstWeek.totalIncome + (secondWeek?.totalIncome || 0),
          totalTips: firstWeek.totalTips + (secondWeek?.totalTips || 0),
          entries: [...firstWeek.entries, ...(secondWeek?.entries || [])],
        };
        biweeklySummaries.push(combinedSummary);
      }
    }
    
    return biweeklySummaries;
  };

  const summaries = getCustomSummaries();

  // Reset to page 1 when summary type changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [summaryType]);

  // Pagination logic
  const totalPages = Math.ceil(summaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSummaries = summaries.slice(startIndex, endIndex);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endDate = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startDate} - ${endDate}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Calendar className="h-5 w-5" />
          Salary Summaries
        </CardTitle>
        <CardDescription>
          View your earnings by week or bi-weekly periods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-sm font-medium">Summary Type:</label>
          <Select value={summaryType} onValueChange={(value: 'weekly' | 'biweekly') => setSummaryType(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {summaries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No entries found</p>
              <p className="text-sm">Add salary entries to see summaries</p>
            </div>
          ) : (
            <>
              {currentSummaries.map((summary, index) => (
                <div key={`${summary.weekStart}-${summary.weekEnd}-${index}`} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm sm:text-base">
                        {formatDateRange(summary.weekStart, summary.weekEnd)}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {summary.entries.length} entries • {summary.totalHours} hours
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-lg sm:text-xl text-green-600">
                        {formatCurrency(summary.totalIncome)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-muted-foreground">Base Salary: </span>
                      <span className="font-medium">
                        {formatCurrency(summary.totalIncome - summary.totalTips)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tips: </span>
                      <span className="font-medium">
                        {formatCurrency(summary.totalTips)}
                      </span>
                    </div>
                  </div>

                  {summary.entries.length > 0 && (
                    <div className="mt-3 pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Latest entry: {new Date(summary.entries[0].created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent className="flex flex-wrap justify-center gap-1">
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalarySummaryOptions;
