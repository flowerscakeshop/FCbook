import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Download, Trash2, CreditCard } from 'lucide-react';
import { UserRole, DocumentType, AccountingDocument } from '../../types';

interface DocumentListProps {
  type: DocumentType;
  documents: AccountingDocument[];
  onView: (id: string) => void;
  onRecordPayment?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate: () => void;
  role: UserRole;
}

const DocumentList: React.FC<DocumentListProps> = ({ type, documents, onView, onRecordPayment, onDelete, onCreate, role }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const typeLabel = type.replace('_', ' ');

  const filteredData = documents.filter(doc => {
    const isType = doc.type === type;
    const matchesFilter = filter === 'All' || doc.status === filter;
    const matchesSearch = doc.related_entity_name.toLowerCase().includes(search.toLowerCase()) || doc.number.toLowerCase().includes(search.toLowerCase());
    return isType && matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Unpaid': case 'Sent': return 'bg-blue-100 text-blue-700';
      case 'Overdue': case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Draft': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 capitalize">{typeLabel}s</h1>
        {role === 'admin' && (
          <button onClick={onCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={20} className="mr-2" />
            Create {typeLabel}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder={`Search by name or ${type} #...`} 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-500" />
            <select 
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">{typeLabel} #</th>
                <th className="px-6 py-4">Party</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Due Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{doc.number}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{doc.related_entity_name}</div>
                  </td>
                  <td className="px-6 py-4">{doc.date}</td>
                  <td className="px-6 py-4 text-slate-500">{doc.due_date}</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    ₹{(doc.total - (doc.deposit || 0)).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => onView(doc.id)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded" 
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      {role === 'admin' && onRecordPayment && (doc.status !== 'Paid') && (doc.type === 'invoice' || doc.type === 'bill') && (
                        <button 
                          onClick={() => onRecordPayment(doc.id)}
                          className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded" 
                          title="Record Payment"
                        >
                          <CreditCard size={18} />
                        </button>
                      )}
                      <button className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-100 rounded" title="Download PDF">
                        <Download size={18} />
                      </button>
                      {role === 'admin' && onDelete && (
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this document?')) {
                              onDelete(doc.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No {typeLabel}s found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentList;