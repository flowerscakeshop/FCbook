import React, { useState } from 'react';
import { Customer, AccountingDocument, Payment } from '../../types';
import { ArrowLeft, User, Phone, MapPin, Mail, FileText, ScrollText, CreditCard } from 'lucide-react';

interface CustomerDetailProps {
  id: number;
  onBack: () => void;
  customers: Customer[];
  documents: AccountingDocument[];
  payments: Payment[];
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ id, onBack, customers, documents, payments }) => {
  const customer = customers.find(c => c.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!customer) return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-slate-500 mb-4">Customer not found</div>
      <button onClick={onBack} className="text-blue-600 hover:underline">Go Back</button>
    </div>
  );

  const invoices = documents.filter(d => d.related_entity_id === id && d.type === 'invoice');
  const estimates = documents.filter(d => d.related_entity_id === id && d.type === 'estimate');
  const customerPayments = payments.filter(p => p.related_entity_id === id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'estimates', label: 'Estimates', icon: ScrollText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-4">
          <ArrowLeft size={18} className="mr-1" /> Back to Customers
        </button>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <Phone size={14} /> {customer.phone}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Outstanding Balance</p>
            <p className="text-3xl font-bold text-red-600">₹{customer.balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                ${activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
              <div className="space-y-3">
                 <div className="flex items-start gap-3">
                  <Mail className="text-slate-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-slate-500">Email Address</p>
                    <p className="text-slate-900">{customer.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-slate-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-slate-500">Billing Address</p>
                    <p className="text-slate-900 whitespace-pre-line">{customer.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
               <h3 className="text-lg font-semibold mb-4">Tax Info</h3>
                <div className="p-4 bg-slate-50 rounded-lg">
                   <p className="text-sm text-slate-500">GSTIN</p>
                   <p className="font-mono text-slate-900 font-medium">{customer.gst}</p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Number</th>
                <th className="py-2">Date</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b last:border-0">
                  <td className="py-3 text-blue-600 font-medium">{inv.number}</td>
                  <td className="py-3">{inv.date}</td>
                  <td className="py-3 text-right">₹{inv.total.toLocaleString()}</td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">{inv.status}</span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-500">No invoices found.</td></tr>}
            </tbody>
          </table>
        )}
        
        {activeTab === 'estimates' && (
           <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Number</th>
                <th className="py-2">Date</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map(est => (
                <tr key={est.id} className="border-b last:border-0">
                  <td className="py-3 text-blue-600 font-medium">{est.number}</td>
                  <td className="py-3">{est.date}</td>
                  <td className="py-3 text-right">₹{est.total.toLocaleString()}</td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{est.status}</span>
                  </td>
                </tr>
              ))}
              {estimates.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-500">No estimates found.</td></tr>}
            </tbody>
          </table>
        )}

        {activeTab === 'payments' && (
           <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Reference</th>
                <th className="py-2">Date</th>
                <th className="py-2">Method</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {customerPayments.map(pay => (
                <tr key={pay.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{pay.reference}</td>
                  <td className="py-3">{pay.date}</td>
                  <td className="py-3">{pay.method}</td>
                  <td className="py-3 text-right text-green-600 font-medium">+₹{pay.amount.toLocaleString()}</td>
                </tr>
              ))}
               {customerPayments.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-500">No payments found.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;