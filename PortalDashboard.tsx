import React, { useState, useEffect } from 'react';
import { UserRole, Location, Role, User, OrganizationProfile } from '../../types';
import { MOCK_LOCATIONS, MOCK_ROLES } from '../../constants';
import { 
  Building2, Users, Settings as SettingsIcon, ShoppingCart, ShoppingBag, 
  Grid, UserCog, Upload, Plus, Star, MoreHorizontal, Copy, Trash2, 
  UserPlus, Check, CreditCard, Bell, Webhook, PieChart,
  ArrowLeft, Save, Clock, Palette, Monitor, Mail, Globe,
  ShieldCheck, Landmark, Receipt, FileText, Layout,
  Smartphone, Lock, Shield
} from 'lucide-react';

interface SettingsProps {
  role: UserRole;
  initialTab?: string;
  orgProfile: OrganizationProfile;
  onUpdateProfile: (profile: OrganizationProfile) => void;
}

// --- Icons Mapping ---
const SidebarIcons: any = {
  org: Building2,
  users: Users,
  modules: SettingsIcon,
  finance: Landmark,
  integrations: Grid,
  dev: UserCog,
  compliance: ShieldCheck
};

// --- Mock Data ---
const MOCK_USERS_LIST: User[] = [
  { id: 1, name: 'ashwin', email: 'ashwin@flowerscake.rf.gd', role: 'Admin', status: 'Active', phone: '9994999385' },
  { id: 2, name: 'flowers cake', email: 'admin@flowerscake.rf.gd', role: 'Admin', status: 'Active', phone: '9000000000' },
  { id: 3, name: 'Poomozhi', email: 'b.poomozhi@gmail.com', role: 'Admin', status: 'Inactive', phone: '9888888888' },
];

const INITIAL_CURRENCIES = [
  { id: 1, name: 'Indian Rupee (Base)', code: 'INR', symbol: '₹', isBase: true }
];

const SettingsPage: React.FC<SettingsProps> = ({ role, initialTab, orgProfile: initialOrgProfile, onUpdateProfile }) => {
  const [activeCategory, setActiveCategory] = useState('Organization');
  const [activePage, setActivePage] = useState('Profile');
  
  // --- View Mode State to handle Add Forms ---
  const [viewMode, setViewMode] = useState<'list' | 'add_location' | 'add_currency' | 'invite_user' | 'add_role'>('list');

  // Local state for profile edits
  const [localOrgProfile, setLocalOrgProfile] = useState<OrganizationProfile>(initialOrgProfile);
  
  useEffect(() => {
    setLocalOrgProfile(initialOrgProfile);
  }, [initialOrgProfile]);

  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS_LIST);
  const [currencies, setCurrencies] = useState(INITIAL_CURRENCIES);

  // Temporary Form States
  const [newLocation, setNewLocation] = useState<Partial<Location>>({ type: 'Business', isPrimary: false });
  const [newCurrency, setNewCurrency] = useState({ name: '', code: '', symbol: '' });
  const [newUser, setNewUser] = useState<Partial<User>>({ status: 'Invited', role: 'Staff' });
  const [newRole, setNewRole] = useState<Partial<Role>>({ isSystem: false });

  const [brandingColor, setBrandingColor] = useState('green');
  const [brandingTheme, setBrandingTheme] = useState('light');

  // Subscription State
  const [billing, setBilling] = useState<'monthly'|'yearly'>('yearly');
  
  // Preferences State
  const [preferences, setPreferences] = useState({
    emailInvoice: true,
    emailPayment: true,
    desktopNotif: false,
    sound: true
  });

  // Module Settings State
  const [moduleSettings, setModuleSettings] = useState({
    inventoryTrack: true,
    lowStockAlert: true,
    salesShipping: true,
    salesTerms: 'Net 30',
    purchaseApproval: false,
    purchaseTerms: 'Due on Receipt'
  });

  // Handle deep linking via initialTab
  useEffect(() => {
    if (initialTab === 'subscription') {
      setActiveCategory('Organization');
      setActivePage('Manage Subscription');
    }
  }, [initialTab]);

  // Reset view mode when page changes
  useEffect(() => {
    setViewMode('list');
    // Reset forms
    setNewLocation({ type: 'Business', isPrimary: false });
    setNewCurrency({ name: '', code: '', symbol: '' });
    setNewUser({ status: 'Invited', role: 'Staff' });
    setNewRole({ isSystem: false });
  }, [activePage, activeCategory]);

  const categories = [
    { name: 'Organization', icon: SidebarIcons.org, pages: ['Profile', 'Branding', 'Locations', 'Currencies', 'Subscription'] },
    { name: 'Users & Roles', icon: SidebarIcons.users, pages: ['Users', 'Roles', 'Security Preferences'] },
    { name: 'Financials', icon: SidebarIcons.finance, pages: ['Taxes & GST', 'Bank Accounts', 'Chart of Accounts'] },
    { name: 'Module Settings', icon: SidebarIcons.modules, pages: ['Invoices', 'Estimates', 'Bills & Expenses', 'Inventory'] },
    { name: 'Integrations', icon: SidebarIcons.integrations, pages: ['FC Apps', 'Webhooks', 'API Keys'] },
  ];

  const handleUpdateProfileLocal = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setLocalOrgProfile(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setLocalOrgProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveToFirestore = () => {
    onUpdateProfile(localOrgProfile);
    alert('Organization profile updated successfully');
  };

  const handleSaveLocation = () => {
    if (!newLocation.name) return;
    setLocations([...locations, { 
      id: Date.now(), 
      name: newLocation.name || '',
      address: newLocation.address || '',
      type: newLocation.type as 'Business' | 'Warehouse',
      isPrimary: false,
      transactionSeries: newLocation.transactionSeries || 'Default'
    }]);
    setViewMode('list');
    setNewLocation({ type: 'Business', isPrimary: false });
  };

  const handleSaveCurrency = () => {
    if (!newCurrency.name || !newCurrency.code) return;
    setCurrencies([...currencies, {
      id: Date.now(),
      name: newCurrency.name,
      code: newCurrency.code.toUpperCase(),
      symbol: newCurrency.symbol,
      isBase: false
    }]);
    setViewMode('list');
    setNewCurrency({ name: '', code: '', symbol: '' });
  };

  const handleInviteUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, {
      id: Date.now(),
      name: newUser.name || '',
      email: newUser.email || '',
      phone: newUser.phone || '',
      role: newUser.role || 'Staff',
      status: 'Invited'
    }]);
    setViewMode('list');
    setNewUser({ status: 'Invited', role: 'Staff' });
  };

  const handleSaveRole = () => {
    if (!newRole.name) return;
    setRoles([...roles, {
      id: Date.now(),
      name: newRole.name || '',
      description: newRole.description || '',
      isSystem: false
    }]);
    setViewMode('list');
    setNewRole({ isSystem: false });
  };

  const inputClass = "w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none";

  // --- Render Components ---

  const renderProfile = () => (
    <div className="animate-fade-in max-w-4xl pb-20">
       <div className="space-y-8">
         <div className="border-b border-slate-200 pb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Organization Profile</h3>
            <div className="flex items-center gap-6">
               <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors overflow-hidden">
                  {localOrgProfile.logo ? (
                    <img src={localOrgProfile.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <>
                      <Upload size={24} className="mb-2" />
                      <span className="text-xs">Upload Logo</span>
                    </>
                  )}
               </div>
               <div className="text-sm text-slate-500 max-w-xs">
                  <p className="font-semibold text-slate-700 mb-1">Organization Logo</p>
                  This will appear on your invoices, receipts and portal.
                  <p className="mt-2 text-xs">Recommended: 400x400px, PNG or JPG (Max 1MB)</p>
               </div>
            </div>
         </div>

         <div className="grid gap-10">
            {/* Basic Info */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name*</label>
                  <input type="text" className={inputClass} value={localOrgProfile.name} onChange={e => handleUpdateProfileLocal('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                  <select className={inputClass} value={localOrgProfile.industry} onChange={e => handleUpdateProfileLocal('industry', e.target.value)}>
                    <option>Food Services</option>
                    <option>Retail</option>
                    <option>Technology</option>
                    <option>Manufacturing</option>
                    <option>Consulting</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID / GSTIN</label>
                  <input type="text" className={inputClass} value={localOrgProfile.taxId} onChange={e => handleUpdateProfileLocal('taxId', e.target.value)} placeholder="Enter GSTIN" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                  <input type="url" className={inputClass} value={localOrgProfile.address.website} onChange={e => handleUpdateProfileLocal('address.website', e.target.value)} placeholder="https://example.com" />
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Business Address</h4>
              <div className="space-y-4">
                <input type="text" placeholder="Street Address line 1" className={inputClass} value={localOrgProfile.address.street1} onChange={e => handleUpdateProfileLocal('address.street1', e.target.value)} />
                <input type="text" placeholder="Street Address line 2" className={inputClass} value={localOrgProfile.address.street2} onChange={e => handleUpdateProfileLocal('address.street2', e.target.value)} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input type="text" placeholder="City" className={inputClass} value={localOrgProfile.address.city} onChange={e => handleUpdateProfileLocal('address.city', e.target.value)} />
                  <input type="text" placeholder="State" className={inputClass} value={localOrgProfile.address.state} onChange={e => handleUpdateProfileLocal('address.state', e.target.value)} />
                  <input type="text" placeholder="Pincode" className={inputClass} value={localOrgProfile.address.pincode} onChange={e => handleUpdateProfileLocal('address.pincode', e.target.value)} />
                  <select className={inputClass} value={localOrgProfile.location} onChange={e => handleUpdateProfileLocal('location', e.target.value)}>
                    <option>India</option>
                    <option>USA</option>
                    <option>UAE</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Primary Contact */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Primary Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                  <input type="text" className={inputClass} value={localOrgProfile.primaryContact?.name} onChange={e => handleUpdateProfileLocal('primaryContact.name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                  <input type="email" className={inputClass} value={localOrgProfile.primaryContact?.email} onChange={e => handleUpdateProfileLocal('primaryContact.email', e.target.value)} />
                </div>
              </div>
            </section>

            {/* Regional Settings */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Regional Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fiscal Year</label>
                  <select className={inputClass} value={localOrgProfile.fiscalYear} onChange={e => handleUpdateProfileLocal('fiscalYear', e.target.value)}>
                    <option>April - March</option>
                    <option>January - December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date Format</label>
                  <select className={inputClass} value={localOrgProfile.dateFormat} onChange={e => handleUpdateProfileLocal('dateFormat', e.target.value)}>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time Zone</label>
                  <select className={inputClass} value={localOrgProfile.timeZone} onChange={e => handleUpdateProfileLocal('timeZone', e.target.value)}>
                    <option value="(GMT+05:30) IST">(GMT+05:30) IST</option>
                    <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                  </select>
                </div>
              </div>
            </section>
         </div>
         
         <div className="pt-10 border-t border-slate-200 sticky bottom-0 bg-slate-50 pb-4">
             <button onClick={handleSaveToFirestore} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 flex items-center gap-2">
                <Save size={20}/> Save Changes
             </button>
         </div>
       </div>
    </div>
  );

  const renderBranding = () => (
    <div className="animate-fade-in max-w-4xl space-y-12">
       <div className="border-b border-slate-200 pb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
             <Layout size={24} className="text-blue-500"/> Site Branding
          </h3>
          <p className="text-slate-500 text-sm mb-8">Customize how your application and client portal look to others.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Theme */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Interface Theme</label>
              <div className="flex gap-6">
                <button 
                    onClick={() => setBrandingTheme('light')}
                    className={`relative w-40 h-28 border-2 rounded-xl overflow-hidden transition-all ${brandingTheme === 'light' ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-200 hover:border-slate-400'}`}
                >
                    <div className="absolute inset-0 bg-white flex flex-col p-2">
                      <div className="w-full h-3 bg-slate-100 rounded mb-1"></div>
                      <div className="w-2/3 h-2 bg-slate-100 rounded"></div>
                    </div>
                    {brandingTheme === 'light' && <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1"><Check size={12} strokeWidth={3}/></div>}
                    <div className="absolute bottom-0 w-full bg-slate-50 py-1 text-center text-xs font-bold text-slate-600 uppercase">Light</div>
                </button>
                
                <button 
                    onClick={() => setBrandingTheme('dark')}
                    className={`relative w-40 h-28 border-2 rounded-xl overflow-hidden transition-all ${brandingTheme === 'dark' ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-200 hover:border-slate-400'}`}
                >
                    <div className="absolute inset-0 bg-slate-900 flex flex-col p-2">
                      <div className="w-full h-3 bg-slate-800 rounded mb-1"></div>
                      <div className="w-2/3 h-2 bg-slate-800 rounded"></div>
                    </div>
                    {brandingTheme === 'dark' && <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1"><Check size={12} strokeWidth={3}/></div>}
                    <div className="absolute bottom-0 w-full bg-slate-800 py-1 text-center text-xs font-bold text-slate-400 uppercase">Dark</div>
                </button>
              </div>
            </div>

            {/* Accent */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Accent Color</label>
              <div className="grid grid-cols-4 gap-4">
                {[
                    { id: 'blue', color: '#1d4ed8', label: 'Indigo' },
                    { id: 'green', color: '#059669', label: 'Emerald' },
                    { id: 'red', color: '#dc2626', label: 'Ruby' },
                    { id: 'purple', color: '#7c3aed', label: 'Violet' },
                ].map(item => (
                   <button
                      key={item.id}
                      onClick={() => setBrandingColor(item.id)}
                      className={`h-12 w-full rounded-lg transition-all flex items-center justify-center border-2 ${brandingColor === item.id ? 'border-slate-800 ring-2 ring-offset-2 ring-slate-400' : 'border-transparent'}`}
                      style={{ backgroundColor: item.color }}
                   >
                      {brandingColor === item.id && <Check className="text-white" size={20} strokeWidth={3} />}
                   </button>
                ))}
              </div>
            </div>
          </div>
       </div>

       <div>
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Smartphone size={20} className="text-slate-400"/> Portal Customization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600" defaultChecked />
                  <span className="text-sm font-medium text-slate-700">Display Organization Name as Header</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600" defaultChecked />
                  <span className="text-sm font-medium text-slate-700">Show Contact Information on Footer</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Allow customers to update their profile</span>
               </label>
            </div>
          </div>
       </div>
    </div>
  );

  const renderLocations = () => {
    if (viewMode === 'add_location') {
      return (
        <div className="animate-fade-in max-w-2xl">
           <div className="flex items-center justify-between mb-6">
              <button onClick={() => setViewMode('list')} className="flex items-center text-slate-500 hover:text-slate-800">
                <ArrowLeft size={18} className="mr-2" /> Back to Locations
              </button>
              <h2 className="text-xl font-bold text-slate-900">Add Location</h2>
           </div>
           <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Location Name*</label>
                 <input type="text" className={inputClass} value={newLocation.name || ''} onChange={e => setNewLocation({...newLocation, name: e.target.value})} placeholder="e.g. Branch Office" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                 <textarea rows={3} className={inputClass} value={newLocation.address || ''} onChange={e => setNewLocation({...newLocation, address: e.target.value})} placeholder="Street, City, State, Country" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select className={inputClass} value={newLocation.type} onChange={e => setNewLocation({...newLocation, type: e.target.value as any})}>
                       <option value="Business">Business</option>
                       <option value="Warehouse">Warehouse</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Series</label>
                    <input type="text" className={inputClass} value={newLocation.transactionSeries || ''} onChange={e => setNewLocation({...newLocation, transactionSeries: e.target.value})} placeholder="e.g. BR-INV-" />
                 </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                 <button onClick={() => setViewMode('list')} className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50">Cancel</button>
                 <button onClick={handleSaveLocation} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                    <Save size={16} className="mr-2"/> Save Location
                 </button>
              </div>
           </div>
        </div>
      );
    }
    return (
      <div className="animate-fade-in w-full">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Locations</h2>
            <div className="flex gap-3">
               <button className="text-blue-600 text-sm hover:underline">Transaction Series Preferences</button>
               <button onClick={() => setViewMode('add_location')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors flex items-center">
                  <Plus size={16} className="mr-2"/> Add Location
               </button>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs">
                  <tr>
                     <th className="px-6 py-3 border-b">Location</th>
                     <th className="px-6 py-3 border-b">Default Transaction Number Series</th>
                     <th className="px-6 py-3 border-b">Type</th>
                     <th className="px-6 py-3 border-b">Address Details</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {locations.map(loc => (
                     <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <span className="font-medium text-blue-600 hover:underline cursor-pointer">{loc.name}</span>
                              {loc.isPrimary && <Star size={14} className="text-yellow-400 fill-current" />}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{loc.transactionSeries || 'Default'}</td>
                        <td className="px-6 py-4 text-slate-600">{loc.type}</td>
                        <td className="px-6 py-4 text-slate-600">{loc.address}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    );
  };

  const renderCurrencies = () => {
    if (viewMode === 'add_currency') {
      return (
        <div className="animate-fade-in max-w-xl">
           <div className="flex items-center justify-between mb-6">
              <button onClick={() => setViewMode('list')} className="flex items-center text-slate-500 hover:text-slate-800">
                <ArrowLeft size={18} className="mr-2" /> Back to Currencies
              </button>
              <h2 className="text-xl font-bold text-slate-900">New Currency</h2>
           </div>
           <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Currency Code*</label>
                 <input type="text" className={inputClass} value={newCurrency.code} onChange={e => setNewCurrency({...newCurrency, code: e.target.value})} placeholder="e.g. EUR" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Currency Name*</label>
                 <input type="text" className={inputClass} value={newCurrency.name} onChange={e => setNewCurrency({...newCurrency, name: e.target.value})} placeholder="e.g. Euro" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Currency Symbol</label>
                 <input type="text" className={inputClass} value={newCurrency.symbol} onChange={e => setNewCurrency({...newCurrency, symbol: e.target.value})} placeholder="e.g. €" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                 <button onClick={() => setViewMode('list')} className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50">Cancel</button>
                 <button onClick={handleSaveCurrency} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                    <Save size={16} className="mr-2"/> Save
                 </button>
              </div>
           </div>
        </div>
      );
    }
    return (
      <div className="animate-fade-in w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Currencies</h2>
          <button onClick={() => setViewMode('add_currency')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors flex items-center">
              <Plus size={16} className="mr-2" /> New Currency
          </button>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs">
              <tr>
                  <th className="px-6 py-3 border-b">Currency Name</th>
                  <th className="px-6 py-3 border-b">Code</th>
                  <th className="px-6 py-3 border-b">Symbol</th>
                  <th className="px-6 py-3 border-b">Action</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
              {currencies.map(curr => (
                <tr key={curr.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">
                      {curr.name}
                      {curr.isBase && <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Base</span>}
                    </td>
                    <td className="px-6 py-4">{curr.code}</td>
                    <td className="px-6 py-4">{curr.symbol}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {curr.isBase ? <Star size={16} className="text-yellow-400 fill-current"/> : <button className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>}
                    </td>
                </tr>
              ))}
              </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSubscription = () => {
    return (
      <div className="animate-fade-in max-w-5xl">
         <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Subscription</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Current Plan */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-2">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <div className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Current Plan</div>
                     <div className="text-3xl font-bold text-slate-900">Professional <span className="text-lg font-normal text-slate-500">(Yearly)</span></div>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>
               </div>
               
               <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                     <div className="text-sm text-slate-500 mb-1">Renewal Date</div>
                     <div className="font-semibold text-slate-800 flex items-center">
                        <Clock size={16} className="mr-2 text-slate-400"/> March 1, 2026
                     </div>
                  </div>
                  <div>
                     <div className="text-sm text-slate-500 mb-1">Amount</div>
                     <div className="font-semibold text-slate-800">₹0 <span className="text-xs text-slate-400 font-normal">/ year</span></div>
                  </div>
               </div>

               <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                     Upgrade Plan
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                     Cancel Subscription
                  </button>
               </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Payment Method</div>
                  <button className="text-blue-600 text-xs font-bold hover:underline">Edit</button>
               </div>
               
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                     <CreditCard size={20} className="text-slate-600"/>
                  </div>
                  <div>
                     <div className="font-bold text-slate-800 text-sm">Visa ending in 4242</div>
                     <div className="text-xs text-slate-500">Expires 12/2026</div>
                  </div>
               </div>
               
               <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Billing Address</div>
                  <div className="text-sm text-slate-800">
                     {localOrgProfile.address.street1}, {localOrgProfile.address.city}
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  };

  const renderUsers = () => {
    if (viewMode === 'invite_user') {
       return (
        <div className="animate-fade-in max-w-xl">
           <div className="flex items-center justify-between mb-6">
              <button onClick={() => setViewMode('list')} className="flex items-center text-slate-500 hover:text-slate-800">
                <ArrowLeft size={18} className="mr-2" /> Back to Users
              </button>
              <h2 className="text-xl font-bold text-slate-900">Invite User</h2>
           </div>
           <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Name*</label>
                 <input type="text" className={inputClass} value={newUser.name || ''} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Email Address*</label>
                 <input type="email" className={inputClass} value={newUser.email || ''} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                 <input type="tel" className={inputClass} value={newUser.phone || ''} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
              </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                 <select className={inputClass} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                    {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                 </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                 <button onClick={() => setViewMode('list')} className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50">Cancel</button>
                 <button onClick={handleInviteUser} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                    <Mail size={16} className="mr-2"/> Send Invite
                 </button>
              </div>
           </div>
        </div>
      );
    }
    return (
      <div className="animate-fade-in w-full">
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-bold text-slate-900">All Users</h2>
               <span className="text-blue-600"><SettingsIcon size={16} /></span>
            </div>
            <div className="flex gap-3">
               <button className="flex items-center text-blue-600 text-sm hover:underline">
                  <Globe size={16} className="mr-1"/> How to add users
               </button>
               <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded font-medium text-sm border border-slate-300 flex items-center">
                  <UserPlus size={16} className="mr-2" /> Invite Accountant
               </button>
               <button onClick={() => setViewMode('invite_user')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors flex items-center">
                  <Plus size={16} className="mr-2" /> Invite User
               </button>
               <button className="p-2 border border-slate-300 rounded hover:bg-slate-50 text-slate-600">
                  <MoreHorizontal size={20} />
               </button>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs">
                  <tr>
                     <th className="px-6 py-3 border-b">User Details</th>
                     <th className="px-6 py-3 border-b">Role</th>
                     <th className="px-6 py-3 border-b">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                     <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                 ${u.name.charAt(0).toLowerCase() === 'a' ? 'bg-orange-100 text-orange-600' : 
                                   u.name.charAt(0).toLowerCase() === 'f' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'}`}>
                                 {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                 <div className="text-blue-600 font-medium hover:underline cursor-pointer">{u.name}</div>
                                 <div className="text-slate-500 text-xs">{u.email}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{u.role}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs font-medium 
                              ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                              {u.status}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    );
  };

  const renderRoles = () => {
    if (viewMode === 'add_role') {
        return (
        <div className="animate-fade-in max-w-xl">
           <div className="flex items-center justify-between mb-6">
              <button onClick={() => setViewMode('list')} className="flex items-center text-slate-500 hover:text-slate-800">
                <ArrowLeft size={18} className="mr-2" /> Back to Roles
              </button>
              <h2 className="text-xl font-bold text-slate-900">New Role</h2>
           </div>
           <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Role Name*</label>
                 <input type="text" className={inputClass} value={newRole.name || ''} onChange={e => setNewRole({...newRole, name: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                 <textarea rows={3} className={inputClass} value={newRole.description || ''} onChange={e => setNewRole({...newRole, description: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                 <button onClick={() => setViewMode('list')} className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50">Cancel</button>
                 <button onClick={handleSaveRole} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                    <Save size={16} className="mr-2"/> Create Role
                 </button>
              </div>
           </div>
        </div>
      );
    }
    return (
      <div className="animate-fade-in w-full">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Roles</h2>
            <button onClick={() => setViewMode('add_role')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors flex items-center">
               <Plus size={16} className="mr-2" /> New Role
            </button>
         </div>

         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs">
                  <tr>
                     <th className="px-6 py-3 border-b w-1/4">Role Name</th>
                     <th className="px-6 py-3 border-b w-1/2">Description</th>
                     <th className="px-6 py-3 border-b text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {roles.map(r => (
                     <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-blue-600">{r.name}</td>
                        <td className="px-6 py-4 text-slate-600">{r.description}</td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="px-2 py-1 border border-slate-300 rounded text-xs hover:bg-slate-100">Edit</button>
                              <button className="px-2 py-1 border border-slate-300 rounded text-xs hover:bg-slate-100">Clone</button>
                              {!r.isSystem && <button className="p-1 border border-slate-300 rounded hover:bg-red-50 text-red-500"><Trash2 size={14}/></button>}
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    );
  };

  const renderSecurityPreferences = () => (
      <div className="animate-fade-in max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Security Preferences</h2>
            <Shield className="text-blue-500" size={32}/>
          </div>
          
          <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock size={18} className="text-slate-400"/> Authentication</h3>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <div className="font-semibold text-slate-800">Two-Factor Authentication</div>
                            <div className="text-xs text-slate-500">Add an extra layer of security to your account.</div>
                          </div>
                          <button className="px-4 py-1.5 bg-white border border-slate-300 rounded text-sm font-medium hover:bg-white active:bg-slate-50 disabled:opacity-50" disabled>Setup 2FA</button>
                      </div>
                  </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell size={18} className="text-slate-400"/> Notifications & Alerts</h3>
                  <div className="space-y-4">
                      <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded transition-colors">
                          <span className="text-sm font-medium text-slate-700">Email me on suspicious login attempts</span>
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded transition-colors">
                          <span className="text-sm font-medium text-slate-700">Email me when invoice is viewed by customer</span>
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" checked={preferences.emailInvoice} onChange={() => setPreferences({...preferences, emailInvoice: !preferences.emailInvoice})}/>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded transition-colors">
                          <span className="text-sm font-medium text-slate-700">Email me when payment is recorded</span>
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" checked={preferences.emailPayment} onChange={() => setPreferences({...preferences, emailPayment: !preferences.emailPayment})}/>
                      </label>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderModuleSettings = (page: string) => {
    let content;
    if (page === 'Inventory') {
        content = (
           <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-slate-900">Track Inventory</div>
                        <div className="text-sm text-slate-500">Track stock levels for items</div>
                    </div>
                    <input type="checkbox" checked={moduleSettings.inventoryTrack} onChange={() => setModuleSettings({...moduleSettings, inventoryTrack: !moduleSettings.inventoryTrack})} className="w-5 h-5 text-blue-600 rounded"/>
                </div>
                 <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-slate-900">Low Stock Alerts</div>
                        <div className="text-sm text-slate-500">Notify when item stock is below reorder point</div>
                    </div>
                    <input type="checkbox" checked={moduleSettings.lowStockAlert} onChange={() => setModuleSettings({...moduleSettings, lowStockAlert: !moduleSettings.lowStockAlert})} className="w-5 h-5 text-blue-600 rounded"/>
                </div>
           </div>
        );
    } else if (page === 'Invoices') {
        content = (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-slate-900">Invoice Prefix</div>
                        <div className="text-sm text-slate-500">Prefix for invoice numbers</div>
                    </div>
                    <input type="text" defaultValue="INV-" className="border border-slate-300 rounded p-1 text-sm outline-none w-24 text-center font-bold" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-slate-900">Next Number</div>
                        <div className="text-sm text-slate-500">Starting number for next invoice</div>
                    </div>
                    <input type="number" defaultValue="1001" className="border border-slate-300 rounded p-1 text-sm outline-none w-24 text-center font-bold" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                        <div className="font-medium text-slate-900">Show Shipping Charges</div>
                        <div className="text-sm text-slate-500">Add shipping field to invoices</div>
                    </div>
                     <input type="checkbox" checked={moduleSettings.salesShipping} onChange={() => setModuleSettings({...moduleSettings, salesShipping: !moduleSettings.salesShipping})} className="w-5 h-5 text-blue-600 rounded"/>
                </div>
                 <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-slate-900">Default Terms</div>
                        <div className="text-sm text-slate-500">Default payment terms for invoices</div>
                    </div>
                    <select className="border border-slate-300 rounded p-1 text-sm outline-none" value={moduleSettings.salesTerms} onChange={e => setModuleSettings({...moduleSettings, salesTerms: e.target.value})}>
                        <option>Net 15</option>
                        <option>Net 30</option>
                        <option>Due on Receipt</option>
                    </select>
                </div>
           </div>
        );
    } else if (page === 'Bills & Expenses') {
         content = (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-slate-900">Purchase Approvals</div>
                        <div className="text-sm text-slate-500">Require approval for POs</div>
                    </div>
                     <input type="checkbox" checked={moduleSettings.purchaseApproval} onChange={() => setModuleSettings({...moduleSettings, purchaseApproval: !moduleSettings.purchaseApproval})} className="w-5 h-5 text-blue-600 rounded"/>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-slate-900">Bill Table Layout</div>
                        <div className="text-sm text-slate-500">Choose preferred layout for bill entry</div>
                    </div>
                    <select className="border border-slate-300 rounded p-1 text-sm outline-none">
                        <option>Items & Accounts</option>
                        <option>Items Only</option>
                        <option>Accounts Only</option>
                    </select>
                </div>
           </div>
        );
    } else {
        content = <div className="text-slate-500 italic">Settings configuration options for {page}.</div>
    }

    return (
        <div className="animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{page} Settings</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                {content}
            </div>
            <div className="mt-8 flex justify-end">
                <button className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md">Save {page} Settings</button>
            </div>
        </div>
    );
  };

  const renderIntegrations = (page: string) => {
      if (page === 'FC Apps') {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
               <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <Grid size={40} className="text-blue-500 opacity-80" />
               </div>
               <h2 className="text-2xl font-bold text-slate-800 mb-3">Coming Soon</h2>
               <p className="text-slate-500 text-center max-w-md text-sm">
                  We are working on integrating FC Apps to provide a seamless experience. This feature will be available in future updates.
               </p>
            </div>
        );
      }
      return (
         <div className="animate-fade-in space-y-8">
             <div>
                <h2 className="text-2xl font-bold text-slate-900">{page}</h2>
                <p className="text-sm text-slate-500 mt-1">Connect your workflow with third-party tools.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {['Google Drive', 'Slack', 'Office 365', 'Zapier'].map(app => (
                     <div key={app} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-all transform hover:-translate-y-1">
                         <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl mb-4 flex items-center justify-center font-black text-slate-400 text-xl shadow-inner group-hover:bg-white">{app[0]}</div>
                         <h3 className="font-bold text-slate-800">{app}</h3>
                         <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">Seamlessly sync your {app} data with FC Finance for improved automation.</p>
                         <button className="w-full py-2 bg-white border border-slate-300 rounded-lg text-sm hover:bg-slate-50 font-bold text-slate-700 transition-colors">Connect</button>
                     </div>
                 ))}
             </div>
         </div>
      );
  };

  const renderDeveloper = (page: string) => {
       return (
         <div className="animate-fade-in max-w-3xl">
             <h2 className="text-xl font-bold text-slate-900 mb-6">{page}</h2>
             {page === 'API Usage' ? (
                 <div className="bg-white border border-slate-200 rounded-lg p-6">
                     <div className="flex justify-between items-center mb-6">
                         <div>
                             <div className="text-sm text-slate-500">Total API Calls</div>
                             <div className="text-3xl font-bold text-slate-900">0</div>
                         </div>
                         <div className="text-right">
                             <div className="text-sm text-slate-500">Plan Limit</div>
                             <div className="text-xl font-semibold text-slate-700">0</div>
                         </div>
                     </div>
                     <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                         <div className="h-full bg-blue-600 w-[12%]"></div>
                     </div>
                     <p className="text-xs text-slate-400 text-right">Resets on Mar 1, 2025</p>
                 </div>
             ) : (
                 <div className="bg-white border border-slate-200 rounded-lg p-6">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-slate-800">Endpoints</h3>
                         <button className="text-sm text-blue-600 font-medium hover:underline">+ Add Endpoint</button>
                     </div>
                     <div className="text-center py-8 text-slate-500">
                         <Webhook size={32} className="mx-auto mb-2 opacity-30"/>
                         No webhooks configured.
                     </div>
                 </div>
             )}
         </div>
       );
  };

  const renderFinancials = (page: string) => (
     <div className="animate-fade-in max-w-4xl">
         <h2 className="text-xl font-bold text-slate-900 mb-6">{page}</h2>
         {page === 'Chart of Accounts' ? (
             <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                 <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs">
                         <tr>
                             <th className="px-6 py-3 border-b">Account Name</th>
                             <th className="px-6 py-3 border-b">Type</th>
                             <th className="px-6 py-3 border-b">Code</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {[
                             {name: 'Cash', type: 'Asset', code: '1000'},
                             {name: 'Accounts Receivable', type: 'Asset', code: '1100'},
                             {name: 'Inventory Asset', type: 'Asset', code: '1200'},
                             {name: 'Accounts Payable', type: 'Liability', code: '2000'},
                             {name: 'Sales', type: 'Income', code: '4000'},
                             {name: 'Cost of Goods Sold', type: 'Expense', code: '5000'},
                         ].map((acc, idx) => (
                             <tr key={idx} className="hover:bg-slate-50">
                                 <td className="px-6 py-3 text-blue-600 font-medium cursor-pointer">{acc.name}</td>
                                 <td className="px-6 py-3">{acc.type}</td>
                                 <td className="px-6 py-3 font-mono text-slate-500">{acc.code}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         ) : (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs">
                         <tr>
                             <th className="px-6 py-3 border-b">Tax Name</th>
                             <th className="px-6 py-3 border-b">Rate</th>
                         </tr>
                     </thead>
                      <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-medium">GST 18%</td>
                            <td className="px-6 py-3">18%</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-medium">GST 12%</td>
                            <td className="px-6 py-3">12%</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-medium">GST 5%</td>
                            <td className="px-6 py-3">5%</td>
                          </tr>
                      </tbody>
                   </table>
              </div>
         )}
     </div>
  );

  return (
    <div className="flex h-full bg-slate-50 font-sans">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b border-slate-100">
                <h1 className="text-xl font-bold text-slate-800">Settings</h1>
            </div>
            <nav className="flex-1 p-4 space-y-6">
                {categories.map((cat, idx) => (
                    <div key={idx}>
                        <div 
                          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 px-2 
                             ${activeCategory === cat.name ? 'text-blue-600' : 'text-slate-500'}`}
                        >
                            <cat.icon size={14} />
                            {cat.name}
                        </div>
                        <div className="space-y-0.5">
                            {cat.pages.map(page => (
                                <button
                                    key={page}
                                    onClick={() => { setActiveCategory(cat.name); setActivePage(page); }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                                      ${activePage === page && activeCategory === cat.name 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
            {/* Conditional Rendering based on Active Page */}
            {activePage === 'Profile' && renderProfile()}
            {activePage === 'Branding' && renderBranding()}
            {activePage === 'Locations' && renderLocations()}
            {activePage === 'Currencies' && renderCurrencies()}
            {activePage === 'Subscription' && renderSubscription()}
            
            {activePage === 'Users' && renderUsers()}
            {activePage === 'Roles' && renderRoles()}
            {activePage === 'Security Preferences' && renderSecurityPreferences()}

            {activeCategory === 'Financials' && renderFinancials(activePage)}

            {activeCategory === 'Module Settings' && renderModuleSettings(activePage)}
            
            {activeCategory === 'Integrations' && renderIntegrations(activePage)}
        </div>
    </div>
  );
};

export default SettingsPage;