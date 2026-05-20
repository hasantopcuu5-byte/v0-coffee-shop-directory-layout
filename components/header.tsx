"use client"

import { Coffee, User, Moon, Sun, Search, MapPin, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onCafeSearchClick?: () => void
  onDistrictClick?: () => void
  selectedDistrict?: string | null
}

export function Header({ onCafeSearchClick, onDistrictClick, selectedDistrict }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  // Simüle edilmiş kullanıcı oturum durumu (Geliştirme aşaması için true yapıldı)
  const [isLoggedIn, setIsLoggedIn] = useState(true) 
  
  // Default şık kahve temalı profil resmi (Baş harf içeren ve yumuşak kahve arka planlı tasarım için)
  const defaultAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"

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
          <button
            onClick={onCafeSearchClick}
            className="flex-1 flex items-center gap-3 h-full px-4 text-sm text-muted-foreground hover:bg-secondary/70 transition-all cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Cafe ara...</span>
          </button>
          
          <div className="w-px h-6 bg-border" />
          
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
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={onCafeSearchClick}
          >
            <Search className="h-5 w-5" />
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
          </Button>

          {isLoggedIn ? (
            /* Giriş Yapmış Kullanıcı Menüsü */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary/80 transition-all focus:outline-none">
                  <div className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <img src={defaultAvatarUrl} alt="Kullanıcı Profil Resmi" className="h-full w-full object-cover" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-foreground pr-1">Hasan Topçu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profili Düzenle</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Giriş Yapmamış Durum (Mevcut Giriş Modalı) */
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="hidden sm:flex rounded-full border-border hover:bg-secondary">
                  <User className="h-4 w-4" />
                  <span>Giriş Yap / Kayıt Ol</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl font-bold">Hoş Geldiniz</DialogTitle>
                  <DialogDescription className="text-center">
                    BrewMap'e giriş yapın veya yeni hesap oluşturun.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="login" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                    <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input id="email" type="email" placeholder="ornek@email.com" required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Şifre</Label>
                          <Link href="#" className="text-xs text-primary hover:underline" onClick={(e) => e.preventDefault()}>Şifremi unuttum</Link>
                        </div>
                        <Input id="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full">Giriş Yap</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="register">
                    <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad</Label>
                        <Input id="name" type="text" placeholder="Ad Soyad" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">E-posta</Label>
                        <Input id="reg-email" type="email" placeholder="ornek@email.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Şifre</Label>
                        <Input id="reg-password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full">Hesap Oluştur</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  )
}
