"use client"

import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { CoffeeCard } from "@/components/coffee-card"

const coffeeShops = [
  {
    id: 1,
    name: "The Roasted Bean",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    rating: 4.8,
    reviews: 324,
    location: "123 Main St, Downtown",
    tags: ["wifi", "vegan"],
  },
  {
    id: 2,
    name: "Artisan Coffee Lab",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    rating: 4.9,
    reviews: 512,
    location: "456 Oak Ave, Midtown",
    tags: ["wifi", "pet"],
  },
  {
    id: 3,
    name: "Morning Glory Cafe",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
    rating: 4.6,
    reviews: 198,
    location: "789 Elm St, Westside",
    tags: ["vegan", "pet"],
  },
  {
    id: 4,
    name: "Brew & Beyond",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
    rating: 4.7,
    reviews: 267,
    location: "321 Pine Rd, Eastside",
    tags: ["wifi"],
  },
  {
    id: 5,
    name: "The Coffee Collective",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    rating: 4.5,
    reviews: 143,
    location: "654 Cedar Ln, Northside",
    tags: ["wifi", "vegan", "pet"],
  },
  {
    id: 6,
    name: "Espresso Express",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
    rating: 4.4,
    reviews: 89,
    location: "987 Birch Blvd, Southside",
    tags: ["wifi"],
  },
  {
    id: 7,
    name: "Caffeine Dreams",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    rating: 4.8,
    reviews: 421,
    location: "147 Maple Dr, Harbor District",
    tags: ["vegan"],
  },
  {
    id: 8,
    name: "Urban Grind",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    rating: 4.6,
    reviews: 256,
    location: "258 Walnut Way, Arts Quarter",
    tags: ["wifi", "pet"],
  },
]

export default function CoffeeDirectoryPage() {
  return (
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
  )
}
