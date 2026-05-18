"use client"

import { Coffee, User, Moon, Sun, Search, MapPin } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeaderProps {
  onCafeSearchClick?: () => void
  onDistrictClick?: () => void
  selectedDistrict?: string | null
}

export function Header({ onCafeSearchClick, onDistrictClick, selectedDistrict }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Coffee className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            BrewMap
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl items-center h-11 rounded-full border border-border bg-secondary/50 overflow-hidden">
          {/* Cafe Search Area */}
          <button
            onClick={onCafeSearchClick}
            className="flex-1 flex items-center gap-3 h-full px-4 text-sm text-muted-foreground hover:bg-secondary/70 transition-all cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Cafe ara...</span>
          </button>
          
          {/* Divider */}
          <div className="w-px h-6 bg-border" />
          
          {/* District Selection Area */}
          <button
            onClick={onDistrictClick}
            className="flex items-center gap-2 h-full px-4 text-sm hover:bg-secondary/70 transition-all cursor-pointer"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">
              {selectedDistrict || "Istanbul"}
            </span>
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={onCafeSearchClick}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Login Button */}
          <Button
            variant="outline"
            className="hidden sm:flex rounded-full border-border hover:bg-secondary"
          >
            <User className="h-4 w-4" />
            <span>Giris Yap</span>
          </Button>

          {/* Mobile User Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden rounded-full"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
