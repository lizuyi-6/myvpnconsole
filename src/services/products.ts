import { mockProducts } from "@/mocks/products";
import { delay, ServiceError } from "@/services/mock-transport";
import type { Product, ProductFilter } from "@/types";

/**
 * Product catalog service.
 * Backend contract: GET /products, GET /products/:slug
 */
export interface ProductService {
  listProducts(filter?: ProductFilter): Promise<Product[]>;
  getProduct(slug: string): Promise<Product>;
}

function matchesFilter(product: Product, filter: ProductFilter): boolean {
  if (filter.category && filter.category !== "all") {
    if (product.category !== filter.category) return false;
  }
  if (filter.planDays) {
    if (!product.plans.some((p) => p.days === filter.planDays)) return false;
  }
  if (filter.stock === "available") {
    if (product.stock.status === "out_of_stock") return false;
  }
  if (filter.stock === "low") {
    if (product.stock.status !== "low_stock") return false;
  }
  if (filter.search) {
    const q = filter.search.trim().toLowerCase();
    if (q && !`${product.name} ${product.tagline}`.toLowerCase().includes(q)) {
      return false;
    }
  }
  return true;
}

export const productService: ProductService = {
  async listProducts(filter = {}) {
    await delay();
    return mockProducts.filter((p) => matchesFilter(p, filter));
  },

  async getProduct(slug) {
    await delay();
    const product = mockProducts.find((p) => p.slug === slug);
    if (!product) {
      throw new ServiceError("Product not found.", 404);
    }
    return product;
  },
};
