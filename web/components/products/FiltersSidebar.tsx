"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FiltersSidebarProps {
  filters: {
    category: string[];
    priceRange: [number, number];
    brands: string[];
    rating: number;
    availability: boolean;
  };
  onFilterChange: (filters: any) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
}

const FiltersSidebar = ({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  onClearFilters,
  isMobile = false,
}: FiltersSidebarProps) => {
  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
    "Sports",
    "Books",
  ];
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];
    onFilterChange({ ...filters, category: newCategories });
  };

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: value as [number, number] });
  };

  const handleAvailabilityChange = (checked: boolean) => {
    onFilterChange({ ...filters, availability: checked });
  };

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Sort By</h3>
        <div className="space-y-2">
          {[
            { value: "newest", label: "Newest" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "name", label: "Name" },
          ].map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`sort-${option.value}`}
                name="sort"
                value={option.value}
                checked={sortBy === option.value}
                onChange={(e) => onSortChange(e.target.value)}
                className="mr-2"
              />
              <Label
                htmlFor={`sort-${option.value}`}
                className="cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Price Range</h3>
        <Slider
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          max={1000}
          step={10}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={filters.category.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="ml-2 cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => handleBrandChange(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="ml-2 cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Availability</h3>
        <div className="flex items-center">
          <Checkbox
            id="availability"
            checked={filters.availability}
            onCheckedChange={handleAvailabilityChange}
          />
          <Label htmlFor="availability" className="ml-2 cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={onClearFilters}>
        Clear All Filters
      </Button>
    </div>
  );
};

export default FiltersSidebar;
