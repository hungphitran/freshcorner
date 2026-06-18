export type ProductThemeKey = "fruit" | "teabreak" | "snacks" | "smoothies" | "default";

export interface ProductTheme {
  key: ProductThemeKey;
  label: string;
  badge: string;
  cardHoverBorder: string;
  titleHover: string;
  linkHover: string;
  outlineButton: string;
  solidButton: string;
  activeText: string;
  activeBorder: string;
  activeBg: string;
  activeRing: string;
  iconBg: string;
  iconText: string;
  dot: string;
  thumbnailRing: string;
  paginationActive: string;
}

const themes: Record<ProductThemeKey, ProductTheme> = {
  fruit: {
    key: "fruit",
    label: "Trái cây",
    badge: "bg-primary-50 text-primary-600",
    cardHoverBorder: "hover:border-primary-200",
    titleHover: "group-hover/title:text-primary-600",
    linkHover: "hover:text-primary-600",
    outlineButton:
      "border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500/20",
    solidButton:
      "bg-primary-600 hover:bg-primary-700 shadow-primary-500/20 focus:ring-primary-500/20",
    activeText: "text-primary-600",
    activeBorder: "border-primary-500",
    activeBg: "bg-primary-50",
    activeRing: "focus:ring-primary-500/20",
    iconBg: "bg-primary-50",
    iconText: "text-primary-500",
    dot: "bg-primary-500",
    thumbnailRing: "hover:ring-primary-500",
    paginationActive: "bg-primary-600 text-white border-primary-600",
  },
  teabreak: {
    key: "teabreak",
    label: "Tea break",
    badge: "bg-brown-50 text-brown-700",
    cardHoverBorder: "hover:border-brown-300",
    titleHover: "group-hover/title:text-brown-700",
    linkHover: "hover:text-brown-700",
    outlineButton:
      "border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500/20",
    solidButton:
      "bg-primary-600 hover:bg-primary-700 shadow-primary-500/20 focus:ring-primary-500/20",
    activeText: "text-brown-700",
    activeBorder: "border-brown-500",
    activeBg: "bg-brown-50",
    activeRing: "focus:ring-brown-500/20",
    iconBg: "bg-brown-50",
    iconText: "text-brown-500",
    dot: "bg-brown-500",
    thumbnailRing: "hover:ring-brown-500",
    paginationActive: "bg-primary-600 text-white border-primary-600",
  },
  snacks: {
    key: "snacks",
    label: "Ăn vặt",
    badge: "bg-orange-50 text-orange-600",
    cardHoverBorder: "hover:border-orange-200",
    titleHover: "group-hover/title:text-orange-600",
    linkHover: "hover:text-orange-600",
    outlineButton:
      "border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500/20",
    solidButton:
      "bg-primary-600 hover:bg-primary-700 shadow-primary-500/20 focus:ring-primary-500/20",
    activeText: "text-orange-600",
    activeBorder: "border-orange-500",
    activeBg: "bg-orange-50",
    activeRing: "focus:ring-orange-500/20",
    iconBg: "bg-orange-50",
    iconText: "text-orange-500",
    dot: "bg-orange-500",
    thumbnailRing: "hover:ring-orange-500",
    paginationActive: "bg-primary-600 text-white border-primary-600",
  },
  smoothies: {
    key: "smoothies",
    label: "Smoothies",
    badge: "bg-orange-50 text-orange-700",
    cardHoverBorder: "hover:border-orange-300",
    titleHover: "group-hover/title:text-orange-700",
    linkHover: "hover:text-orange-700",
    outlineButton:
      "border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500/20",
    solidButton:
      "bg-primary-600 hover:bg-primary-700 shadow-primary-500/20 focus:ring-primary-500/20",
    activeText: "text-orange-700",
    activeBorder: "border-orange-500",
    activeBg: "bg-orange-50",
    activeRing: "focus:ring-orange-500/20",
    iconBg: "bg-orange-50",
    iconText: "text-orange-500",
    dot: "bg-orange-500",
    thumbnailRing: "hover:ring-orange-500",
    paginationActive: "bg-primary-600 text-white border-primary-600",
  },
  default: {
    key: "default",
    label: "Sản phẩm",
    badge: "bg-primary-50 text-primary-600",
    cardHoverBorder: "hover:border-primary-200",
    titleHover: "group-hover/title:text-primary-600",
    linkHover: "hover:text-primary-600",
    outlineButton:
      "border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500/20",
    solidButton:
      "bg-primary-600 hover:bg-primary-700 shadow-primary-500/20 focus:ring-primary-500/20",
    activeText: "text-primary-600",
    activeBorder: "border-primary-500",
    activeBg: "bg-primary-50",
    activeRing: "focus:ring-primary-500/20",
    iconBg: "bg-primary-50",
    iconText: "text-primary-500",
    dot: "bg-primary-500",
    thumbnailRing: "hover:ring-primary-500",
    paginationActive: "bg-primary-600 text-white border-primary-600",
  },
};

function normalizeThemeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function getProductTheme(themeKey: string = "default"): ProductTheme {
  const normalizedKey = normalizeThemeKey(themeKey);
  return themes[normalizedKey as ProductThemeKey] || themes.default;
}
