import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister
} from "react-hook-form";
import { CurrencyCode } from '@/(components)/CurrencySelector';

// Existing interfaces remain the same
export interface User {
  id: string;
  email: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  user_id: string;
  name: string;
  language?: string;
  background_url?: string;
  logo_url?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id?: string;
  user_id?: string;
  template_id?: string;
  invoice_number: string;
  status: InvoiceStatus;
  customer_name: string;
  customer_email?: string;
  customer_address?: string;
  invoice_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount: number;
  notes?: string;
  pdf_path?: string;
  created_at?: string;
  updated_at?: string;
  items: InvoiceItem[];
}

export interface InvoiceFormData extends Invoice {
  currencyCode: CurrencyCode;
}

export interface CurrencyInfo {
  symbol: string;
  locale: string;
  name: string;
}

// Component Props interfaces
export interface InvoiceItemsProps {
  register: UseFormRegister<InvoiceFormData>;
  fieldArray: {
    fields: FieldArrayWithId<InvoiceFormData, "items", "id">[];
    append: UseFieldArrayAppend<InvoiceFormData, "items">;
    remove: UseFieldArrayRemove;
  };
  items: InvoiceItem[];
  currencyCode: CurrencyCode;
  formatCurrency: (amount: number, currencyCode: CurrencyCode) => string;
}

export interface InvoiceTotalsProps {
  register: UseFormRegister<InvoiceFormData>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currencyCode: CurrencyCode;
  formatCurrency: (amount: number, currencyCode: CurrencyCode) => string;
}

export interface InvoiceDetailsProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
}

export interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export interface InvoiceFormProps {
  initialInvoice?: Partial<Invoice>;
  onChange: (data: Partial<Invoice>) => void;
}
