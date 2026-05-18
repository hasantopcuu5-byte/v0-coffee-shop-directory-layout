"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { CoffeeCard } from "@/components/coffee-card"
import { SearchBar } from "@/components/search-bar"
import { coffeeShops } from "@/lib/coffee-data"
import { PageTransition } from "@/components/page-transition"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CoffeeDirectoryPage() {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [filter, setFilter] = useState<{ type: "name" | "district" | null; value: string }>({
    type: null,
    value: ""
  })

  // Filter coffee shops based on current filter
  const filteredShops = filter.type === null
    ? coffeeShops
    : filter.type === "name"
      ? coffeeShops.filter(shop => 
          shop.name.toLowerCase().includes(filter.value.toLowerCase())
        )
      : coffeeShops.filter(shop => shop.district === filter.value)

  // Close modal on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowSearchModal(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showSearchModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [showSearchModal])

  const getFilterDescription = () => {
    if (filter.type === "district") {
      return `${filter.value} bolgesinde`
    }
    if (filter.type === "name") {
      return `"${filter.value}" aramasinda`
    }
    return "yakininizdaki"
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Header onSearchClick={() => setShowSearchModal(true)} />
      <FilterBar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {filteredShops.length} kahveci {getFilterDescription()}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {filter.type 
              ? "Filtreyi temizlemek icin arama butonuna tiklayin"
              : "Bolgenizdeki en iyi kafeleri kesfedin"
            }
          </p>
          {filter.type && (
            <button
              onClick={() => setFilter({ type: null, value: "" })}
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
              {filter.type === "district" 
                ? `${filter.value} bolgesinde henuz kayitli kahveci yok.`
                : "Aramanizla eslesen kahveci bulunamadi."
              }
            </p>
            <button
              onClick={() => setFilter({ type: null, value: "" })}
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

      {/* Search Modal */}
      <div
        className={cn(
          "fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] transition-all duration-300",
          showSearchModal 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            showSearchModal ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setShowSearchModal(false)}
        />
        
        {/* Modal Content */}
        <div 
          className={cn(
            "relative w-full max-w-xl mx-4 bg-card border border-border rounded-2xl shadow-2xl p-6 transition-all duration-300",
            showSearchModal 
              ? "opacity-100 translate-y-0 scale-100" 
              : "opacity-0 -translate-y-4 scale-95"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Arama</h2>
            <button
              onClick={() => setShowSearchModal(false)}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          
          <SearchBar 
            onFilterChange={(newFilter) => {
              setFilter(newFilter)
              // Close modal when a filter is applied
              if (newFilter.type === "district") {
                setShowSearchModal(false)
              }
            }}
            currentFilter={filter}
          />
          
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Cafe ismiyle arayabilir veya ilce secebilirsiniz
          </p>
        </div>
      </div>
    </div>
    </PageTransition>
  )
}
