"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { CoffeeCard } from "@/components/coffee-card"
import { coffeeShops, istanbulDistricts } from "@/lib/coffee-data"
import { PageTransition } from "@/components/page-transition"
import { X, Search, MapPin, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"


export default function CoffeeDirectoryPage() {
  const [showCafeSearchModal, setShowCafeSearchModal] = useState(false)
  const [showDistrictModal, setShowDistrictModal] = useState(false)
  const [cafeSearch, setCafeSearch] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  
  const cafeInputRef = useRef<HTMLInputElement>(null)

  // Filter coffee shops based on district only (cafe search navigates directly)
  const filteredShops = selectedDistrict
    ? coffeeShops.filter(shop => shop.district === selectedDistrict)
    : coffeeShops

  // Filtered cafe suggestions
  const cafeSuggestions = cafeSearch.length > 0
    ? coffeeShops.filter(shop => 
        shop.name.toLowerCase().includes(cafeSearch.toLowerCase())
      )
    : []

  // Focus input when cafe search modal opens
  useEffect(() => {
    if (showCafeSearchModal && cafeInputRef.current) {
      setTimeout(() => cafeInputRef.current?.focus(), 100)
    }
  }, [showCafeSearchModal])

  // Close modal on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowCafeSearchModal(false)
        setShowDistrictModal(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showCafeSearchModal || showDistrictModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [showCafeSearchModal, showDistrictModal])

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district)
    setShowDistrictModal(false)
  }

  const handleClearDistrict = () => {
    setSelectedDistrict(null)
  }

  const getFilterDescription = () => {
    if (selectedDistrict) {
      return `${selectedDistrict} bolgesinde`
    }
    return "yakininizdaki"
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Header 
        onCafeSearchClick={() => setShowCafeSearchModal(true)} 
        onDistrictClick={() => setShowDistrictModal(true)}
        selectedDistrict={selectedDistrict}
      />
      <FilterBar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {filteredShops.length} kahveci {getFilterDescription()}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {selectedDistrict 
              ? "Farkli ilce secmek icin ust bardaki ilce alanina tiklayin"
              : "Bolgenizdeki en iyi kafeleri kesfedin"
            }
          </p>
          {selectedDistrict && (
            <button
              onClick={handleClearDistrict}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <span>Filtreyi Temizle</span>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredShops.map((shop) => (
              <CoffeeCard
                key={shop.id}
                shop={shop}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">☕</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Kahveci bulunamadi
            </h2>
            <p className="text-muted-foreground mb-4">
              {selectedDistrict 
                ? `${selectedDistrict} bolgesinde henuz kayitli kahveci yok.`
                : "Aramanizla eslesen kahveci bulunamadi."
              }
            </p>
            <button
              onClick={handleClearDistrict}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Tum Kahvecileri Goster
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 BrewMap. En iyi kahve noktanizi bulun.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Hakkinda</a>
              <a href="#" className="hover:text-foreground transition-colors">Gizlilik</a>
              <a href="#" className="hover:text-foreground transition-colors">Sartlar</a>
              <a href="#" className="hover:text-foreground transition-colors">Iletisim</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cafe Search Modal */}
      <div
        className={cn(
          "fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] transition-all duration-300",
          showCafeSearchModal 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            showCafeSearchModal ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setShowCafeSearchModal(false)}
        />
        
        {/* Modal Content */}
        <div 
          className={cn(
            "relative w-full max-w-xl mx-4 bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300",
            showCafeSearchModal 
              ? "opacity-100 translate-y-0 scale-100" 
              : "opacity-0 -translate-y-4 scale-95"
          )}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={cafeInputRef}
                type="text"
                value={cafeSearch}
                onChange={(e) => setCafeSearch(e.target.value)}
                placeholder="Cafe ismi ara..."
                className="h-12 w-full rounded-xl border border-border bg-secondary/50 pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                onClick={() => {
                  setCafeSearch("")
                  setShowCafeSearchModal(false)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {cafeSearch.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Cafe ismi yazarak aramaya baslayin</p>
              </div>
            ) : cafeSuggestions.length > 0 ? (
              <>
                <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border bg-secondary/30">
                  {cafeSuggestions.length} sonuc bulundu
                </div>
                {cafeSuggestions.map((shop) => (
                  <Link
                    key={shop.id}
                    href={`/shop/${shop.id}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0"
                    onClick={() => {
                      setShowCafeSearchModal(false)
                      setCafeSearch("")
                    }}
                  >
                    <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={shop.image} 
                        alt={shop.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-foreground truncate">{shop.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{shop.district} - {shop.location}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="text-yellow-500">★</span>
                      <span>{shop.rating}</span>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <p>Aradiginiz cafe bulunamadi</p>
                <p className="text-sm mt-1">Farkli bir isim deneyin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* District Selection Modal */}
      <div
        className={cn(
          "fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] transition-all duration-300",
          showDistrictModal 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            showDistrictModal ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setShowDistrictModal(false)}
        />
        
        {/* Modal Content */}
        <div 
          className={cn(
            "relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300",
            showDistrictModal 
              ? "opacity-100 translate-y-0 scale-100" 
              : "opacity-0 -translate-y-4 scale-95"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Ilce secerek filtreleme</h2>
            </div>
            <button
              onClick={() => setShowDistrictModal(false)}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* District List */}
          <div className="max-h-[50vh] overflow-y-auto">
            {/* Clear Filter Option */}
            {selectedDistrict && (
              <button
                onClick={() => {
                  setSelectedDistrict(null)
                  setShowDistrictModal(false)
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-secondary/50 transition-colors flex items-center justify-between border-b border-border bg-destructive/5 text-destructive"
              >
                <span>Filtreyi Temizle</span>
                <X className="h-4 w-4" />
              </button>
            )}
            
            {istanbulDistricts.map((district) => (
              <button
                key={district}
                onClick={() => handleDistrictSelect(district)}
                className={cn(
                  "w-full px-4 py-3 text-left text-sm hover:bg-secondary/50 transition-colors flex items-center justify-between border-b border-border/50 last:border-0",
                  selectedDistrict === district && "bg-primary/10 text-primary font-medium"
                )}
              >
                <span>{district}</span>
                {selectedDistrict === district && (
                  <span className="text-primary font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  )
}
