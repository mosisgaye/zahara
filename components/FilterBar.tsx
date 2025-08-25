'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  id: string;
  label: string;
  type: 'checkbox' | 'range' | 'select';
  options?: { value: string; label: string; count?: number }[];
  min?: number;
  max?: number;
}

interface FilterBarProps {
  filters: FilterOption[];
  onFilterChange: (filters: any) => void;
  totalProducts: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function FilterBar({
  filters,
  onFilterChange,
  totalProducts,
  viewMode,
  onViewModeChange
}: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 500]);

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setPriceRange([0, 500]);
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="sticky top-20 z-40 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left Side - Filters */}
          <div className="flex items-center space-x-4">
            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filtres</span>
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 px-1.5 py-0 h-5 bg-gold text-white">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    Filtres
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-sm"
                      >
                        Effacer tout
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Price Range */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold">Prix (€)</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{priceRange[0]}€</span>
                      <span>{priceRange[1]}€</span>
                    </div>
                  </div>

                  {/* Dynamic Filters */}
                  {filters.map((filter) => (
                    <div key={filter.id} className="space-y-3">
                      <Label className="text-sm font-semibold">{filter.label}</Label>
                      {filter.type === 'checkbox' && filter.options && (
                        <div className="space-y-2">
                          {filter.options.map((option) => (
                            <div key={option.value} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${filter.id}-${option.value}`}
                                  checked={activeFilters[filter.id]?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const current = activeFilters[filter.id] || [];
                                    const updated = checked
                                      ? [...current, option.value]
                                      : current.filter((v: string) => v !== option.value);
                                    handleFilterChange(filter.id, updated);
                                  }}
                                />
                                <Label
                                  htmlFor={`${filter.id}-${option.value}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {option.label}
                                </Label>
                              </div>
                              {option.count && (
                                <span className="text-xs text-gray-500">({option.count})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                {Object.entries(activeFilters).map(([key, value]: [string, any]) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    {key}: {Array.isArray(value) ? value.length : value}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleFilterChange(key, null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Sort and View */}
          <div className="flex items-center space-x-4">
            {/* Product Count */}
            <span className="hidden md:block text-sm text-gray-600">
              {totalProducts} produits
            </span>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Nouveautés</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="popular">Populaire</SelectItem>
                <SelectItem value="rating">Meilleures notes</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => onViewModeChange('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => onViewModeChange('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}