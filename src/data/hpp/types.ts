export type BusinessCategory =
  | "Angkringan & Street Food"
  | "Laundry & Dry Clean"
  | "Coffee Shop & Minuman"
  | "Ayam Geprek & Fast Food"
  | "Warung Nasi & Catering"
  | "Bakery, Pastry & Donat"
  | "Cuci Kendaraan & Otomotif"
  | "Barbershop & Salon"
  | "Fashion, Sablon & Craft"
  | "Frozen Food & Jajanan";

export interface PresetIngredient {
  id: string;
  name: string;
  packagePrice: number;
  packageQty: number;
  packageUnit: string;
  usedQty: number;
  usedUnit: string;
  cost: number;
}

export interface PresetPackaging {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  cost: number;
}

export interface PresetRecipeItem {
  id: string;
  name: string;
  mainCategory: BusinessCategory;
  subCategory: string;
  icon: string;
  description: string;
  batchYield: number; // Hasil porsi per 1 kali masak/pengerjaan
  ingredients: PresetIngredient[];
  packagings: PresetPackaging[];
  directLaborCost: number;
  overheadCost: number;
  targetMarginPct: number;
  targetSellingPrice: number;
  monthlyFixedCost: number;
  tips?: string; // Tips efisiensi biaya & rahasia margin UMKM
}
