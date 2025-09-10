
export interface SalaryEntry {
  id: string;
  startDate: string;
  endDate: string;
  hoursWorked: number;
  baseSalary: number;
  tips: number;
  currency: string;
  description?: string;
  createdAt: string;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  totalIncome: number;
  totalTips: number;
  entries: SalaryEntry[];
}
