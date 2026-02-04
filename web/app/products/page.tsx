"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductToolbar } from "@/components/products/ProductToolbar";
import FiltersSidebar from "@/components/products/FiltersSidebar";
import { SearchResultsInfo } from "@/components/search/SearchResultsInfo";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";

// Sample data
const sampleProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 500) + 50,
  rating: Math.floor(Math.random() * 5) + 1,
  reviewCount: Math.floor(Math.random() * 100),
  inStock: Math.random() > 0.2,
  sale: Math.random() > 0.7,
  discount: Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 10 : 0,
  category: ["Electronics", "Fashion", "Home", "Beauty"][Math.floor(Math.random() * 4)],
  brand: ["Brand A", "Brand B", "Brand C", "Brand D"][Math.floor(Math.random() * 4)],
}));

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
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
  const productsPerPage = 12;

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(p => filters.category.includes(p.category));
    }

    // Apply price filter
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Apply brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    // Apply availability filter
    if (filters.availability) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default: // newest
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, sortBy, products]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 1000],
      brands: [],
      rating: 0,
      availability: false,
    });
  };

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
              totalResults={filteredProducts.length}
              searchTerm=""
              onSortChange={setSortBy}
              sortBy={sortBy}
            />
            
            <ProductToolbar view={view} setView={setView} />
            
            {filteredProducts.length > 0 ? (
              <>
                <ProductGrid 
                  products={currentProducts} 
                  view={view} 
                />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters & Sort</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
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
              <Button className="w-full mt-4" onClick={() => setShowMobileFilters(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}