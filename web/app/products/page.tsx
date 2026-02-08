"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductToolbar } from "@/components/products/ProductToolbar";
import FiltersSidebar from "@/components/products/FiltersSidebar";
import { SearchResultsInfo } from "@/components/search/SearchResultsInfo";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import {
  productService,
  Product,
  ProductFilters,
} from "@/lib/services/product.service";

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: [] as string[],
    priceRange: [0, 1000] as [number, number],
    brands: [] as string[],
    rating: 0,
    availability: false,
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const productsPerPage = 12;

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load products when filters, sorting, or page changes
  useEffect(() => {
    loadProducts();
  }, [filters, sortBy, currentPage]);

  const loadCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Build API filters
      const apiFilters: ProductFilters = {
        page: currentPage - 1, // Backend uses 0-based indexing
        size: productsPerPage,
      };

      // Add category filter
      if (filters.category.length > 0) {
        apiFilters.category = filters.category[0]; // API supports single category
      }

      // Add price range
      if (filters.priceRange[0] > 0) {
        apiFilters.minPrice = filters.priceRange[0];
      }
      if (filters.priceRange[1] < 1000) {
        apiFilters.maxPrice = filters.priceRange[1];
      }

      // Add sorting
      switch (sortBy) {
        case "price-low":
          apiFilters.sortBy = "price";
          apiFilters.sortDir = "asc";
          break;
        case "price-high":
          apiFilters.sortBy = "price";
          apiFilters.sortDir = "desc";
          break;
        case "name":
          apiFilters.sortBy = "name";
          apiFilters.sortDir = "asc";
          break;
        default: // newest
          apiFilters.sortBy = "createdAt";
          apiFilters.sortDir = "desc";
      }

      // Only show in-stock if availability filter is on
      // Note: This filter is client-side since API doesn't have it yet

      const response = await productService.getProducts(apiFilters);

      // Apply client-side filters that API doesn't support
      let filtered = response.content;
      if (filters.availability) {
        filtered = filtered.filter((p) => p.inStock);
      }

      setProducts(filtered);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 1000],
      brands: [],
      rating: 0,
      availability: false,
    });
    setCurrentPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile filter button */}
      <div className="lg:hidden sticky top-16 z-40 bg-white dark:bg-gray-800 border-b p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowMobileFilters(true)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters & Sort
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FiltersSidebar
              filters={filters}
              onFilterChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <SearchResultsInfo
              totalResults={totalElements}
              searchTerm=""
              onSortChange={setSortBy}
              sortBy={sortBy}
            />

            <ProductToolbar view={view} setView={setView} />

            {loading ? (
              <div className="text-center py-12">
                <p>Loading...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} view={view} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search term
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters & Sort</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <FiltersSidebar
                filters={filters}
                onFilterChange={setFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onClearFilters={clearFilters}
                isMobile
              />
              <Button
                className="w-full mt-4"
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
