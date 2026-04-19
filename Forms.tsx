import React, { useMemo } from 'react';
import { ArrowLeft, Printer, Download, Share2, CheckCircle, CreditCard } from 'lucide-react';
import { UserRole, AccountingDocument, Customer, Vendor, DocumentStatus, OrganizationProfile } from '../../types';

interface InvoiceViewProps {
  documentId: string;
  onBack: () => void;
  role: UserRole;
  documents: AccountingDocument[];
  customers: Customer[];
  vendors: Vendor[];
  onUpdateStatus: (id: string, status: DocumentStatus) => void;
  onRecordPayment?: (id: string) => void;
  orgProfile: OrganizationProfile;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ documentId, onBack, role, documents, customers, vendors, onUpdateStatus, onRecordPayment, orgProfile }) => {
  const document = documents.find(i => i.id === documentId);
  
  const entity = useMemo(() => {
    if (!document) return null;
    if (document.type === 'invoice' || document.type === 'estimate') {
      return customers.find(c => c.id === document.related_entity_id);
    } else {
      return vendors.find(v => v.id === document.related_entity_id);
    }
  }, [document, customers, vendors]);

  if (!document || !entity) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-slate-500 mb-4">Document not found</p>
        <button onClick={onBack} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-IN", {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const title = document.type.replace('_', ' ');
  const isVendorDoc = document.type === 'bill' || document.type === 'purchase_order';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': case 'Accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'Unpaid': case 'Sent': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Overdue': case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">
      <style>{`
        @media print {
          body { background: #fff; padding: 0; margin: 0; }
          .invoice-wrap { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; max-width: 100% !important; padding: 0 !important; }
          .no-print { display: none !important; }
          /* Ensure text colors print correctly */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Action Bar */}
      <div className="max-w-[900px] mx-auto pt-6 mb-6 flex justify-between items-center px-4 md:px-0 no-print">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to List
        </button>
        <div className="flex gap-3">
          {role === 'admin' && document.status !== 'Paid' && (document.type === 'invoice' || document.type === 'bill') && (
            <div className="flex gap-2">
              <button 
                onClick={() => onUpdateStatus(document.id, 'Paid')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors text-sm font-medium"
              >
                <CheckCircle size={16} className="mr-2" /> Mark as Paid
              </button>
              {onRecordPayment && (
                <button 
                  onClick={() => onRecordPayment(document.id)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
                >
                  <CreditCard size={16} className="mr-2" /> Record Payment
                </button>
              )}
            </div>
          )}

          {role === 'admin' && (
             <button className="flex items-center px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 shadow-sm transition-colors text-sm">
                <Share2 size={16} className="mr-2" /> Share
             </button>
          )}
          <button className="flex items-center px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 shadow-sm transition-colors text-sm">
             <Download size={16} className="mr-2" /> PDF
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-[#111827] text-white rounded-lg hover:bg-slate-800 shadow-sm transition-colors text-sm"
          >
             <Printer size={16} className="mr-2" /> Print
          </button>
        </div>
      </div>

      {/* Invoice Card based on provided HTML structure */}
      <div className="invoice-wrap max-w-[900px] mx-auto bg-white p-7 rounded-[10px] shadow-[0_6px_18px_rgba(16,24,40,0.06)] relative overflow-hidden">
        
        {/* Status Badge Ribbon */}
        {document.status === 'Paid' && (
           <div className="absolute top-0 right-0 p-4">
              <div className="transform rotate-0 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 uppercase tracking-wide">
                 PAID
              </div>
           </div>
        )}

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start gap-5">
          <div>
            <div className="font-bold text-[20px] text-[#0f172a] uppercase tracking-wide">{orgProfile.name}</div>
            <div className="font-medium text-[13px] mt-1.5 text-[#111827]">{orgProfile.address.phone}</div>
            <div className="font-normal text-[13px] mt-1.5 text-[#374151]">{orgProfile.primaryContact.email}</div>
            <div className="mt-2.5 text-[13px] text-[#374151] leading-relaxed whitespace-pre-line">
              {orgProfile.address.street1}, {orgProfile.address.street2}
              {'\n'}{orgProfile.address.city}, {orgProfile.address.state} - {orgProfile.address.pincode}
              {'\n'}{orgProfile.address.country}
            </div>
          </div>

          <div className="text-right sm:text-right text-[14px] text-[#374151]">
            <div className="font-semibold text-[#111827] text-[18px] capitalize flex items-center justify-end gap-3">
               {title}
               <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusBadge(document.status)}`}>
                  {document.status}
               </span>
            </div>
            <div className="mt-2.5 space-y-1">
              <div><strong>{title} #:</strong> <span className="ml-1">{document.number}</span></div>
              <div><strong>Ref ID:</strong> <span className="ml-1">{entity.id.toString().padStart(6, '0')}</span></div>
              <div><strong>Date:</strong> <span className="ml-1">{document.date}</span></div>
              <div><strong>Due Date:</strong> <span className="ml-1">{document.due_date}</span></div>
            </div>
          </div>
        </header>

        {/* Addresses */}
        <div className="flex flex-col sm:flex-row gap-6 mt-[18px] pt-6 border-t border-[#e6e9ee]">
          <div className="flex-1 text-[14px] text-[#374151] leading-[1.45]">
            <div className="font-bold text-[#111827] mb-1.5">{isVendorDoc ? 'From' : 'Bill To'}</div>
            <div className="text-[#111827] font-medium">{entity.name}</div>
            <div>{entity.phone}</div>
            <div className="mt-2 text-[#6b7280] whitespace-pre-line">{entity.address || '—'}</div>
          </div>

          <div className="flex-1 text-left sm:text-right text-[14px] text-[#374151] leading-[1.45]">
            <div className="font-bold text-[#111827] mb-1.5">{isVendorDoc ? 'Bill To' : 'From'}</div>
            <div className="text-[#111827] font-medium">{orgProfile.name}</div>
            <div>{orgProfile.primaryContact.email}</div>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full border-collapse mt-[18px]">
          <thead>
            <tr>
              <th className="bg-[#f8fafc] text-[#111827] font-semibold p-3 border-b border-[#e6e9ee] text-left text-[14px] w-[48%]">Description</th>
              <th className="bg-[#f8fafc] text-[#111827] font-semibold p-3 border-b border-[#e6e9ee] text-left text-[14px] w-[16%]">Unit Cost</th>
              <th className="bg-[#f8fafc] text-[#111827] font-semibold p-3 border-b border-[#e6e9ee] text-left text-[14px] w-[12%]">Qty</th>
              <th className="bg-[#f8fafc] text-[#111827] font-semibold p-3 border-b border-[#e6e9ee] text-right text-[14px] w-[24%]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {document.items.map((item, idx) => {
              const amount = item.unit_cost * item.qty;
              return (
                <tr key={idx}>
                  <td className="p-3 border-b border-[#e6e9ee] text-[14px] text-[#374151]">{item.description}</td>
                  <td className="p-3 border-b border-[#e6e9ee] text-[14px] text-[#374151]">{formatCurrency(item.unit_cost)}</td>
                  <td className="p-3 border-b border-[#e6e9ee] text-[14px] text-[#374151]">{item.qty}</td>
                  <td className="p-3 border-b border-[#e6e9ee] text-[14px] text-[#111827] font-medium text-right">{formatCurrency(amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="w-full sm:w-[320px] ml-auto mt-[18px]">
          <div className="flex justify-between p-2 text-[15px] text-[#374151]">
            <div>Sub Total</div>
            <div>{formatCurrency(document.subtotal)}</div>
          </div>
          <div className="flex justify-between p-2 text-[15px] text-[#374151]">
            <div>Tax (GST)</div>
            <div>{formatCurrency(document.gst_total)}</div>
          </div>
          {document.deposit && document.deposit > 0 && (
             <div className="flex justify-between p-2 text-[15px] text-[#374151]">
              <div>Deposit</div>
              <div>{formatCurrency(document.deposit)}</div>
            </div>
          )}
          <div className="flex justify-between p-3 mt-1.5 border-t-2 border-[#e6e9ee] text-[17px] font-bold text-[#111827]">
            <div>Balance Due</div>
            <div>{formatCurrency(document.total - (document.deposit || 0))}</div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-7 text-[13px] text-[#475569]">
          <strong>Notes:</strong> {document.notes || '________'}<br/>
          Thank you for your business!
        </div>

        {/* Signature */}
        <div className="mt-7 flex justify-between items-center gap-5 pt-8">
          <div className="flex-1 text-center py-5 border border-dashed border-[#e6e9ee] rounded-lg text-[#374151] text-sm">
            AUTHORIZED SIGNATURE
          </div>
          <div className="flex-[0_0_220px] text-right">
            <div className="text-[12px] text-[#6b7280]">Prepared by</div>
            <div className="font-bold text-[#111827] text-lg">{orgProfile.name}</div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default InvoiceView;