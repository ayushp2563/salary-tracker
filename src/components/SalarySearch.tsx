
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
import { useSalaryEntries, SalaryEntry } from '@/hooks/useSalaryEntries';
import EditEntryDialog from './EditEntryDialog';

const SalarySearch = () => {
  const [searchParams, setSearchParams] = useState({
    startDate: '',
    endDate: '',
  });
  const [searchResults, setSearchResults] = useState<SalaryEntry[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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
      // Refresh search results
      handleSearch();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Salary Reports
        </CardTitle>
        <CardDescription>
          Find salary entries by date range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
              <p className="text-muted-foreground text-center py-4">
                No entries found for the selected date range
              </p>
            ) : (
              <div className="space-y-3">
                {searchResults.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {formatDate(entry.start_date)} - {formatDate(entry.end_date)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Added: {formatDate(entry.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <EditEntryDialog entry={entry} />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(entry.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Hours: </span>
                        {entry.hours_worked}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Base Salary: </span>
                        {formatCurrency(entry.base_salary, entry.currency)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tips: </span>
                        {formatCurrency(entry.tips, entry.currency)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total: </span>
                        <span className="font-medium">
                          {formatCurrency(entry.base_salary + entry.tips, entry.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalarySearch;
