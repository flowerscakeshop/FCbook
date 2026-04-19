import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, SquareUser, FileText, ShoppingBag, 
  CreditCard, PieChart, Settings, LogOut, Package,
  Menu, X, ScrollText, Receipt, Truck, ChevronDown, ChevronRight, Briefcase,
  Bell, CircleHelp, Check, ExternalLink, Search, User, Minus, Square
} from 'lucide-react';
import { UserRole, NavigationItem, Customer, Vendor, Product, Expense, AccountingDocument, Payment, DocumentStatus, OrganizationProfile, InvoiceItem } from './types';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import DocumentList from './pages/admin/DocumentList';
import InvoiceView from './pages/admin/InvoiceView';
import GenericList from './components/GenericList';
import CustomerDetail from './pages/admin/CustomerDetail';
import VendorDetail from './pages/admin/VendorDetail';
import Inventory from './pages/admin/Inventory';
import Expenses from './pages/admin/Expenses';
import Reports from './pages/admin/Reports';
import SettingsPage from './pages/admin/Settings';
import DocumentForm from './pages/admin/DocumentForm';
import { CustomerForm, VendorForm, ProductForm, ExpenseForm, PaymentForm } from './pages/admin/Forms';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalProfile from './pages/portal/PortalProfile';
import { MOCK_CUSTOMERS, MOCK_VENDORS, MOCK_PRODUCTS, MOCK_EXPENSES, MOCK_DOCUMENTS, MOCK_PAYMENTS, COMPANY_INFO } from './constants';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './firestoreError';

type Route = 
  | 'dashboard' 
  | 'customers' | 'customer-detail' | 'create-customer'
  | 'vendors' | 'vendor-detail' | 'create-vendor'
  | 'invoices' | 'invoice-view' | 'create-invoice'
  | 'estimates' | 'create-estimate'
  | 'bills' | 'create-bill'
  | 'purchase-orders' | 'create-po'
  | 'products' | 'create-product'
  | 'payments' | 'create-payment'
  | 'expenses' | 'create-expense'
  | 'reports' 
  | 'settings'
  | 'my-profile'; // Added for portal

// --- Sidebar Configurations ---

const AdminSidebarItems: NavigationItem[] = [
  { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
  { 
    label: 'Items', 
    path: 'products', 
    icon: Package,
    children: [
      { label: 'Products', path: 'products', icon: Package },
    ]
  },
  {
    label: 'Banking',
    path: 'banking',
    icon: Briefcase,
    children: [
      { label: 'Payments', path: 'payments', icon: CreditCard }
    ]
  },
  { 
    label: 'Sales', 
    path: 'sales', 
    icon: ShoppingBag,
    children: [
      { label: 'Customers', path: 'customers', icon: Users },
      { label: 'Invoices', path: 'invoices', icon: FileText },
      { label: 'Estimates', path: 'estimates', icon: ScrollText },
    ]
  },
  { 
    label: 'Purchases', 
    path: 'purchases', 
    icon: ShoppingBag,
    children: [
      { label: 'Vendors', path: 'vendors', icon: SquareUser },
      { label: 'Bills', path: 'bills', icon: Receipt },
      { label: 'Expenses', path: 'expenses', icon: CreditCard },
      { label: 'Purchase Orders', path: 'purchase-orders', icon: Truck },
    ]
  },
  { 
    label: 'Accountant', 
    path: 'accountant', 
    icon: Users,
    children: [
      { label: 'Chart of Accounts', path: 'settings', icon: Settings },
    ]
  },
  { label: 'Reports', path: 'reports', icon: PieChart },
  { label: 'Documents', path: 'documents', icon: FileText },
  { label: 'Settings', path: 'settings', icon: Settings },
];

const CustomerSidebarItems: NavigationItem[] = [
  { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
  { label: 'Invoices', path: 'invoices', icon: FileText },
  { label: 'Estimates', path: 'estimates', icon: ScrollText },
  { label: 'Payments', path: 'payments', icon: CreditCard },
  { label: 'Items Catalog', path: 'products', icon: Package },
  { label: 'My Profile', path: 'my-profile', icon: User },
];

const VendorSidebarItems: NavigationItem[] = [
  { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
  { label: 'Purchase Orders', path: 'purchase-orders', icon: Truck },
  { label: 'Bills', path: 'bills', icon: Receipt },
  { label: 'Payments', path: 'payments', icon: CreditCard },
  { label: 'Items Catalog', path: 'products', icon: Package },
  { label: 'My Profile', path: 'my-profile', icon: User },
];

// ... SidebarItem component remains same ...
interface SidebarItemProps {
  item: NavigationItem;
  currentRoute: string;
  navigate: (p: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, currentRoute, navigate, isExpanded, onToggle }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = currentRoute === item.path || (hasChildren && item.children?.some(c => c.path === currentRoute));

  return (
    <div className="mb-1">
      <button
        onClick={() => hasChildren ? onToggle() : navigate(item.path)}
        className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isActive && !hasChildren
            ? 'bg-blue-50 text-blue-600' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center">
          <item.icon size={18} className="mr-3 text-slate-500" />
          {item.label}
        </div>
        {hasChildren && (
          isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        )}
      </button>
      
      {hasChildren && isExpanded && (
        <div className="ml-9 mt-1 space-y-1">
          {item.children?.map(child => (
            <button
              key={child.label}
              onClick={() => navigate(child.path)}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${
                currentRoute === child.path
                  ? 'text-blue-600 font-medium' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full mr-3 ${currentRoute === child.path ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [role, setRole] = useState<UserRole>(null);
  // For demo: Mock logged in Customer/Vendor ID (Arun Kumar / Shankar Traders)
  // In a real app, this comes from the auth provider
  const [loggedInEntityId] = useState<number>(1); 

  const [currentRoute, setCurrentRoute] = useState<Route>('dashboard');
  const [routeParams, setRouteParams] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'sales': true,
    'purchases': true
  });

  // --- State Management for Data ---
  const [orgProfile, setOrgProfile] = useState<OrganizationProfile>(COMPANY_INFO);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [documents, setDocuments] = useState<AccountingDocument[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingPaymentData, setPendingPaymentData] = useState<Partial<Payment> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check users collection for role
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role as UserRole);
          } else {
            // Bootstrap specific phone number or owner email as admin
            const isAdminPhone = 
              user.phoneNumber === '+918754388003' || user.email?.startsWith('8754388003') ||
              user.phoneNumber === '+919994993853' || user.email?.startsWith('9994993853');
            
            if (user.email === 'flowerscake.shop@gmail.com' || isAdminPhone) {
              setRole('admin');
              // Save to firestore for future
              await setDoc(doc(db, 'users', user.uid), { 
                role: 'admin', 
                email: user.email || `${user.phoneNumber}@accounting.app`, 
                phoneNumber: user.phoneNumber || (user.phoneNumber?.replace('+91', '') || '9994993853')
              });
            } else {
              setRole('customer'); // Default for new users
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          setRole('customer');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!role) return;

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ ...doc.data(), id: Number(doc.id) } as Customer)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'));

    const unsubVendors = onSnapshot(collection(db, 'vendors'), (snapshot) => {
      setVendors(snapshot.docs.map(doc => ({ ...doc.data(), id: Number(doc.id) } as Vendor)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'vendors'));

    const unsubOrg = onSnapshot(doc(db, 'settings', 'organization'), (snapshot) => {
      if (snapshot.exists()) {
        setOrgProfile(snapshot.data() as OrganizationProfile);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/organization'));

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data() } as Product)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    const unsubExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ ...doc.data(), id: Number(doc.id) } as Expense)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'expenses'));

    const unsubDocs = onSnapshot(collection(db, 'documents'), (snapshot) => {
      setDocuments(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AccountingDocument)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'documents'));

    const unsubPayments = onSnapshot(collection(db, 'payments'), (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Payment)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'payments'));

    return () => {
      unsubCustomers();
      unsubVendors();
      unsubOrg();
      unsubProducts();
      unsubExpenses();
      unsubDocs();
      unsubPayments();
    };
  }, [role]);

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => ({ ...prev, [path]: !prev[path] }));
  };

  // --- Handlers ---
  const handleStockAdjustment = async (items: InvoiceItem[], type: 'increase' | 'decrease') => {
    for (const product of products) {
      const item = items.find(i => i.description === product.name || (product.sku && i.description.includes(product.sku)));
      if (item && product.track_inventory) {
        const adjustment = type === 'increase' ? item.qty : -item.qty;
        const newStock = (product.stock || 0) + adjustment;
        try {
          await updateDoc(doc(db, 'products', product.sku), { stock: newStock });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `products/${product.sku}`);
        }
      }
    }
  };

  // Profile Updates for Customer/Vendor Portal
  const handleUpdateCustomer = async (updatedCustomer: Customer) => {
    try {
      await updateDoc(doc(db, 'customers', String(updatedCustomer.id)), { ...updatedCustomer });
      setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'customers');
    }
  };

  const handleUpdateVendor = async (updatedVendor: Vendor) => {
    try {
      await updateDoc(doc(db, 'vendors', String(updatedVendor.id)), { ...updatedVendor });
      setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'vendors');
    }
  };

  const handleAddCustomer = async (customer: Customer) => {
    try {
      const id = Date.now();
      await setDoc(doc(db, 'customers', String(id)), { ...customer, id });
      navigate('customers');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'customers');
    }
  };

  const handleAddVendor = async (vendor: Vendor) => {
    try {
      const id = Date.now();
      await setDoc(doc(db, 'vendors', String(id)), { ...vendor, id });
      navigate('vendors');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'vendors');
    }
  };

  const handleAddProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.sku), product);
      navigate('products');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const handleAddExpense = async (expense: Expense) => {
    try {
      const id = Date.now();
      await setDoc(doc(db, 'expenses', String(id)), { ...expense, id });
      navigate('expenses');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'expenses');
    }
  };

  const handleAddPayment = async (paymentData: Payment) => {
    try {
      await setDoc(doc(db, 'payments', paymentData.id), paymentData);
      
      // Update Balance
      const isReceived = paymentData.type === 'received';
      const collectionName = isReceived ? 'customers' : 'vendors';
      const entityList = isReceived ? customers : vendors;
      const entity = entityList.find(e => e.id === paymentData.related_entity_id);

      if (entity) {
        const balanceField = isReceived ? 'balance' : 'outstanding';
        const currentBalance = isReceived ? (entity.balance || 0) : ((entity as any).outstanding || 0);
        const newBalance = Math.max(0, currentBalance - paymentData.amount);
        await updateDoc(doc(db, collectionName, String(entity.id)), { [balanceField]: newBalance });
      }

      // Automatically mark related document as paid
      if (paymentData.related_document_id) {
        await updateDoc(doc(db, 'documents', paymentData.related_document_id), { status: 'Paid' });
      }

      navigate('payments');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'payments');
    }
  };

  const handleProductDelete = async (sku: string) => {
    try {
      await deleteDoc(doc(db, 'products', sku));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${sku}`);
    }
  };

  const handleCustomerDelete = async (id: number) => {
    try {
      await deleteDoc(doc(db, 'customers', String(id)));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `customers/${id}`);
    }
  };

  const handleVendorDelete = async (id: number) => {
    try {
      await deleteDoc(doc(db, 'vendors', String(id)));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `vendors/${id}`);
    }
  };

  const handleExpenseDelete = async (id: number) => {
    try {
      await deleteDoc(doc(db, 'expenses', String(id)));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `expenses/${id}`);
    }
  };

  const handleDocumentDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `documents/${id}`);
    }
  };

  const handlePaymentDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'payments', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `payments/${id}`);
    }
  };
  
  const handleRecordPayment = (docId: string) => {
    const document = documents.find(d => d.id === docId);
    if (!document) return;

    setPendingPaymentData({
      amount: document.total - (document.deposit || 0),
      related_entity_id: document.related_entity_id,
      related_entity_name: document.related_entity_name,
      type: document.type === 'bill' ? 'paid' : 'received',
      reference: `Ref: ${document.number}`,
      related_document_id: document.id
    });
    navigate('create-payment');
  };

  const handleAddDocument = async (docData: AccountingDocument) => {
    try {
      const id = `DOC-${Date.now()}`;
      await setDoc(doc(db, 'documents', id), { ...docData, id });
      
      if (docData.type === 'invoice') handleStockAdjustment(docData.items, 'decrease');
      else if (docData.type === 'bill') handleStockAdjustment(docData.items, 'increase');

      // Update customer/vendor balance
      const collectionName = (docData.type === 'invoice' || docData.type === 'estimate') ? 'customers' : 'vendors';
      const entity = (docData.type === 'invoice' || docData.type === 'estimate') 
        ? customers.find(c => c.id === docData.related_entity_id)
        : vendors.find(v => v.id === docData.related_entity_id);

      if (entity && (docData.type === 'invoice' || docData.type === 'bill')) {
        const isInvoice = docData.type === 'invoice';
        const balanceField = isInvoice ? 'balance' : 'outstanding';
        const currentBalance = isInvoice ? (entity.balance || 0) : ((entity as any).outstanding || 0);
        
        const dueAmount = docData.total - (docData.deposit || 0);
        const newBalance = currentBalance + dueAmount;
        await updateDoc(doc(db, collectionName, String(entity.id)), { [balanceField]: newBalance });
      }
      
      const routeMap: Record<string, Route> = {
        'invoice': 'invoices', 'estimate': 'estimates', 'bill': 'bills', 'purchase_order': 'purchase-orders'
      };
      navigate(routeMap[docData.type] || 'dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'documents');
    }
  };

  const handleUpdateStatus = async (id: string, status: DocumentStatus) => {
    try {
      const docRef = doc(db, 'documents', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;
      
      const docData = docSnap.data() as AccountingDocument;
      const oldStatus = docData.status;

      await updateDoc(docRef, { status });
      
      if (status === 'Paid' && oldStatus !== 'Paid') {
        const paymentId = `PAY-${Date.now()}`;
        const dueAmount = docData.total - (docData.deposit || 0);
        const newPayment: Payment = {
          id: paymentId,
          date: new Date().toISOString().split('T')[0],
          amount: dueAmount,
          related_entity_id: docData.related_entity_id,
          related_entity_name: docData.related_entity_name,
          method: 'Bank',
          type: docData.type === 'bill' ? 'paid' : 'received',
          reference: `Ref-${docData.number}`,
          related_document_id: docData.id
        };
        await setDoc(doc(db, 'payments', paymentId), newPayment);

        // Update Balance
        const isCustomer = (docData.type === 'invoice' || docData.type === 'estimate');
        const collectionName = isCustomer ? 'customers' : 'vendors';
        const entity = isCustomer
          ? customers.find(c => c.id === docData.related_entity_id)
          : vendors.find(v => v.id === docData.related_entity_id);
        
        if (entity) {
          const balanceField = isCustomer ? 'balance' : 'outstanding';
          const currentBalance = isCustomer ? (entity.balance || 0) : ((entity as any).outstanding || 0);
          const newBalance = Math.max(0, currentBalance - dueAmount);
          await updateDoc(doc(db, collectionName, String(entity.id)), { [balanceField]: newBalance });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'documents');
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        if (role) setCurrentRoute('dashboard');
        return;
      }
      const [path, param] = hash.split('/');
      setCurrentRoute(path as Route);
      if (param) setRouteParams(param);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [role]);

  const handleSaveOrgProfile = async (profile: OrganizationProfile) => {
    try {
      await setDoc(doc(db, 'settings', 'organization'), profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/organization');
    }
  };

  const navigate = (path: string, id?: string) => {
    window.location.hash = id ? `${path}/${id}` : path;
    setCurrentRoute(path as Route);
    setRouteParams(id || null);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setRole(null);
    window.location.hash = '';
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!role) return <Login />;

  // --- Dynamic Content Rendering ---
  const renderContent = () => {
    // 1. FILTER DATA FOR PORTALS
    const myDocuments = role === 'admin' ? documents : documents.filter(d => d.related_entity_id === loggedInEntityId);
    const myPayments = role === 'admin' ? payments : payments.filter(p => p.related_entity_id === loggedInEntityId);
    const myEntity = role === 'customer' 
      ? customers.find(c => c.id === loggedInEntityId)
      : role === 'vendor' ? vendors.find(v => v.id === loggedInEntityId) : null;

    // 2. PORTAL SPECIFIC ROUTES
    if (role === 'customer' || role === 'vendor') {
      switch (currentRoute) {
        case 'dashboard':
          return <PortalDashboard role={role} entity={myEntity} documents={myDocuments} payments={myPayments} onViewDocument={(id) => navigate('invoice-view', id)} />;
        case 'my-profile':
          return <PortalProfile entity={myEntity} onUpdate={role === 'customer' ? handleUpdateCustomer : handleUpdateVendor} />;
        
        case 'products':
          return <Inventory data={products} onCreate={() => {}} />; // Read-only for portal
        
        // Document Lists (Filtered)
        case 'invoices':
          return <DocumentList type="invoice" documents={myDocuments} role={role} onView={(id) => navigate('invoice-view', id)} onDelete={role === 'admin' ? handleDocumentDelete : undefined} onCreate={() => {}} />;
        case 'estimates':
          return <DocumentList type="estimate" documents={myDocuments} role={role} onView={(id) => navigate('invoice-view', id)} onDelete={role === 'admin' ? handleDocumentDelete : undefined} onCreate={() => {}} />;
        case 'bills':
          return <DocumentList type="bill" documents={myDocuments} role={role} onView={(id) => navigate('invoice-view', id)} onDelete={role === 'admin' ? handleDocumentDelete : undefined} onCreate={() => {}} />;
        case 'purchase-orders':
          return <DocumentList type="purchase_order" documents={myDocuments} role={role} onView={(id) => navigate('invoice-view', id)} onDelete={role === 'admin' ? handleDocumentDelete : undefined} onCreate={() => {}} />;
        
        case 'payments':
          return <GenericList title="Payments" data={myPayments} columns={['date', 'related_entity_name', 'amount', 'method', 'type']} role={role} onView={() => {}} onDelete={undefined} onCreate={undefined} />;
        
        case 'invoice-view':
          return <InvoiceView 
            documentId={routeParams} 
            onBack={() => navigate('dashboard')} 
            role={role} 
            documents={documents} 
            customers={customers} 
            vendors={vendors} 
            onUpdateStatus={handleUpdateStatus} 
            onRecordPayment={role === 'admin' ? handleRecordPayment : undefined}
            orgProfile={orgProfile} 
          />;
        
        default:
          return <PortalDashboard role={role} entity={myEntity} documents={myDocuments} onViewDocument={(id) => navigate('invoice-view', id)} />;
      }
    }

    // 3. ADMIN ROUTES
    switch (currentRoute) {
      case 'dashboard':
        return <Dashboard role={role} documents={documents} expenses={expenses} customers={customers} onNavigate={(path) => {
          if (path === 'create-payment') setPendingPaymentData(null);
          navigate(path);
        }} />;
      
      // Documents
      case 'invoices':
        return <DocumentList type="invoice" documents={documents} role={role} onView={(id) => navigate('invoice-view', id)} onRecordPayment={handleRecordPayment} onDelete={handleDocumentDelete} onCreate={() => navigate('create-invoice')} />;
      case 'invoice-view': {
        const viewingDoc = documents.find(d => d.id === routeParams);
        const backRoute = viewingDoc 
          ? (viewingDoc.type === 'invoice' ? 'invoices' : viewingDoc.type === 'bill' ? 'bills' : viewingDoc.type === 'estimate' ? 'estimates' : 'purchase-orders') 
          : 'dashboard';
        return <InvoiceView documentId={routeParams} onBack={() => navigate(backRoute)} role={role} documents={documents} customers={customers} vendors={vendors} onUpdateStatus={handleUpdateStatus} onRecordPayment={handleRecordPayment} orgProfile={orgProfile} />;
      }
      case 'create-invoice':
        return <DocumentForm type="invoice" onCancel={() => navigate('invoices')} onSave={handleAddDocument} customers={customers} vendors={vendors} products={products} />;
      
      case 'estimates':
        return <DocumentList type="estimate" documents={documents} role={role} onView={(id) => navigate('invoice-view', id)} onDelete={handleDocumentDelete} onCreate={() => navigate('create-estimate')} />;
      case 'create-estimate':
        return <DocumentForm type="estimate" onCancel={() => navigate('estimates')} onSave={handleAddDocument} customers={customers} vendors={vendors} products={products} />;
      
      case 'bills':
        return <DocumentList type="bill" documents={documents} role={role} onView={(id) => navigate('invoice-view', id)} onRecordPayment={handleRecordPayment} onDelete={handleDocumentDelete} onCreate={() => navigate('create-bill')} />;
      case 'create-bill':
        return <DocumentForm type="bill" onCancel={() => navigate('bills')} onSave={handleAddDocument} customers={customers} vendors={vendors} products={products} />;

      case 'purchase-orders':
        return <DocumentList type="purchase_order" documents={documents} role={role} onView={(id) => navigate('invoice-view', id)} onDelete={handleDocumentDelete} onCreate={() => navigate('create-po')} />;
      case 'create-po':
        return <DocumentForm type="purchase_order" onCancel={() => navigate('purchase-orders')} onSave={handleAddDocument} customers={customers} vendors={vendors} products={products} />;

      // Lists & Forms
      case 'customers':
        return <GenericList title="Customers" data={customers} columns={['name', 'phone', 'gst', 'balance', 'status']} role={role} onView={(id) => navigate('customer-detail', String(id))} onDelete={(id) => handleCustomerDelete(Number(id))} onCreate={() => navigate('create-customer')} />;
      case 'customer-detail':
        return <CustomerDetail id={Number(routeParams)} onBack={() => navigate('customers')} customers={customers} documents={documents} payments={payments} />;
      case 'create-customer':
        return <CustomerForm onSave={handleAddCustomer} onCancel={() => navigate('customers')} />;

      case 'vendors':
        return <GenericList title="Vendors" data={vendors} columns={['name', 'phone', 'gst', 'outstanding', 'status']} role={role} onView={(id) => navigate('vendor-detail', String(id))} onDelete={(id) => handleVendorDelete(Number(id))} onCreate={() => navigate('create-vendor')} />;
      case 'vendor-detail':
        return <VendorDetail id={Number(routeParams)} onBack={() => navigate('vendors')} vendors={vendors} documents={documents} payments={payments} />;
      case 'create-vendor':
        return <VendorForm onSave={handleAddVendor} onCancel={() => navigate('vendors')} />;

      case 'products':
        return <Inventory data={products} onCreate={() => navigate('create-product')} onDelete={handleProductDelete} />;
      case 'create-product':
        return <ProductForm onSave={handleAddProduct} onCancel={() => navigate('products')} vendors={vendors} />;

      case 'expenses':
        return <Expenses data={expenses} onCreate={() => navigate('create-expense')} onDelete={handleExpenseDelete} />;
      case 'create-expense':
        return <ExpenseForm onSave={handleAddExpense} onCancel={() => navigate('expenses')} />;

      case 'payments':
        return <GenericList title="Payments" data={payments} columns={['date', 'related_entity_name', 'amount', 'method', 'type']} role={role} onDelete={(id) => handlePaymentDelete(String(id))} onCreate={() => { setPendingPaymentData(null); navigate('create-payment'); }} />;
      case 'create-payment':
        return <PaymentForm onSave={(p) => { handleAddPayment(p); setPendingPaymentData(null); }} onCancel={() => { navigate('payments'); setPendingPaymentData(null); }} customers={customers} vendors={vendors} initialData={pendingPaymentData || undefined} />;

      case 'reports': return <Reports />;
      case 'settings': return <SettingsPage role={role} initialTab={routeParams} orgProfile={orgProfile} onUpdateProfile={handleSaveOrgProfile} />;
        
      default: return <div>Not Found</div>;
    }
  };

  const getSidebarItems = () => {
    if (role === 'customer') return CustomerSidebarItems;
    if (role === 'vendor') return VendorSidebarItems;
    return AdminSidebarItems;
  };

  const currentSidebarItems = getSidebarItems();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#f8f9fa] border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
          <span className="text-xl font-bold tracking-tight text-slate-900">FC Book<span className="text-blue-600">.</span></span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>
        <div className="p-4 flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          <nav className="space-y-1 flex-1">
            {currentSidebarItems.map((item) => (
              <SidebarItem key={item.label} item={item} currentRoute={currentRoute} navigate={(p) => navigate(p)} isExpanded={!!expandedMenus[item.path]} onToggle={() => toggleMenu(item.path)} />
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-200 mt-6">
             {role === 'admin' && (
                <button onClick={() => navigate('settings', 'subscription')} className="w-full py-2.5 px-4 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 mb-3 shadow-sm transition-colors">Manage Subscription</button>
             )}
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 transition-colors"><LogOut size={18} className="mr-3" /> Sign Out</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-white">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 relative z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"><Menu size={24} /></button>
          <div className="flex items-center justify-end w-full space-x-3">
            <button className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Notifications"><Bell size={20} strokeWidth={1.5} /></button>
            {role === 'admin' && (
               <button className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Settings" onClick={() => navigate('settings')}><Settings size={20} strokeWidth={1.5} /></button>
            )}
            <button className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Help"><CircleHelp size={20} strokeWidth={1.5} /></button>
            <div className="relative ml-2">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-10 h-10 rounded-full border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition-colors overflow-hidden"><User size={24} strokeWidth={1.5} /></button>
              {isProfileOpen && (<><div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div><div className="absolute top-12 right-0 w-[240px] bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4"><div className="font-bold text-slate-900 mb-1">{role === 'admin' ? 'Admin' : (role === 'customer' ? customers.find(c => c.id===loggedInEntityId)?.name : vendors.find(v => v.id===loggedInEntityId)?.name)}</div><div className="text-xs text-slate-500 capitalize mb-4">{role} Account</div><button onClick={handleLogout} className="text-red-600 text-sm font-medium hover:underline">Sign Out</button></div></>)}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-[#f0f2f5] p-4 sm:p-6 lg:p-8"><div className="max-w-7xl mx-auto h-full">{renderContent()}</div></div>
      </main>
    </div>
  );
}