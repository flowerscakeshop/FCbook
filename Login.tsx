import React from 'react';
import { PieChart, TrendingUp, BarChart, FileText } from 'lucide-react';

const Reports: React.FC = () => {
  const reportGroups = [
    {
      title: "Financial Reports",
      icon: TrendingUp,
      reports: ["Profit & Loss", "Balance Sheet", "Cash Flow Statement", "Trial Balance", "General Ledger"]
    },
    {
      title: "Sales Reports",
      icon: BarChart,
      reports: ["Sales by Customer", "Sales by Item", "GST Outward Summary", "Sales by Salesperson"]
    },
    {
      title: "Inventory & Expense",
      icon: PieChart,
      reports: ["Stock Summary", "Low Stock Alert", "Expense by Category", "Purchase by Vendor"]
    },
    {
      title: "Tax Reports",
      icon: FileText,
      reports: ["GSTR-1 Summary", "GSTR-3B Summary", "Tax Liability"]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportGroups.map((group, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <group.icon size={24} />
              <h2 className="text-lg font-bold text-slate-900">{group.title}</h2>
            </div>
            <ul className="space-y-2">
              {group.reports.map((report, rIdx) => (
                <li key={rIdx}>
                   <button className="flex items-center w-full text-left text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-2 py-2 rounded transition-colors group">
                     <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-3 group-hover:bg-blue-500"></div>
                     {report}
                   </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;