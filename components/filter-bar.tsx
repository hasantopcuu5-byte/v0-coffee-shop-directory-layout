"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Laptop, 
  Leaf, 
  Dog, 
  Star, 
  Wifi, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Clock,
  CreditCard
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const filters = [
  { id: "work-friendly", label: "Work-friendly", icon: Laptop },
  { id: "in-house-roaster", label: "In-house Roaster", icon: Zap },
  { id: "vegan-milk", label: "Vegan Milk", icon: Leaf },
  { id: "pet-friendly", label: "Pet Friendly", icon: Dog },
  { id: "high-rating", label: "High Rating", icon: Star },
  { id: "free-wifi", label: "Free Wi-Fi", icon: Wifi },
  { id: "open-late", label: "Open Late", icon: Clock },
  { id: "card-only", label: "Card Only", icon: CreditCard },
]

export function FilterBar() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="sticky top-16 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        {/* Left Arrow */}
        {showLeftArrow && (
          <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gradient-to-r from-background via-background to-transparent pl-4 pr-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="h-8 w-8 rounded-full shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Scrollable Filters */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filters.map((filter) => {
            const Icon = filter.icon
            const isActive = activeFilters.includes(filter.id)
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-secondary/50 text-foreground hover:border-primary/50 hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gradient-to-l from-background via-background to-transparent pr-4 pl-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="h-8 w-8 rounded-full shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
