
import React from 'react';

export type UserRole = 'admin' | 'customer' | 'vendor' | null;

export interface User {
  id: number;
  name: string;
  phone: string;
  role: UserRole | string;
  avatar?: string;
  email?: string;
  status?: 'Active' | 'Inactive' | 'Invited';
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  gst: string;
  balance: number;
  address: string;
  email?: string;
  status: 'active' | 'inactive';
  created_date: string;
}

export interface Vendor {
  id: number;
  name: string;
  phone: string;
  gst: string;
  outstanding: number;
  status: 'active' | 'inactive';
  email?: string;
  address?: string;
}

export interface Product {
  sku: string;
  name: string;
  price?: number;
  cost?: number;
  stock?: number;
  hsn_code?: string;
  type?: 'goods' | 'service';
  unit?: string;
  tax_preference?: 'taxable' | 'non-taxable';
  sales_account?: string;
  sales_description?: string;
  purchase_account?: string;
  purchase_description?: string;
  track_inventory?: boolean;
  inventory_account?: string;
  opening_stock_rate?: number;
  reorder_point?: number;
  preferred_vendor_id?: number;
}

export interface InvoiceItem {
  id?: number;
  sku?: string;
  description: string;
  qty: number;
  unit_cost: number;
  discount?: number;
  discount_type?: 'percent' | 'amount';
  gst_percent?: number;
  gst?: number;
}

export type DocumentType = 'invoice' | 'estimate' | 'bill' | 'purchase_order';
export type DocumentStatus = 'Paid' | 'Unpaid' | 'Overdue' | 'Draft' | 'Sent' | 'Accepted' | 'Rejected';

export interface AccountingDocument {
  id: string;
  type: DocumentType;
  number: string;
  order_number?: string;
  related_entity_id: number; // Customer ID or Vendor ID
  related_entity_name: string;
  date: string;
  due_date: string;
  terms?: string;
  subject?: string;
  items: InvoiceItem[];
  subtotal: number;
  gst_total: number;
  adjustment?: number;
  total: number;
  deposit?: number;
  status: DocumentStatus;
  notes?: string;
  terms_conditions?: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  related_entity_id: number;
  related_entity_name: string;
  method: 'Cash' | 'Bank' | 'UPI';
  reference?: string;
  type: 'received' | 'paid'; // received from customer, paid to vendor
  related_document_id?: string;
}

export interface Expense {
  id: number;
  category: string;
  amount: number;
  gst: number;
  vendor: string;
  date: string;
  receipt_url?: string;
}

export interface DashboardStats {
  total_sales_month: number;
  total_expenses_month: number;
  cashflow_chart: { date: string; in: number; out: number }[];
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: React.FC<any>;
  children?: NavigationItem[];
}

// Settings Types
export interface Location {
  id: number;
  name: string;
  address: string;
  type: 'Business' | 'Warehouse';
  isPrimary: boolean;
  transactionSeries?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isSystem?: boolean;
}

export interface OrganizationProfile {
  name: string;
  industry: string;
  location: string;
  address: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    phone: string;
    fax?: string;
    website?: string;
  };
  primaryContact: {
    name: string;
    email: string;
  };
  fiscalYear: string;
  currency: string;
  dateFormat: string;
  timeZone: string;
  language: string;
  companyId: string;
  taxId: string;
}
