"use client"

import { Coffee, User, Moon, Sun, Search, MapPin, LogOut, MessageSquare, Star } from "lucide-react" // MessageSquare ve Star eklendi
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
// ... diğer importlar aynı ...

// ... interface HeaderProps aynı ...

export function Header({ onCafeSearchClick, onDistrictClick, selectedDistrict }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  // Simüle edilmiş kullanıcı oturum durumu (Değiştirilmedi)
  const [isLoggedIn, setIsLoggedIn] = useState(true) 
  
  // YENİ: Sitenin renk paletiyle uyumlu, çizim tarzı default avatar
  const defaultAvatarUrl = "/placeholder-avatar.svg"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* ... Logo kısmı aynı ... */}

        {/* ... Search Bar kısmı aynı ... */}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* ... Arama Butonu (Mobile) aynı ... */}

          {/* ... Theme Toggle aynı ... */}

          {isLoggedIn ? (
            /* Giriş Yapmış Kullanıcı Menüsü */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary/80 transition-all focus:outline-none">
                  {/* YENİ: Dairesel çerçeve içinde yeni SVG avatar */}
                  <div className="h-9 w-9 rounded-full overflow-hidden border border-border bg-secondary flex items-center justify-center p-0.5">
                    <img src={defaultAvatarUrl} alt="Kullanıcı" className="h-full w-full object-contain" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-foreground pr-1">Hasan Topçu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                {/* ... Dropdown menü içeriği aynı ... */}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* ... Giriş Yapmamış Durum kısmı aynı ... */
          )}
        </div>
      </div>
    </header>
  )
}
