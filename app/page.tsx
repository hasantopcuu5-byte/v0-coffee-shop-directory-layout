"use client"

import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { CoffeeCard } from "@/components/coffee-card"
import { coffeeShops } from "@/lib/coffee-data"
import { PageTransition } from "@/components/page-transition"

export default function CoffeeDirectoryPage() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Header />
      <FilterBar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {coffeeShops.length} coffee shops nearby
          </h1>
          <p className="mt-1 text-muted-foreground">
            Discover the best cafes in your area
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {coffeeShops.map((shop) => (
            <CoffeeCard
              key={shop.id}
              shop={shop}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 BrewMap. Find your perfect coffee spot.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  )
}
