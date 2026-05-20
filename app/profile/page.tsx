"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, User, Calendar, MapPin, Coffee, Camera, Check, Sparkles, Mail } from "lucide-react"
import { Header } from "@/components/header"
import { istanbulDistricts } from "@/lib/coffee-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageTransition } from "@/components/page-transition"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function ProfilePage() {
  // Kullanıcı bilgileri state yapısı
  const [profileData, setProfileData] = useState({
    fullName: "Hasan Topçu", // Düzenlenemez alan
    email: "hasan.topcu@example.com", // Düzenlenemez alan
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80", // Default şık profil resmi
    birthDate: "1998-05-20",
    favoriteDistrict: "Kadikoy",
    favoriteCoffee: "v60",
    bio: "Nitelikli kahve peşinde koşan bir yazılımcı. Kadıköy sokaklarındaki 3. nesil kahveciler favorim."
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Kayıt simülasyonu
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Profil bilgileriniz başarıyla güncellendi!")
    }, 800)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Geri Dön Linki */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Ana Sayfaya Dön
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* SOL KOLON - Profil Kartı Özeti */}
            <div className="md:col-span-1 space-y-6">
              <div className="rounded-2xl bg-card p-6 text-center shadow-sm ring-1 ring-border">
                <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden group mb-4 ring-4 ring-primary/10">
                  <img 
                    src={profileData.avatar} 
                    alt={profileData.fullName} 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-foreground">{profileData.fullName}</h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {profileData.email}
                </p>
                
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Coffee className="h-3.5 w-3.5" />
                  Kahve Eksperi
                </div>
              </div>

              {/* İstatistik Alanı (Popüler sitelerdeki gibi ufak bir detay) */}
              <div className="rounded-2xl bg-secondary/30 p-5 ring-1 ring-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">BrewMap Yolculuğun</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-card p-3 rounded-xl border border-border/60">
                    <div className="text-lg font-bold text-primary">12</div>
                    <div className="text-xs text-muted-foreground">Ziyaret Edilen</div>
                  </div>
                  <div className="bg-card p-3 rounded-xl border border-border/60">
                    <div className="text-lg font-bold text-primary">7</div>
                    <div className="text-xs text-muted-foreground">Yorum Sayısı</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ KOLON - Profil Bilgileri Düzenleme Formu */}
            <div className="md:col-span-2">
              <div className="rounded-2xl bg-card p-6 sm:p-8 shadow-sm ring-1 ring-border">
                <div className="border-b border-border pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-foreground">Profil Bilgileri</h1>
                  <p className="text-sm text-muted-foreground mt-1">BrewMap deneyiminizi kişiselleştirmek için bilgilerinizi güncelleyin.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  
                  {/* İsim Soyisim (KİLİTLİ ALAN) */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-muted-foreground flex items-center gap-1.5">
                      <User className="h-4 w-4" /> Ad Soyad (Değiştirilemez)
                    </Label>
                    <Input 
                      id="fullName" 
                      type="text" 
                      value={profileData.fullName} 
                      disabled 
                      className="bg-secondary/40 text-muted-foreground cursor-not-allowed font-medium border-dashed"
                    />
                  </div>

                  {/* Doğum Tarihi */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" /> Doğum Tarihi
                    </Label>
                    <Input 
                      id="birthDate" 
                      type="date" 
                      value={profileData.birthDate}
                      onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                      required
                    />
                  </div>

                  {/* En Çok Takıldığı Cafe Bölgesi (ÖZGÜN İSTANBUL İLÇELERİ LİSTESİ) */}
                  <div className="space-y-2">
                    <Label htmlFor="favoriteDistrict" className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" /> En Çok Takıldığı Kafe Bölgesi
                    </Label>
                    <Select 
                      value={profileData.favoriteDistrict} 
                      onValueChange={(value) => setProfileData({...profileData, favoriteDistrict: value})}
                    >
                      <SelectTrigger id="favoriteDistrict" className="w-full">
                        <SelectValue placeholder="İlçe seçin" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {istanbulDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Öneri Alanı 1: Favori Kahve Çeşidi */}
                  <div className="space-y-2">
                    <Label htmlFor="favoriteCoffee" className="flex items-center gap-1.5">
                      <Coffee className="h-4 w-4 text-primary" /> Favori Kahve Demleme Çeşidi
                    </Label>
                    <Select 
                      value={profileData.favoriteCoffee} 
                      onValueChange={(value) => setProfileData({...profileData, favoriteCoffee: value})}
                    >
                      <SelectTrigger id="favoriteCoffee" className="w-full">
                        <SelectValue placeholder="Kahve çeşidi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="espresso">Espresso / Espresso Tabanlı (Latte, Cappuccino)</SelectItem>
                        <SelectItem value="filter">Filtre Kahve (Makine)</SelectItem>
                        <SelectItem value="v60">V60 Pourover / Chemex</SelectItem>
                        <SelectItem value="coldbrew">Cold Brew / Nitro Coffee</SelectItem>
                        <SelectItem value="turkish">Türk Kahvesi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Öneri Alanı 2: Kahve Mottosu / Biyografi */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary" /> Kahve Mottosu / Biyografi
                    </Label>
                    <Textarea 
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Kahveye dair felsefenizden bahsedin..."
                      className="resize-none min-h-[100px]"
                    />
                  </div>

                  {/* Kaydet Butonu */}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button 
                      type="submit" 
                      disabled={isSaving}
                      className="rounded-full bg-primary text-primary-foreground font-medium px-6 hover:bg-primary/90 transition-colors"
                    >
                      {isSaving ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
                    </Button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        </main>
      </div>
    </PageTransition>
  )
}
