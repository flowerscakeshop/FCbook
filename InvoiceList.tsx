import React, { useState } from 'react';
import { Vendor, AccountingDocument, Payment } from '../../types';
import { ArrowLeft, User, Phone, MapPin, Receipt, Truck, CreditCard } from 'lucide-react';

interface VendorDetailProps {
  id: number;
  onBack: () => void;
  vendors: Vendor[];
  documents: AccountingDocument[];
  payments: Payment[];
}

const VendorDetail: React.FC<VendorDetailProps> = ({ id, onBack, vendors, documents, payments }) => {
  const vendor = vendors.find(v => v.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!vendor) return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-slate-500 mb-4">Vendor not found</div>
      <button onClick={onBack} className="text-blue-600 hover:underline">Go Back</button>
    </div>
  );

  const bills = documents.filter(d => d.related_entity_id === id && d.type === 'bill');
  const pos = documents.filter(d => d.related_entity_id === id && d.type === 'purchase_order');
  const vendorPayments = payments.filter(p => p.related_entity_id === id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'bills', label: 'Bills', icon: Receipt },
    { id: 'pos', label: 'Purchase Orders', icon: Truck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-4">
          <ArrowLeft size={18} className="mr-1" /> Back to Vendors
        </button>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold">
              {vendor.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{vendor.name}</h1>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <Phone size={14} /> {vendor.phone}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Outstanding Payables</p>
            <p className="text-3xl font-bold text-red-600">₹{vendor.outstanding.toLocaleString()}</p>
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
                  ? 'border-purple-500 text-purple-600' 
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
              <h3 className="text-lg font-semibold mb-4">Vendor Details</h3>
              <div className="space-y-3">
                 <div className="flex items-start gap-3">
                  <MapPin className="text-slate-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="text-slate-900 whitespace-pre-line">{vendor.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
               <h3 className="text-lg font-semibold mb-4">Tax Info</h3>
                <div className="p-4 bg-slate-50 rounded-lg">
                   <p className="text-sm text-slate-500">GSTIN</p>
                   <p className="font-mono text-slate-900 font-medium">{vendor.gst}</p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'bills' && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Bill #</th>
                <th className="py-2">Date</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(doc => (
                <tr key={doc.id} className="border-b last:border-0">
                  <td className="py-3 text-purple-600 font-medium">{doc.number}</td>
                  <td className="py-3">{doc.date}</td>
                  <td className="py-3 text-right">₹{doc.total.toLocaleString()}</td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">{doc.status}</span>
                  </td>
                </tr>
              ))}
               {bills.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-500">No bills found.</td></tr>}
            </tbody>
          </table>
        )}
        
        {activeTab === 'pos' && (
           <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">PO #</th>
                <th className="py-2">Date</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {pos.map(doc => (
                <tr key={doc.id} className="border-b last:border-0">
                  <td className="py-3 text-purple-600 font-medium">{doc.number}</td>
                  <td className="py-3">{doc.date}</td>
                  <td className="py-3 text-right">₹{doc.total.toLocaleString()}</td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{doc.status}</span>
                  </td>
                </tr>
              ))}
               {pos.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-500">No Purchase Orders found.</td></tr>}
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
              {vendorPayments.map(pay => (
                <tr key={pay.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{pay.reference}</td>
                  <td className="py-3">{pay.date}</td>
                  <td className="py-3">{pay.method}</td>
                  <td className="py-3 text-right text-red-600 font-medium">-₹{pay.amount.toLocaleString()}</td>
                </tr>
              ))}
               {vendorPayments.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-500">No payments found.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VendorDetail;