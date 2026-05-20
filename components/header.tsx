"use client"

import { Coffee, User, Moon, Sun, Search, MapPin } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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

          {/* Auth Modal (Login / Register) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="hidden sm:flex rounded-full border-border hover:bg-secondary"
              >
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
                
                {/* Giriş Yap Sekmesi */}
                <TabsContent value="login">
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input id="email" type="email" placeholder="ornek@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Şifre</Label>
                        <Link href="#" className="text-xs text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                          Şifremi unuttum
                        </Link>
                      </div>
                      <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Giriş Yap
                    </Button>
                  </form>
                </TabsContent>

                {/* Kayıt Ol Sekmesi */}
                <TabsContent value="register">
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mt-4">
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
                    <Button type="submit" className="w-full">
                      Hesap Oluştur
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Veya şununla devam et
                  </span>
                </div>
              </div>

              {/* Google Auth Button */}
              <Button variant="outline" className="w-full" type="button" onClick={() => console.log('Google Auth Tetiklendi')}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google ile Devam Et
              </Button>
            </DialogContent>
          </Dialog>

          {/* Mobile User Button (Aynı Modalı Buna da Ekleyebilirsiniz) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden rounded-full"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DialogTrigger>
            {/* Modal içeriğini mobil için de tekrarlayabilir veya ayrı bir bileşene (component) çıkartabilirsiniz */}
          </Dialog>
        </div>
      </div>
    </header>
  )
}
