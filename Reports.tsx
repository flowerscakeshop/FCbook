
import React, { useState, useEffect } from 'react';
import { DocumentType, Customer, Vendor, Product, AccountingDocument } from '../../types';
import { 
  Plus, Trash, Settings, X, Search, ChevronDown, 
  ScanLine, MoreHorizontal, Image, HelpCircle, Upload, Paperclip,
  Save, RefreshCw
} from 'lucide-react';

interface DocumentFormProps {
  type: DocumentType;
  onCancel: () => void;
  onSave: (doc: AccountingDocument) => void;
  customers: Customer[];
  vendors: Vendor[];
  products: Product[];
}

const DocumentForm: React.FC<DocumentFormProps> = ({ type, onCancel, onSave, customers, vendors, products }) => {
  const isVendorDoc = type === 'bill' || type === 'purchase_order';
  const entityLabel = isVendorDoc ? 'Vendor' : 'Customer';
  const entities = isVendorDoc ? vendors : customers;
  const typeLabel = type === 'purchase_order' ? 'Purchase Order' : type.charAt(0).toUpperCase() + type.slice(1);

  // Generate random ID for new doc
  const generateDocNumber = () => {
      const prefix = type === 'invoice' ? 'INV' : type === 'estimate' ? 'EST' : type === 'bill' ? 'BILL' : 'PO';
      return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // Form State
  const [entityId, setEntityId] = useState('');
  const [docNumber, setDocNumber] = useState(generateDocNumber());
  const [orderNumber, setOrderNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [terms, setTerms] = useState('Due on Receipt');
  const [subject, setSubject] = useState('');
  
  const [items, setItems] = useState([
    { id: 1, description: '', qty: 1.00, unit_cost: 0.00, discount: 0, discount_type: 'percent' as 'percent' | 'amount', gst: 0 }
  ]);

  const [customerNotes, setCustomerNotes] = useState('Thank you for the payment. You just made our day.');
  const [termsConditions, setTermsConditions] = useState('');
  const [adjustment, setAdjustment] = useState(0);
  const [tds, setTds] = useState(0);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', qty: 1.00, unit_cost: 0.00, discount: 0, discount_type: 'percent', gst: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleProductSelect = (itemId: number, sku: string) => {
    const product = products.find(p => p.sku === sku);
    if (product) {
       setItems(items.map(item => {
         if (item.id === itemId) {
           return {
             ...item,
             description: product.name,
             unit_cost: isVendorDoc ? (product.cost || 0) : (product.price || 0),
             gst: 0 
           }
         }
         return item;
       }))
    }
  }

  // Calculations
  const calculateTotals = () => {
    let subtotal = 0;
    
    items.forEach(item => {
      let itemAmount = item.qty * item.unit_cost;
      
      // Apply discount
      if (item.discount > 0) {
        if (item.discount_type === 'percent') {
          itemAmount -= itemAmount * (item.discount / 100);
        } else {
          itemAmount -= item.discount;
        }
      }
      
      subtotal += itemAmount;
    });

    // GST is typically calculated on the taxable value (subtotal in simple terms here)
    // For this mock, we'll assume a flat GST calculation based on item GST% for display
    // or just sum the line item tax. Let's do simple sum of line amounts for subtotal.
    
    const total = subtotal + adjustment - tds; // Simplified Tax logic for UI demo

    return { subtotal, total };
  };

  const { subtotal, total } = calculateTotals();

  const handleSave = () => {
    const selectedEntity = entities.find(e => e.id.toString() === entityId);
    if (!selectedEntity) {
      alert(`Please select a ${entityLabel}`);
      return;
    }

    const newDoc: AccountingDocument = {
      id: Date.now().toString(),
      type,
      number: docNumber,
      order_number: orderNumber,
      related_entity_id: selectedEntity.id,
      related_entity_name: selectedEntity.name,
      date,
      due_date: dueDate,
      terms,
      subject,
      items: items.map(i => ({
        description: i.description,
        qty: i.qty,
        unit_cost: i.unit_cost,
        discount: i.discount,
        discount_type: i.discount_type,
        gst_percent: i.gst
      })),
      subtotal,
      gst_total: 0, // Simplified
      adjustment,
      total,
      status: 'Unpaid',
      notes: customerNotes,
      terms_conditions: termsConditions
    };

    onSave(newDoc);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex flex-col font-sans">
      {/* Header */}
      <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-semibold text-slate-800">New {typeLabel}</h1>
        </div>
        <div className="flex items-center gap-4">
           <button className="text-slate-400 hover:text-slate-600"><Settings size={20}/></button>
           <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-[1200px] mx-auto w-full">
        
        {/* Top Form Section */}
        <div className="space-y-6 mb-8">
           {/* Customer Name */}
           <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 sm:items-start">
              <label className="sm:w-32 pt-2 text-sm font-medium text-red-500">{entityLabel} Name*</label>
              <div className="flex-1 max-w-lg">
                 <div className="relative flex">
                    <select 
                      className="w-full border border-blue-400 rounded-l-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 bg-white appearance-none"
                      value={entityId}
                      onChange={(e) => setEntityId(e.target.value)}
                    >
                       <option value="">Select or add a {entityLabel.toLowerCase()}</option>
                       {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 rounded-r-md flex items-center justify-center">
                       <Search size={16} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Invoice Info Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-red-500 mb-1">{typeLabel}#*</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         value={docNumber} 
                         onChange={e => setDocNumber(e.target.value)}
                         className="w-full border border-slate-300 rounded-md px-3 py-2 pr-8 outline-none focus:border-blue-500"
                       />
                       <Settings size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Order Number</label>
                    <input 
                      type="text" 
                      value={orderNumber} 
                      onChange={e => setOrderNumber(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-red-500 mb-1">{typeLabel} Date*</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={e => setDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                    />
                 </div>
                 <div className="flex gap-2">
                    <div className="flex-1">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Terms</label>
                       <select 
                         value={terms} 
                         onChange={e => setTerms(e.target.value)}
                         className="w-full border border-slate-300 rounded-md px-2 py-2 text-sm outline-none focus:border-blue-500"
                       >
                          <option>Due on Receipt</option>
                          <option>Net 15</option>
                          <option>Net 30</option>
                          <option>Custom</option>
                       </select>
                    </div>
                    <div className="flex-1">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                       <input 
                         type="date" 
                         value={dueDate} 
                         onChange={e => setDueDate(e.target.value)}
                         className="w-full border border-slate-300 border-dashed rounded-md px-2 py-2 text-sm outline-none focus:border-blue-500 text-slate-500"
                       />
                    </div>
                 </div>
              </div>
           </div>

           {/* Subject */}
           <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-center">
              <label className="sm:w-32 text-sm font-medium text-slate-700 flex items-center">Subject <HelpCircle size={12} className="ml-1 text-slate-400"/></label>
              <div className="flex-1 max-w-2xl">
                 <input 
                   type="text" 
                   placeholder={`Let your ${entityLabel.toLowerCase()} know what this ${typeLabel.toLowerCase()} is for`}
                   value={subject}
                   onChange={e => setSubject(e.target.value)}
                   className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                 />
              </div>
           </div>
        </div>

        {/* Item Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
           <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-700">Item Table</h3>
              <div className="flex gap-4 text-blue-600 text-sm font-medium">
                 <button className="flex items-center hover:underline"><ScanLine size={14} className="mr-1"/> Scan Item</button>
                 <button className="flex items-center hover:underline"><MoreHorizontal size={14} className="mr-1"/> Bulk Actions</button>
              </div>
           </div>
           
           <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wide">
                    <th className="px-4 py-3 w-[40%]">Item Details</th>
                    <th className="px-4 py-3 w-[15%] text-right">Quantity</th>
                    <th className="px-4 py-3 w-[15%] text-right">Rate</th>
                    <th className="px-4 py-3 w-[15%] text-right">Discount</th>
                    <th className="px-4 py-3 w-[10%] text-right">Amount</th>
                    <th className="px-4 py-3 w-[5%]"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50">
                       <td className="px-4 py-3 align-top">
                          <div className="flex gap-3">
                             <div className="w-10 h-10 border border-slate-200 rounded bg-slate-50 flex items-center justify-center text-slate-300 flex-shrink-0">
                                <Image size={20} />
                             </div>
                             <div className="flex-1 space-y-1">
                                <input 
                                  type="text" 
                                  placeholder="Type or click to select an item." 
                                  value={item.description}
                                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                                  className="w-full border border-transparent hover:border-slate-300 focus:border-blue-500 rounded px-2 py-1 text-sm outline-none bg-transparent"
                                />
                                {item.description && (
                                   <div className="text-xs text-blue-600 px-2 cursor-pointer hover:underline">Show details</div>
                                )}
                                {/* Quick Select Helper */}
                                <div className="hidden group-hover:flex gap-2 px-2 flex-wrap">
                                   {products.slice(0, 3).map(p => (
                                      <button key={p.sku} onClick={() => handleProductSelect(item.id, p.sku)} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 hover:bg-blue-100">
                                         {p.name}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-4 py-3 align-top">
                          <input 
                            type="number" 
                            value={item.qty.toFixed(2)} 
                            onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value))}
                            className="w-full text-right border border-transparent hover:border-slate-300 focus:border-blue-500 rounded px-2 py-1 text-sm outline-none bg-transparent"
                          />
                       </td>
                       <td className="px-4 py-3 align-top">
                          <input 
                            type="number" 
                            value={item.unit_cost.toFixed(2)} 
                            onChange={e => updateItem(item.id, 'unit_cost', parseFloat(e.target.value))}
                            className="w-full text-right border border-transparent hover:border-slate-300 focus:border-blue-500 rounded px-2 py-1 text-sm outline-none bg-transparent"
                          />
                       </td>
                       <td className="px-4 py-3 align-top">
                          <div className="flex items-center justify-end gap-1 group/disc">
                             <input 
                               type="number" 
                               value={item.discount} 
                               onChange={e => updateItem(item.id, 'discount', parseFloat(e.target.value))}
                               className="w-16 text-right border border-transparent hover:border-slate-300 focus:border-blue-500 rounded px-2 py-1 text-sm outline-none bg-transparent"
                             />
                             <div className="hidden group-hover/disc:flex text-[10px] border border-slate-300 rounded overflow-hidden">
                                <button 
                                   onClick={() => updateItem(item.id, 'discount_type', 'percent')}
                                   className={`px-1 ${item.discount_type === 'percent' ? 'bg-slate-200' : 'bg-white'}`}>%</button>
                                <button 
                                   onClick={() => updateItem(item.id, 'discount_type', 'amount')}
                                   className={`px-1 ${item.discount_type === 'amount' ? 'bg-slate-200' : 'bg-white'}`}>-</button>
                             </div>
                             {items.length === 1 && <span className="text-sm text-slate-400 ml-1">%</span>}
                          </div>
                       </td>
                       <td className="px-4 py-3 align-top text-right font-bold text-slate-800 text-sm">
                          {((item.qty * item.unit_cost) - (item.discount_type === 'percent' ? (item.qty * item.unit_cost * item.discount/100) : item.discount)).toFixed(2)}
                       </td>
                       <td className="px-4 py-3 align-top text-center">
                          <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                             <X size={16} />
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           
           <div className="px-4 py-3 bg-white border-t border-slate-100 flex gap-4">
              <button onClick={addItem} className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                 <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center mr-2 text-[10px] font-bold">+</div>
                 Add New Row
              </button>
              <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                 <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center mr-2 text-[10px] font-bold">+</div>
                 Add Items in Bulk
              </button>
           </div>
        </div>

        {/* Footer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Left Column: Notes */}
           <div className="space-y-6">
              <div>
                 <label className="block text-sm font-medium text-slate-800 mb-2">Customer Notes</label>
                 <textarea 
                   rows={3} 
                   value={customerNotes}
                   onChange={e => setCustomerNotes(e.target.value)}
                   className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 text-slate-600 resize-none"
                   placeholder="Will be displayed on the invoice"
                 />
                 <p className="text-xs text-slate-400 mt-1">Will be displayed on the invoice</p>
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-slate-800 mb-2">Terms & Conditions</label>
                 <textarea 
                   rows={3} 
                   value={termsConditions}
                   onChange={e => setTermsConditions(e.target.value)}
                   className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 text-slate-600 resize-none"
                   placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                 />
              </div>
           </div>

           {/* Right Column: Totals */}
           <div className="bg-slate-50/50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between text-sm font-medium text-slate-700">
                 <span>Sub Total</span>
                 <span>{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <input type="radio" name="tax_type" id="tds" className="text-blue-600 focus:ring-blue-500"/>
                       <label htmlFor="tds" className="text-slate-600">TDS</label>
                    </div>
                    <div className="flex items-center gap-2">
                       <input type="radio" name="tax_type" id="tcs" className="text-blue-600 focus:ring-blue-500"/>
                       <label htmlFor="tcs" className="text-slate-600">TCS</label>
                    </div>
                    <select className="border border-slate-300 rounded text-xs py-1 px-2 text-slate-500 outline-none">
                       <option>Select a Tax</option>
                    </select>
                 </div>
                 <span className="text-slate-500">- 0.00</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                    <span className="border border-dashed border-slate-300 rounded px-2 py-1 bg-white text-slate-600 cursor-text min-w-[80px]">Adjustment</span>
                    <input 
                      type="number" 
                      value={adjustment}
                      onChange={e => setAdjustment(parseFloat(e.target.value) || 0)}
                      className="w-24 border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-right"
                    />
                    <HelpCircle size={14} className="text-slate-400"/>
                 </div>
                 <span className="text-slate-700">{adjustment.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm text-slate-700">
                 <span>Round Off</span>
                 <span>0.00</span>
              </div>

              <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                 <span className="font-bold text-slate-900 text-base">Total ( ₹ )</span>
                 <span className="font-bold text-slate-900 text-base">{total.toFixed(2)}</span>
              </div>
           </div>
        </div>

        {/* Attach Files */}
        <div className="mt-8 border-t border-slate-100 pt-6">
           <div className="flex items-start gap-4">
              <div className="flex-1">
                 <div className="relative inline-block group">
                    <button className="flex items-center gap-2 border border-slate-300 border-dashed rounded px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-400">
                       <Upload size={16} />
                       Upload File
                       <ChevronDown size={14} />
                    </button>
                    <p className="text-xs text-slate-400 mt-1">You can upload a maximum of 10 files, 10MB each</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="border-t border-slate-200 px-6 py-4 bg-white flex justify-between items-center sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
               Save as Draft
            </button>
            <div className="flex items-center">
               <button 
                 onClick={handleSave}
                 className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-l-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
               >
                  Save and Send
               </button>
               <button className="px-2 py-2 bg-green-600 border-l border-green-700 text-white rounded-r-md hover:bg-green-700">
                  <ChevronDown size={16} />
               </button>
            </div>
            <button 
               onClick={onCancel}
               className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 ml-2"
            >
               Cancel
            </button>
         </div>
         
         <div className="flex items-center gap-6">
            <button className="flex items-center text-blue-600 text-sm hover:underline">
               <RefreshCw size={14} className="mr-1"/> Make Recurring
            </button>
            <div className="text-right">
               <div className="text-xs text-slate-500">Total Amount: <span className="font-semibold text-slate-900">₹ {total.toFixed(2)}</span></div>
               <div className="text-[10px] text-slate-400">Total Quantity: {items.reduce((acc, i) => acc + i.qty, 0).toFixed(0)}</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DocumentForm;
