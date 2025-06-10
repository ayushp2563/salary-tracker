
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
import { useSalaryEntries, SalaryEntry } from '@/hooks/useSalaryEntries';
import EditEntryDialog from './EditEntryDialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const SalarySearch = () => {
  const [searchParams, setSearchParams] = useState({
    startDate: '',
    endDate: '',
  });
  const [searchResults, setSearchResults] = useState<SalaryEntry[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { entries, deleteEntry } = useSalaryEntries();

  const handleSearch = () => {
    if (!searchParams.startDate || !searchParams.endDate) {
      return;
    }

    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.start_date);
      const start = new Date(searchParams.startDate);
      const end = new Date(searchParams.endDate);
      return entryDate >= start && entryDate <= end;
    });

    setSearchResults(filtered);
    setHasSearched(true);
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(id);
      handleSearch();
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Search className="h-5 w-5" />
          Search Salary Reports
        </CardTitle>
        <CardDescription>
          Find salary entries by date range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search_start_date">Start Date</Label>
            <Input
              id="search_start_date"
              type="date"
              value={searchParams.startDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="search_end_date">End Date</Label>
            <Input
              id="search_end_date"
              type="date"
              value={searchParams.endDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
        
        <Button onClick={handleSearch} className="w-full">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>

        {hasSearched && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Search Results ({searchResults.length} entries)
            </h3>
            {searchResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No entries found for the selected date range
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  {currentResults.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-3 sm:p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">
                            {formatDate(entry.start_date)} - {formatDate(entry.end_date)}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Added: {formatDate(entry.created_at)}
                          </p>
                        </div>
                        <div className="flex gap-2 self-start sm:self-auto">
                          <EditEntryDialog entry={entry} />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(entry.id)}
                            className="text-destructive hover:text-destructive text-xs sm:text-sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
                        <div>
                          <span className="text-muted-foreground">Hours: </span>
                          <span className="font-medium">{entry.hours_worked}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Base: </span>
                          <span className="font-medium">{formatCurrency(entry.base_salary, entry.currency)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tips: </span>
                          <span className="font-medium">{formatCurrency(entry.tips, entry.currency)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(entry.base_salary + entry.tips, entry.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

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
        )}
      </CardContent>
    </Card>
  );
};

export default SalarySearch;
