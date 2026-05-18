"use client"

import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface MapPin {
  id: number
  x: number
  y: number
  name: string
}

interface MapViewProps {
  pins: MapPin[]
  hoveredShop: number | null
}

export function MapView({ pins, hoveredShop }: MapViewProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-secondary/30 dark:bg-secondary/20">
      {/* Map Background Pattern */}
      <div className="absolute inset-0">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border/50"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative Roads */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <path
          d="M 0 30% L 100% 70%"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted/30"
        />
        <path
          d="M 20% 0 L 80% 100%"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted/30"
        />
        <path
          d="M 60% 0 L 40% 100%"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-muted/20"
        />
      </svg>

      {/* Map Pins */}
      {pins.map((pin) => (
        <div
          key={pin.id}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-full transition-all duration-200",
            hoveredShop === pin.id ? "z-20 scale-125" : "z-10"
          )}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <div className="relative">
            {/* Pin Shadow */}
            <div className="absolute -bottom-1 left-1/2 h-2 w-4 -translate-x-1/2 rounded-full bg-foreground/20 blur-sm" />
            
            {/* Pin */}
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-colors",
                hoveredShop === pin.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground border border-border"
              )}
            >
              <MapPin className="h-5 w-5" />
            </div>

            {/* Tooltip */}
            {hoveredShop === pin.id && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg">
                {pin.name}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Map Attribution */}
      <div className="absolute bottom-3 right-3 rounded-lg bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm">
        Map Placeholder
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-background shadow-md transition-colors hover:bg-secondary text-foreground font-medium">
          +
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-background shadow-md transition-colors hover:bg-secondary text-foreground font-medium">
          −
        </button>
      </div>
    </div>
  )
}
