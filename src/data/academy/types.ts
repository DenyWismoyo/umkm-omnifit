export type AcademyCategoryId =
  | "finance"
  | "pricing"
  | "menu"
  | "operations"
  | "customers"
  | "marketing"
  | "hr"
  | "legal"
  | "growth";

export interface CategoryMeta {
  id: AcademyCategoryId;
  name: string;
  shortName: string;
  icon: string; // Lucide icon name or emoji
  emoji: string;
  description: string;
  badgeColor: string; // Tailwind color class
}

export interface AcademyArticle {
  id: string;
  title: string;
  categoryId: AcademyCategoryId;
  categoryLabel: string;
  readTime: string; // e.g. "5 Menit Baca"
  level: "Pemula" | "Menengah" | "Mahir";
  iconName: string;
  summary: string;
  keyTakeaways: string[];
  caseStudy?: {
    title: string;
    scenario: string;
    calculation: string;
    lesson: string;
  };
  content: string; // Markdown formatted detailed content
  actionLink?: {
    label: string;
    href: string;
  };
}
