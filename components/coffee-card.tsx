"use client"

import { Star, Wifi, Leaf, Dog, MapPin, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface CoffeeShop {
  id: number
  name: string
  image: string
  rating: number
  reviews: number
  location: string
  tags: string[]
}

interface CoffeeCardProps {
  shop: CoffeeShop
}

const tagIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  vegan: Leaf,
  pet: Dog,
}

export function CoffeeCard({ shop }: CoffeeCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="group relative cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <img
          src={shop.image}
          alt={shop.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isLiked ? "fill-red-500 text-red-500" : "text-foreground"
            )}
          />
        </button>

        {/* Tags Overlay */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {shop.tags.map((tag) => {
            const Icon = tagIcons[tag]
            if (!Icon) return null
            return (
              <div
                key={tag}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm"
              >
                <Icon className="h-3.5 w-3.5 text-foreground" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1 text-balance">
            {shop.name}
          </h3>
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">{shop.rating}</span>
            <span className="text-muted-foreground">({shop.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{shop.location}</span>
        </div>
      </div>
    </div>
  )
}
