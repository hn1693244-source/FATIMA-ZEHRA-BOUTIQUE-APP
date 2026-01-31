// Product catalog
export const CATEGORIES = ["Shawls", "Dupattas", "Scarves"];

export const PRODUCTS = [
  {
    id: 1,
    name: "Elegant Shawl",
    price: 2999,
    image: "/products/1.jpg",
    category: "Shawls"
  },
  {
    id: 2,
    name: "Premium Dupatta",
    price: 1999,
    image: "/products/2.jpg",
    category: "Dupattas"
  },
  {
    id: 3,
    name: "Silk Scarf",
    price: 3499,
    image: "/products/3.jpg",
    category: "Scarves"
  }
  // Additional products...
];

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function getProduct(id: number): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProducts(category?: string): Product[] {
  if (!category) return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category);
}
