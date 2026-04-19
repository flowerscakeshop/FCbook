import React, { useState } from 'react';
import { UserRole, AccountingDocument, Expense, Customer } from '../../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar 
} from 'recharts';
import { 
  MoreHorizontal, ChevronDown, PenLine, Plus, Search, HelpCircle, Settings, Bell,
  ArrowRight, ShieldCheck, Wallet, ArrowUpRight, ArrowDownRight, Briefcase
} from 'lucide-react';

// --- Specific Mock Data for Visual Match ---
const BANK_ACCOUNTS = [
  { name: 'Checking', bank: 'Bank Balance', system: 'In FC Book', bankBal: 0, sysBal: 0, toReview: 0 },
  { name: 'Mastercard', bank: 'Bank Balance', system: 'In FC Book', bankBal: 0, sysBal: 0, toReview: 0 },
];

const Card = ({ title, children, action, className = '' }: any) => (
  <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">{title}</h3>
      {action}
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

interface DashboardProps {
  role: UserRole;
  documents: AccountingDocument[];
  expenses: Expense[];
  customers: Customer[];
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ role, documents, expenses, customers, onNavigate }) => {
  const [privacyMode, setPrivacyMode] = useState(false);

  // --- Dynamic Data Calculations ---
  
  // 1. Invoice Stats (Receivables)
  const invoiceStats = documents
    .filter(doc => doc.type === 'invoice')
    .reduce((acc, doc) => {
      const amount = doc.total - (doc.deposit || 0);
      if (doc.status === 'Paid') {
        acc.deposited += amount;
      } else if (doc.status === 'Overdue') {
        acc.overdue += amount;
        acc.notDeposited += amount;
      } else {
        acc.notDue += amount;
        acc.notDeposited += amount;
      }
      return acc;
    }, { overdue: 0, notDue: 0, deposited: 0, notDeposited: 0 });

  // 1.1 Bill Stats (Payables)
  const billStats = documents
    .filter(doc => doc.type === 'bill')
    .reduce((acc, doc) => {
      const amount = doc.total - (doc.deposit || 0);
      if (doc.status !== 'Paid') {
        acc.payables += amount;
      }
      return acc;
    }, { payables: 0 });

  // 2. Expense Data by Category
  const expenseByCategory = expenses.reduce((acc: any, exp) => {
    const cat = exp.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += exp.amount;
    return acc;
  }, {});

  const colors = ['#10b981', '#0ea5e9', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6'];
  const expenseData = Object.entries(expenseByCategory).map(([name, value], idx) => ({
    name,
    value: value as number,
    color: colors[idx % colors.length]
  }));

  // 3. Profit & Loss
  const totalIncome = documents
    .filter(doc => doc.type === 'invoice')
    .reduce((sum, d) => sum + d.total, 0);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const plDataCalculated = [
    { name: 'Income', value: totalIncome, color: '#16a34a' },
    { name: 'Expenses', value: totalExpenses, color: '#0891b2' },
  ];

  // 4. Sales over time (Last 30 days)
  const salesByDay: { [key: string]: number } = {};
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    salesByDay[d.getDate().toString()] = 0;
  }

  documents
    .filter(doc => doc.type === 'Invoice')
    .forEach(doc => {
      const date = new Date(doc.date);
      const day = date.getDate().toString();
      if (salesByDay[day] !== undefined) {
        salesByDay[day] += doc.total;
      }
    });

  const salesDataCalculated = Object.entries(salesByDay)
    .map(([day, value]) => ({ day, value }));

  // If not admin, show a simpler view (or existing logical view)
  if (role !== 'admin') {
    return (
       <div className="p-8 flex flex-col items-center justify-center h-full bg-white rounded-2xl shadow-sm">
         <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <ShieldCheck size={32} />
         </div>
         <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to your Portal</h2>
         <p className="text-slate-500 text-center max-w-md">
           Use the sidebar to view your specific invoices, orders, and account settings.
         </p>
       </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Bar for Dashboard Context */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of your business performance</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 font-medium">Privacy</span>
            <button 
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacyMode ? 'bg-green-600' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacyMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button 
          onClick={() => onNavigate('create-invoice')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-sm font-semibold text-slate-700">Add Invoice</span>
        </button>
        <button 
          onClick={() => onNavigate('create-payment')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Briefcase size={24} />
          </div>
          <span className="text-sm font-semibold text-slate-700">Record Payment</span>
        </button>
        <button 
          onClick={() => onNavigate('create-customer')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-600 group-hover:text-white transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-sm font-semibold text-slate-700">Add Customer</span>
        </button>
        <button 
          onClick={() => onNavigate('create-product')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-sm font-semibold text-slate-700">Add Item</span>
        </button>
        <button 
          onClick={() => onNavigate('create-vendor')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-sm font-semibold text-slate-700">Add Vendor</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. INVOICES */}
        <Card title="Invoices">
          <div className="space-y-6">
            {/* Unpaid Section */}
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-2xl font-bold text-slate-800">
                  {privacyMode ? '****' : formatCurrency(invoiceStats.overdue + invoiceStats.notDue)}
                </span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Unpaid</span>
              </div>
              <div className="text-xs text-slate-400 mb-3">Last 365 days</div>
              
              {/* Custom Progress Bar */}
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex mb-2">
                <div 
                  style={{ width: `${(invoiceStats.overdue / (invoiceStats.overdue + invoiceStats.notDue || 1)) * 100}%` }} 
                  className="bg-orange-500 h-full"
                ></div>
                <div 
                  style={{ width: `${(invoiceStats.notDue / (invoiceStats.overdue + invoiceStats.notDue || 1)) * 100}%` }} 
                  className="bg-slate-400 h-full"
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                 <div>
                    <div className="font-bold text-slate-700">{privacyMode ? '****' : formatCurrency(invoiceStats.overdue)}</div>
                    <div className="text-orange-600 text-xs">Overdue</div>
                 </div>
                 <div className="text-right">
                    <div className="font-bold text-slate-700">{privacyMode ? '****' : formatCurrency(invoiceStats.notDue)}</div>
                    <div className="text-slate-500 text-xs">Not due yet</div>
                 </div>
              </div>
            </div>

            {/* Paid Section */}
            <div>
               <div className="flex justify-between items-end mb-1">
                <span className="text-xl font-bold text-slate-700">
                   {privacyMode ? '****' : formatCurrency(invoiceStats.deposited + invoiceStats.notDeposited)}
                </span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Paid</span>
              </div>
              <div className="text-xs text-slate-400 mb-3">Last 30 days</div>

               {/* Custom Progress Bar */}
               <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex mb-2">
                <div 
                  style={{ width: `${(invoiceStats.notDeposited / (invoiceStats.deposited + invoiceStats.notDeposited || 1)) * 100}%` }} 
                  className="bg-green-500 h-full"
                ></div>
                <div 
                  style={{ width: `${(invoiceStats.deposited / (invoiceStats.deposited + invoiceStats.notDeposited || 1)) * 100}%` }} 
                  className="bg-green-300 h-full"
                ></div>
              </div>

               <div className="flex justify-between text-sm">
                 <div>
                    <div className="font-bold text-slate-700">{privacyMode ? '****' : formatCurrency(invoiceStats.notDeposited)}</div>
                    <div className="text-slate-600 text-xs">Not deposited</div>
                 </div>
                 <div className="text-right">
                    <div className="font-bold text-slate-700">{privacyMode ? '****' : formatCurrency(invoiceStats.deposited)}</div>
                    <div className="text-slate-500 text-xs">Deposited</div>
                 </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. EXPENSES */}
        <Card title="Expenses" action={
             <div className="flex items-center text-xs text-slate-500">
                Last month <ChevronDown size={14} className="ml-1"/>
             </div>
          }>
           <div className="mb-2">
             <div className="text-2xl font-bold text-slate-800">{privacyMode ? '****' : formatCurrency(totalExpenses)}</div>
             <div className="text-xs text-slate-500">Overall</div>
           </div>
           
           <div className="flex items-center">
              {/* Donut Chart */}
              <div className="w-32 h-32 relative flex-shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                          data={expenseData.length > 0 ? expenseData : [{ name: 'None', value: 1, color: '#f1f5f9' }]} 
                          innerRadius={40} 
                          outerRadius={55} 
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                       >
                          {expenseData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 {/* Center Text */}
                 <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-50"></div>
                 </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 ml-6 space-y-3">
                 {expenseData.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                       <div className="flex items-center">
                          <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          <span className="text-slate-600 truncate max-w-[80px] sm:max-w-none">{item.name}</span>
                       </div>
                       <span className="font-bold text-slate-700">{privacyMode ? '****' : formatCurrency(item.value)}</span>
                    </div>
                 ))}
                 {expenseData.length === 0 && <div className="text-xs text-slate-400">No expenses recorded</div>}
              </div>
           </div>
        </Card>

        {/* 3. BANK ACCOUNTS */}
        <Card title="Bank Accounts" action={<PenLine size={16} className="text-slate-400 cursor-pointer" />}>
           <div className="space-y-6">
              {BANK_ACCOUNTS.map((acc, idx) => (
                 <div key={idx} className="flex justify-between items-start">
                    <div>
                       <div className="font-bold text-slate-800 text-sm">{acc.name}</div>
                       <div className="text-xs text-slate-500 mt-1">{acc.bank}</div>
                       <div className="font-bold text-slate-700">{privacyMode ? '****' : formatCurrency(acc.bankBal)}</div>
                       <div className="text-xs text-slate-400 italic mt-1">{acc.system}</div>
                       <div className="font-medium text-slate-600 text-sm">{privacyMode ? '****' : formatCurrency(acc.sysBal)}</div>
                    </div>
                    <div className="text-right">
                       <div className="inline-flex items-center text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded">
                          {acc.toReview} to review
                       </div>
                    </div>
                 </div>
              ))}
              <div className="pt-4 border-t border-slate-100 flex justify-center gap-6">
                 <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Connect accounts</button>
                 <button className="text-sm font-bold text-slate-400 hover:text-slate-600">Go to registers</button>
              </div>
           </div>
        </Card>

        {/* 4. PROFIT & LOSS */}
        <Card title="Profit & Loss" action={
             <div className="flex items-center text-xs text-slate-500">
                Last month <ChevronDown size={14} className="ml-1"/>
             </div>
          }>
           <div className="mb-4">
             <div className="text-2xl font-bold text-slate-800">{privacyMode ? '****' : formatCurrency(totalIncome - totalExpenses)}</div>
             <div className="text-xs text-slate-500">Net income overall</div>
           </div>

           {/* Custom Horizontal Bar Chart Simulation */}
           <div className="space-y-4">
              {plDataCalculated.map((item, idx) => (
                 <div key={idx} className="relative group">
                    <div className="flex justify-between text-sm mb-1 z-10 relative">
                       <span className="font-semibold text-slate-700">{item.name}</span>
                    </div>
                    {/* The Bar Container */}
                    <div className="h-10 bg-slate-50 rounded-md relative overflow-hidden flex items-center px-3 border border-slate-100">
                       {/* The Bar */}
                       <div 
                         className="absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-500" 
                         style={{ width: `${(item.value / (Math.max(totalIncome, totalExpenses) || 1)) * 100}%`, backgroundColor: item.color }}
                       />
                       <div className="absolute left-0 top-0 bottom-0 w-1 transition-all" style={{ backgroundColor: item.color }} />
                       
                       {/* Value */}
                       <span className="font-bold text-slate-800 relative z-10 ml-auto">
                          {privacyMode ? '****' : formatCurrency(item.value)}
                       </span>
                    </div>
                     {/* "To review" logic simulation */}
                    {idx === 0 && (
                       <div className="text-right text-xs text-blue-600 font-medium mt-1">3 to review</div>
                    )}
                     {idx === 1 && (
                       <div className="text-right text-xs text-blue-600 font-medium mt-1">13 to review</div>
                    )}
                 </div>
              ))}
           </div>
        </Card>

        {/* 5. SALES */}
        <Card title="Sales" action={
             <div className="flex items-center text-xs text-slate-500">
                Last 30 days <ChevronDown size={14} className="ml-1"/>
             </div>
          }>
           <div className="mb-4">
             <div className="text-2xl font-bold text-slate-800">{privacyMode ? '****' : formatCurrency(totalIncome)}</div>
             <div className="text-xs text-slate-500">Total Sales</div>
           </div>

           <div className="h-40 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={salesDataCalculated}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <Tooltip 
                       contentStyle={{border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                       formatter={(val: number) => privacyMode ? ['****', 'Sales'] : [formatCurrency(val), 'Sales']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={{r: 4, fill: '#16a34a'}} activeDot={{r: 6}} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* 6. PAYABLES */}
        <Card title="Payables">
           <div className="space-y-6">
              {/* Bills Section */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-2xl font-bold text-slate-800">
                    {privacyMode ? '****' : formatCurrency(billStats.payables)}
                  </span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Unpaid</span>
                </div>
                <div className="text-xs text-slate-400 mb-3">Total outgoing balance</div>
                
                {/* Custom Progress Bar */}
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex mb-2">
                  <div 
                    style={{ width: `${(billStats.payables / (totalIncome || 1)) * 100}%` }} 
                    className="bg-purple-500 h-full"
                  ></div>
                </div>
                
                <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                   Manage your vendor payments and upcoming bills efficiently from the purchases module.
                </p>
                <div className="mt-6 flex justify-between">
                   <button onClick={() => onNavigate('bills')} className="text-blue-600 text-sm font-bold hover:underline">View Bills</button>
                   <button onClick={() => onNavigate('payments')} className="text-blue-600 text-sm font-bold hover:underline">Recent Payments</button>
                </div>
              </div>
           </div>
        </Card>

      </div>
    </div>
  );
};

// Helper for Sales Chart
const CartesianGridVertical = ({ vertical, ...props }: any) => {
  return null; // Custom clean look
}

export default Dashboard;