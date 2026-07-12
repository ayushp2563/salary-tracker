export type PaymentSource = 'tips' | 'bank';

export type ExpenseCategory =
  | 'rent'
  | 'groceries'
  | 'transit'
  | 'tuition'
  | 'textbooks'
  | 'phone'
  | 'utilities'
  | 'dining'
  | 'entertainment'
  | 'healthcare'
  | 'other';

export interface Expense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  payment_source: PaymentSource;
  currency: string;
  expense_date: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'rent', label: 'Rent / Housing' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'transit', label: 'Transit / Gas' },
  { value: 'tuition', label: 'Tuition / Fees' },
  { value: 'textbooks', label: 'Textbooks / Supplies' },
  { value: 'phone', label: 'Phone / Internet' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'dining', label: 'Dining Out' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'other', label: 'Other' },
];

export type StudentRegion = 'CA' | 'US';
export type StudentStatus = 'domestic' | 'international';
