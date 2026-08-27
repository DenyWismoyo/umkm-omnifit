import { BusinessCategory, PresetRecipeItem } from "./types";
import { angkringanTemplates } from "./categories/angkringan";
import { laundryTemplates } from "./categories/laundry";
import { beverageTemplates } from "./categories/beverages";
import { fastfoodTemplates } from "./categories/fastfood";
import { warungNasiTemplates } from "./categories/warungNasi";
import { bakeryTemplates } from "./categories/bakery";
import { otomotifTemplates } from "./categories/otomotif";
import { barbershopTemplates } from "./categories/barbershop";
import { craftFashionTemplates } from "./categories/craftFashion";
import { frozenJajananTemplates } from "./categories/frozenJajanan";

export * from "./types";
export * from "./categories/angkringan";
export * from "./categories/laundry";
export * from "./categories/beverages";
export * from "./categories/fastfood";
export * from "./categories/warungNasi";
export * from "./categories/bakery";
export * from "./categories/otomotif";
export * from "./categories/barbershop";
export * from "./categories/craftFashion";
export * from "./categories/frozenJajanan";

export const BUSINESS_CATEGORIES_METADATA: {
  id: BusinessCategory;
  name: string;
  icon: string;
  description: string;
}[] = [
  {
    id: "Angkringan & Street Food",
    name: "Angkringan & Street Food",
    icon: "🍢",
    description: "Nasi kucing, aneka sate bacem/bakar, mendoan, wedangan jahe rempah",
  },
  {
    id: "Laundry & Dry Clean",
    name: "Laundry & Dry Clean",
    icon: "🧺",
    description: "Laundry kiloan, cuci setrika, selimut bedcover, cuci sepatu & helm",
  },
  {
    id: "Coffee Shop & Minuman",
    name: "Coffee Shop & Minuman",
    icon: "☕",
    description: "Kopi susu aren, matcha latte, boba brown sugar, es teh jumbo, es cokelat",
  },
  {
    id: "Ayam Geprek & Fast Food",
    name: "Ayam Geprek & Fast Food",
    icon: "🍗",
    description: "Ayam geprek, fried chicken, chicken katsu ricebowl, kebab sapi, burger",
  },
  {
    id: "Warung Nasi & Catering",
    name: "Warung Nasi & Catering",
    icon: "🍛",
    description: "Nasi rames padang rendang, nasi box catering ayam bakar, soto lamongan",
  },
  {
    id: "Bakery, Pastry & Donat",
    name: "Bakery, Pastry & Donat",
    icon: "🥐",
    description: "Donat kentang glaze, fudgy brownies sekat 25, croffle caramel butter",
  },
  {
    id: "Cuci Kendaraan & Otomotif",
    name: "Cuci Kendaraan & Otomotif",
    icon: "🛵",
    description: "Cuci motor snow wash, cuci mobil hidrolik & vacuum, ganti oli mesin",
  },
  {
    id: "Barbershop & Salon",
    name: "Barbershop & Salon",
    icon: "💇",
    description: "Haircut pria modern + pomade, creambath hair spa, manicure pedicure",
  },
  {
    id: "Fashion, Sablon & Craft",
    name: "Fashion, Sablon & Craft",
    icon: "👕",
    description: "Kaos sablon DTF combed 30s, lilin aromaterapi soy wax, totebag kanvas",
  },
  {
    id: "Frozen Food & Jajanan",
    name: "Frozen Food & Jajanan",
    icon: "🥟",
    description: "Tahu walik crispy, pempek kapal selam, risol mayo lumer, dimsum siomay",
  },
];

/**
 * Aggregated Big Data Catalog of All UMKM Business Recipes & HPP Templates
 */
export const HPP_BIG_DATA_TEMPLATES: PresetRecipeItem[] = [
  ...angkringanTemplates,
  ...laundryTemplates,
  ...beverageTemplates,
  ...fastfoodTemplates,
  ...warungNasiTemplates,
  ...bakeryTemplates,
  ...otomotifTemplates,
  ...barbershopTemplates,
  ...craftFashionTemplates,
  ...frozenJajananTemplates,
];

/**
 * Helper to search across the entire Big Data repository
 */
export function searchHppTemplates(
  query: string,
  categoryFilter: string = "all",
  subCategoryFilter: string = "all"
): PresetRecipeItem[] {
  const cleanQ = query.toLowerCase().trim();
  return HPP_BIG_DATA_TEMPLATES.filter((item) => {
    const matchQuery =
      !cleanQ ||
      item.name.toLowerCase().includes(cleanQ) ||
      item.description.toLowerCase().includes(cleanQ) ||
      item.subCategory.toLowerCase().includes(cleanQ) ||
      item.ingredients.some((ing) => ing.name.toLowerCase().includes(cleanQ));

    const matchCat =
      categoryFilter === "all" || item.mainCategory === categoryFilter;

    const matchSub =
      subCategoryFilter === "all" || item.subCategory === subCategoryFilter;

    return matchQuery && matchCat && matchSub;
  });
}
