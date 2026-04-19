import { DashboardStats, Customer, Vendor, Product, AccountingDocument, Expense, Payment, Location, Role, OrganizationProfile } from './types';

// Mock Data Structure
export const DASHBOARD_DATA: DashboardStats = {
  total_sales_month: 0,
  total_expenses_month: 0,
  cashflow_chart: [
    { date: "2025-01-01", in: 0, out: 0 },
    { date: "2025-01-08", in: 0, out: 0 },
    { date: "2025-01-15", in: 0, out: 0 },
    { date: "2025-01-22", in: 0, out: 0 },
    { date: "2025-01-29", in: 0, out: 0 },
  ]
};

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Arun Kumar",
    phone: "9876543210",
    gst: "29ABCDE1234F1Z5",
    balance: 0,
    address: "89, Ashwin Illam,\nDr MGR Nagar,\nAvinashi, Tiruppur,\nTamil Nadu - 641652",
    email: "arun@example.com",
    status: 'active',
    created_date: '2024-01-15'
  },
  {
    id: 2,
    name: "Paul Limpet",
    phone: "029-123456",
    gst: "33AAVCS1234Q1Z1",
    balance: 0,
    address: "Customer Address Line 1\nLine 2\nCity, State",
    email: "paul@example.com",
    status: 'active',
    created_date: '2024-02-10'
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 1,
    name: "Shankar Traders",
    phone: "9812345678",
    gst: "27ABCDS4523F1Z0",
    outstanding: 0,
    status: 'active',
    address: "12, Market Road, Mumbai"
  },
  {
    id: 2,
    name: "Global Supplies",
    phone: "9988776655",
    gst: "29XYZAB9876L1Z2",
    outstanding: 0,
    status: 'active',
    address: "45, Industrial Area, Bangalore"
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    sku: "PRD-001",
    name: "Milk Powder 1kg",
    price: 0,
    cost: 0,
    stock: 0,
    hsn_code: "0402",
    type: 'goods',
    unit: 'kg',
    tax_preference: 'taxable',
    sales_account: 'Sales',
    purchase_account: 'Cost of Goods Sold',
    track_inventory: true
  },
  {
    sku: "PRD-002",
    name: "Butter 500g",
    price: 0,
    cost: 0,
    stock: 0,
    hsn_code: "0405",
    type: 'goods',
    unit: 'pcs',
    tax_preference: 'taxable',
    track_inventory: true
  }
];

export const MOCK_DOCUMENTS: AccountingDocument[] = [
  // Invoices
  {
    id: "1",
    type: 'invoice',
    number: "FC-2501",
    related_entity_id: 1,
    related_entity_name: "Arun Kumar",
    date: "2025-01-01",
    due_date: "2025-01-15",
    items: [
      { sku: "PRD-001", description: "Milk Powder 1kg", qty: 0, unit_cost: 0, gst_percent: 5 }
    ],
    subtotal: 0,
    gst_total: 0,
    total: 0,
    deposit: 0,
    status: "Unpaid"
  },
  {
    id: "2",
    type: 'invoice',
    number: "FC-2502",
    related_entity_id: 2,
    related_entity_name: "Paul Limpet",
    date: "01/01/2025",
    due_date: "01/15/2025",
    items: [
      { description: "Bookkeeping", unit_cost: 0, qty: 0, gst_percent: 18 }
    ],
    subtotal: 0,
    gst_total: 0,
    total: 0,
    deposit: 0,
    status: "Paid"
  },
  // Estimates
  {
    id: "3",
    type: 'estimate',
    number: "EST-005",
    related_entity_id: 1,
    related_entity_name: "Arun Kumar",
    date: "2025-02-10",
    due_date: "2025-02-20",
    items: [
      { description: "Bulk Order Milk Powder", unit_cost: 0, qty: 0, gst_percent: 5 }
    ],
    subtotal: 0,
    gst_total: 0,
    total: 0,
    status: "Sent"
  },
  // Bills
  {
    id: "4",
    type: 'bill',
    number: "BILL-999",
    related_entity_id: 1,
    related_entity_name: "Shankar Traders",
    date: "2025-02-01",
    due_date: "2025-02-15",
    items: [
      { description: "Raw Materials", unit_cost: 0, qty: 0, gst_percent: 18 }
    ],
    subtotal: 0,
    gst_total: 0,
    total: 0,
    status: "Unpaid"
  },
  // POs
  {
    id: "5",
    type: 'purchase_order',
    number: "PO-202",
    related_entity_id: 2,
    related_entity_name: "Global Supplies",
    date: "2025-02-05",
    due_date: "2025-02-20",
    items: [
      { description: "Packaging Boxes", unit_cost: 0, qty: 0, gst_percent: 12 }
    ],
    subtotal: 0,
    gst_total: 0,
    total: 0,
    status: "Accepted"
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "PAY-001",
    date: "2025-02-10",
    amount: 0,
    related_entity_id: 1,
    related_entity_name: "Arun Kumar",
    method: "UPI",
    type: "received",
    reference: "UPI/123456"
  },
  {
    id: "PAY-002",
    date: "2025-02-12",
    amount: 0,
    related_entity_id: 1,
    related_entity_name: "Shankar Traders",
    method: "Bank",
    type: "paid",
    reference: "NEFT/998877"
  }
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 1,
    category: "Transport",
    amount: 0,
    gst: 0,
    vendor: "Local Travels",
    date: "2025-02-01"
  }
];

export const COMPANY_INFO: OrganizationProfile = {
  name: "Flowers Cake",
  industry: "Food Services (Restaurants/Fast Food)",
  location: "India",
  address: {
    street1: "89, Ashwin Illam, Dr MGR Nagar",
    street2: "Avinashi",
    city: "Tiruppur",
    state: "Tamil Nadu",
    pincode: "641652",
    country: "India",
    phone: "99949993853"
  },
  primaryContact: {
    name: "Admin",
    email: "admin@flowerscake.rf.gd"
  },
  fiscalYear: "April - March",
  currency: "INR",
  dateFormat: "dd/MM/yyyy",
  timeZone: "(UTC+05:30) India Standard Time",
  language: "English",
  companyId: "67583000000001",
  taxId: "33AAAAA0000A1Z5"
};

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 1,
    name: "Head Office",
    address: "Avinashi Tamil Nadu India",
    type: "Business",
    isPrimary: true,
    transactionSeries: "Default Transaction Series"
  }
];

export const MOCK_ROLES: Role[] = [
  { id: 1, name: "Admin", description: "Unrestricted access to all modules.", isSystem: true },
  { id: 2, name: "Staff", description: "Access to all modules except reports, settings and accountant.", isSystem: true },
  { id: 3, name: "Staff (Assigned Customers Only)", description: "Access to all modules, transactions and data of assigned customers and all vendors except banking, reports, settings and accountant.", isSystem: true },
  { id: 4, name: "TimesheetStaff", description: "TimesheetStaff Role", isSystem: true },
];