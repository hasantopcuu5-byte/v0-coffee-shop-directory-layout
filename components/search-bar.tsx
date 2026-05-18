"use client"

import { useState, useRef, useEffect } from "react"
import { Search, MapPin, X, ChevronDown } from "lucide-react"
import { coffeeShops, istanbulDistricts, type CoffeeShop } from "@/lib/coffee-data"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SearchBarProps {
  onFilterChange: (filter: { type: "name" | "district" | null; value: string }) => void
  currentFilter: { type: "name" | "district" | null; value: string }
}

export function SearchBar({ onFilterChange, currentFilter }: SearchBarProps) {
  const [cafeSearch, setCafeSearch] = useState("")
  const [showCafeSuggestions, setShowCafeSuggestions] = useState(false)
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  
  const cafeInputRef = useRef<HTMLInputElement>(null)
  const districtRef = useRef<HTMLDivElement>(null)
  const cafeSuggestionsRef = useRef<HTMLDivElement>(null)

  // Filter cafes based on search input
  const filteredCafes = cafeSearch.length > 0
    ? coffeeShops.filter(shop => 
        shop.name.toLowerCase().includes(cafeSearch.toLowerCase())
      )
    : []

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cafeSuggestionsRef.current && !cafeSuggestionsRef.current.contains(event.target as Node) &&
          cafeInputRef.current && !cafeInputRef.current.contains(event.target as Node)) {
        setShowCafeSuggestions(false)
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setShowDistrictDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCafeSearchChange = (value: string) => {
    setCafeSearch(value)
    setShowCafeSuggestions(value.length > 0)
    
    // Clear district filter when typing in cafe search
    if (selectedDistrict) {
      setSelectedDistrict(null)
    }
    
    // Apply cafe name filter
    if (value.length > 0) {
      onFilterChange({ type: "name", value })
    } else {
      onFilterChange({ type: null, value: "" })
    }
  }

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district)
    setShowDistrictDropdown(false)
    
    // Clear cafe search when selecting district
    setCafeSearch("")
    setShowCafeSuggestions(false)
    
    // Apply district filter
    onFilterChange({ type: "district", value: district })
  }

  const handleClearDistrict = () => {
    setSelectedDistrict(null)
    onFilterChange({ type: null, value: "" })
  }

  const handleClearCafeSearch = () => {
    setCafeSearch("")
    setShowCafeSuggestions(false)
    onFilterChange({ type: null, value: "" })
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-xl">
      {/* Cafe Name Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={cafeInputRef}
          type="text"
          value={cafeSearch}
          onChange={(e) => handleCafeSearchChange(e.target.value)}
          onFocus={() => cafeSearch.length > 0 && setShowCafeSuggestions(true)}
          placeholder="Cafe ismi ara..."
          className="h-11 w-full rounded-full border border-border bg-secondary/50 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {cafeSearch && (
          <button
            onClick={handleClearCafeSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Cafe Suggestions Dropdown */}
        {showCafeSuggestions && filteredCafes.length > 0 && (
          <div 
            ref={cafeSuggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            <div className="p-2 text-xs text-muted-foreground border-b border-border">
              {filteredCafes.length} sonuc bulundu
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredCafes.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/shop/${shop.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                  onClick={() => setShowCafeSuggestions(false)}
                >
                  <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={shop.image} 
                      alt={shop.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{shop.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{shop.district} - {shop.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="text-yellow-500">★</span>
                    <span>{shop.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results message */}
        {showCafeSuggestions && cafeSearch.length > 0 && filteredCafes.length === 0 && (
          <div 
            ref={cafeSuggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 p-4 text-center text-sm text-muted-foreground"
          >
            Aradiginiz cafe bulunamadi
          </div>
        )}
      </div>

      {/* District Selection */}
      <div className="relative" ref={districtRef}>
        <button
          onClick={() => {
            setShowDistrictDropdown(!showDistrictDropdown)
            // Clear cafe search when interacting with district dropdown
            if (cafeSearch) {
              setCafeSearch("")
              setShowCafeSuggestions(false)
            }
          }}
          className={cn(
            "h-11 w-full rounded-full border bg-secondary/50 px-4 text-sm transition-all flex items-center justify-between",
            showDistrictDropdown 
              ? "border-primary ring-2 ring-primary/20" 
              : "border-border hover:border-primary/50",
            selectedDistrict ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{selectedDistrict || "Ilce sec..."}</span>
          </div>
          <div className="flex items-center gap-1">
            {selectedDistrict && (
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearDistrict()
                }}
                className="p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              showDistrictDropdown && "rotate-180"
            )} />
          </div>
        </button>

        {/* District Dropdown */}
        {showDistrictDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
            <div className="p-2 text-xs text-muted-foreground border-b border-border">
              Istanbul Ilceleri
            </div>
            <div className="max-h-56 overflow-y-auto scrollbar-thin">
              {istanbulDistricts.map((district) => (
                <button
                  key={district}
                  onClick={() => handleDistrictSelect(district)}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 transition-colors flex items-center justify-between",
                    selectedDistrict === district && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <span>{district}</span>
                  {selectedDistrict === district && (
                    <span className="text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
