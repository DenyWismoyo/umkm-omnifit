export type BrandThemePreset =
  | "emerald"
  | "coffee"
  | "crimson"
  | "ocean"
  | "purple"
  | "midnight"
  | "custom";

export interface ShopProfile {
  id?: string;
  userId: string;
  industry?: IndustryPack;
  shopName: string;
  ownerName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  receiptFooter?: string;
  taxPercentage?: number; // e.g. 0, 10, 11%
  currency?: string; // default: IDR
  paperSize?: "58mm" | "80mm";
  logoUrl?: string;
  bannerUrl?: string;
  tagline?: string;
  instagram?: string;
  tiktok?: string;
  brandThemePreset?: BrandThemePreset;
  brandColorPrimary?: string;
  brandColorSecondary?: string;
  hideWatermark?: boolean;
  qrisImageUrl?: string;
  qrisNmid?: string;
  qrisMerchantName?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  storeCode?: string; // Kode unik toko untuk login kasir (e.g. TOKO-8492)
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreCodeMapping {
  code: string; // uppercase store code
  ownerUid: string;
  shopName: string;
  ownerName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  createdAt?: string;
}

export type RawMaterialCategory = "Bahan Baku" | "Kemasan" | "Bumbu" | "Lainnya";

export interface RawMaterial {
  id: string;
  name: string;
  category: RawMaterialCategory;
  stock: number;
  unit: string; // Gram, Ml, Pcs, Lembar, Kg, Liter, Butir
  costPerUnit: number; // Harga beli rata-rata per unit
  minStockAlert: number; // Batas minimal stok
  sku?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawMaterialDeduction {
  materialId: string;
  materialName: string;
  amount: number; // Jumlah yang terpakai per porsi (e.g. 18 gr)
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  categoryName?: string;
  costPrice: number; // Harga Beli / Modal
  sellingPrice: number; // Harga Jual
  stock: number;
  minStockAlert: number; // Batas minimal stok
  unit: string; // Pcs, Porsi, Botol, Kg, dll
  imageUrl?: string;
  description?: string;
  isAvailable?: boolean; // Status ketersediaan menu (default: true). Jika false, menu dianggap habis/sold out sementara
  recipeId?: string; // Link ke resep HPP
  rawMaterialDeductions?: RawMaterialDeduction[]; // Pengurangan bahan baku otomatis
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number; // Potongan per item
  subtotal: number;
  notes?: string;
}

export type PaymentMethod = "cash" | "qris" | "transfer" | "debt";

export interface TransactionItem {
  productId: string;
  productName: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  discount: number;
  subtotal: number;
  unit: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  date: string; // ISO String
  items: TransactionItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  totalCost: number; // Total HPP
  grossProfit: number; // totalAmount - totalCost
  paymentMethod: PaymentMethod;
  amountPaid: number; // Jumlah yang dibayarkan pelanggan
  changeAmount: number; // Kembalian
  customerId?: string;
  customerName?: string;
  notes?: string;
  status: "completed" | "cancelled" | "debt";
  createdAt?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string; // Operasional, Gaji, Sewa, Bahan Baku, Utilitas, Lainnya
  amount: number;
  description: string;
  paymentMethod?: string;
  receiptUrl?: string;
  createdAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  totalDebt: number; // Total sisa piutang/kasbon
  totalSpent: number; // Total belanja
  createdAt?: string;
}

export interface DebtPayment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  paymentMethod: "cash" | "transfer" | "qris";
  notes?: string;
  createdAt?: string;
}

export interface DashboardSummary {
  todayRevenue: number;
  todayProfit: number;
  todayTransactions: number;
  monthRevenue: number;
  monthProfit: number;
  monthExpenses: number;
  netProfit: number;
  totalProducts: number;
  lowStockCount: number;
  totalReceivables: number; // Total Kasbon belum lunas
}

export interface HppIngredient {
  id: string;
  name: string;
  packagePrice: number; // Harga 1 kemasan beli
  packageQty: number; // Jumlah volume isi kemasan (misal 1000)
  packageUnit: string; // Gram, Ml, Pcs, Lembar, Kg
  usedQty: number; // Takaran yang terpakai per porsi/batch
  usedUnit: string; // Gram, Ml, Pcs, Lembar
  cost: number; // (packagePrice / packageQty) * usedQty
}

export interface HppPackaging {
  id: string;
  name: string; // Cup, Lid, Straw, Plastik, Label Stiker, Paper bag
  unitPrice: number; // Harga per 1 pcs kemasan
  qty: number; // Jumlah yang dipakai per porsi
  cost: number; // unitPrice * qty
}

export interface HppRecipe {
  id: string;
  name: string;
  category?: string;
  batchYield: number; // Jumlah porsi yang dihasilkan dalam 1 resep (default: 1)
  ingredients: HppIngredient[];
  packagings: HppPackaging[];
  directLaborCost: number; // Biaya tenaga kerja per porsi / per batch
  overheadCost: number; // Biaya utilitas (gas, listrik, air, es) per porsi / per batch
  totalIngredientsCost: number;
  totalPackagingCost: number;
  totalProductionCost: number; // Total biaya 1 batch
  hppPerUnit: number; // totalProductionCost / batchYield
  targetMarginPct: number; // Persentase margin laba yang diinginkan (misal 50%)
  targetSellingPrice: number; // Harga jual rekomendasi
  profitPerUnit: number; // targetSellingPrice - hppPerUnit
  monthlyFixedCost?: number; // Biaya sewa + gaji bulanan untuk kalkulasi BEP
  bepUnits?: number; // BEP dalam jumlah porsi per bulan
  bepRevenue?: number; // BEP dalam Rupiah per bulan
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = "owner" | "cashier" | "supervisor";

export interface Cashier {
  id: string;
  name: string;
  pin: string; // 4-6 digit numeric PIN
  role: UserRole;
  isActive: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SubscriptionStatus = "trial" | "active" | "expired";

export type IndustryPack = "fnb" | "retail" | "salon" | "laundry" | "universal" | "coffeeshop";
export type SubscriptionTier = "basic" | "pro" | "enterprise";

export type SubscriptionPlanId =
  | "trial"
  // F&B / Kuliner
  | "fnb-basic-monthly"
  | "fnb-basic-yearly"
  | "fnb-pro-monthly"
  | "fnb-pro-yearly"
  // Retail / Toko Kelontong
  | "retail-basic-monthly"
  | "retail-basic-yearly"
  | "retail-pro-monthly"
  | "retail-pro-yearly"
  // Salon / Barbershop
  | "salon-basic-monthly"
  | "salon-basic-yearly"
  | "salon-pro-monthly"
  | "salon-pro-yearly"
  // Laundry / Kiloan
  | "laundry-basic-monthly"
  | "laundry-basic-yearly"
  | "laundry-pro-monthly"
  | "laundry-pro-yearly"
  // Coffee Shop / Kedai Kopi
  | "coffeeshop-basic-monthly"
  | "coffeeshop-basic-yearly"
  | "coffeeshop-pro-monthly"
  | "coffeeshop-pro-yearly"
  // Universal / Semua Industri
  | "universal-basic-monthly"
  | "universal-basic-yearly"
  | "universal-pro-monthly"
  | "universal-pro-yearly"
  // Enterprise / Whitelabel
  | "enterprise-yearly"
  | "enterprise-lifetime"
  // Legacy backward compatibility
  | "monthly"
  | "yearly"
  | "lifetime";

export interface UserSubscription {
  status: SubscriptionStatus;
  planId: SubscriptionPlanId;
  planName: string;
  industry?: IndustryPack;
  tier?: SubscriptionTier;
  trialStartedAt: string;
  trialEndsAt: string;
  validUntil?: string;
  isLifetime?: boolean;
  lastPaymentId?: string;
  lastPaymentAmount?: number;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  planId: SubscriptionPlanId;
  planName: string;
  amount: number;
  status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
  mayarTransactionId?: string;
  paymentLink?: string;
  qrCodeUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "COOKING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export interface IncomingOrderItem {
  productId: string;
  productName: string;
  sellingPrice: number;
  quantity: number;
  notes?: string;
  subtotal: number;
}

export interface IncomingOrder {
  id: string;
  orderNumber: string; // e.g. "ORD-084"
  storeCode: string;
  ownerUid: string;
  customerName: string;
  orderType: "dine-in" | "takeaway";
  tableNumber: string; // e.g. "Meja 04" atau "Bungkus"
  items: IncomingOrderItem[];
  totalAmount: number;
  totalQty: number;
  generalNotes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}



// ----------------------------------------------------------------------
// COFFEESHOP SPECIFIC TYPES
// ----------------------------------------------------------------------

export type IceLevel = "normal" | "less" | "no" | "extra";
export type SugarLevel = "normal" | "less" | "no" | "extra";

export interface BaristaOrderItem extends IncomingOrderItem {
  iceLevel?: IceLevel;
  sugarLevel?: SugarLevel;
  cupSize?: "regular" | "large";
}

export interface BaristaOrder extends Omit<IncomingOrder, "items"> {
  items: BaristaOrderItem[];
}

export interface LoyaltyCard {
  id: string; // customerId
  customerName: string;
  customerPhone?: string;
  stampsTotal: number;
  stampsCurrentCard: number; // 0 to 10
  lastVisit: string;
  redeemedAt: string[];
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------
// LAUNDRY SPECIFIC TYPES
// ----------------------------------------------------------------------
export type LaundryStatus = "pending" | "washing" | "ironing" | "ready" | "completed";
export type LaundryServiceType = "kiloan" | "satuan" | "sepatu" | "karpet";

export interface LaundryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  serviceType: LaundryServiceType;
  weightKg?: number;
  totalItems?: number;
  pricePerKgOrItem: number;
  totalAmount: number;
  status: LaundryStatus;
  notes?: string;
  estimatedDoneAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------
// SALON SPECIFIC TYPES
// ----------------------------------------------------------------------
export interface Stylist {
  id: string;
  name: string;
  phone?: string;
  commissionRate: number; // percentage, e.g. 30 for 30%
  isActive: boolean;
  createdAt: string;
}

export interface SalonService {
  id: string;
  name: string;
  category: "Hair" | "Beauty" | "Nail" | "Body";
  price: number;
  durationMinutes: number;
  commissionType: "percentage" | "fixed";
  commissionValue: number;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone?: string;
  stylistId: string;
  stylistName: string;
  serviceIds: string[];
  serviceNames: string[];
  totalPrice: number;
  scheduledAt: string; // ISO date string for start time
  durationMinutes: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

// ----------------------------------------------------------------------
// RETAIL SPECIFIC TYPES
// ----------------------------------------------------------------------
export type POStatus = "draft" | "ordered" | "received" | "cancelled";

export interface POItem {
  productId: string;
  productName: string;
  qty: number;
  buyPrice: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  items: POItem[];
  status: POStatus;
  totalCost: number;
  orderedAt?: string;
  receivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------
// RESTAURANT TABLE MANAGEMENT (FnB)
// ----------------------------------------------------------------------
export type TableStatus = "available" | "occupied" | "reserved";

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string; // ID of the IncomingOrder occupying this table
  customerName?: string;
  notes?: string;
}

// ----------------------------------------------------------------------
// PICKUP & DELIVERY (LAUNDRY)
// ----------------------------------------------------------------------
export type CourierStatus = "pending" | "picking_up" | "at_laundry" | "delivering" | "completed";

export interface PickupDeliveryOrder {
  id: string;
  orderId?: string; // Link to LaundryOrder if already created
  customerName: string;
  customerPhone: string;
  address: string;
  pickupTime: string; // ISO String
  deliveryTime?: string; // ISO String
  status: CourierStatus;
  driverName?: string;
  driverPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
