"use client";

interface SearchResultsInfoProps {
  totalResults: number;
  searchTerm: string;
  onSortChange?: (sortBy: string) => void;
  sortBy?: string;
}

export function SearchResultsInfo({
  totalResults,
  searchTerm,
}: SearchResultsInfoProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2">
        {searchTerm ? `Search Results for "${searchTerm}"` : "All Products"}
      </h2>
      <p className="text-muted-foreground">
        {totalResults.toLocaleString()}{" "}
        {totalResults === 1 ? "product" : "products"} found
      </p>
    </div>
  );
}
