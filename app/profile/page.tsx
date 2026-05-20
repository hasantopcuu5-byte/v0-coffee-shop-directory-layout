"use client"

import { useState, useRef } from "react" // useRef eklendi
import Link from "next/link"
import { ArrowLeft, User, Calendar, MapPin, Coffee, Camera, Mail, Pencil, MessageSquare, Star, Trash2 } from "lucide-react" // Yeni ikonlar eklendi
import { Header } from "@/components/header"
import { istanbulDistricts } from "@/lib/coffee-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageTransition } from "@/components/page-transition"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // AlertDialog import edildi

export default function ProfilePage() {
  // YENİ: Sitenin renk paletiyle uyumlu, çizim tarzı default avatar
  const DEFAULT_AVATAR = "/placeholder-avatar.svg";

  // Kullanıcı bilgileri state yapısı
  const [profileData, setProfileData] = useState({
    fullName: "Hasan Topçu",
    email: "hasan.topcu@example.com",
    avatar: DEFAULT_AVATAR, // Default olarak yeni SVG avatarı kullan
    birthDate: "1998-05-20",
    favoriteDistrict: "Kadikoy",
    favoriteCoffee: "v60",
    bio: "Nitelikli kahve peşinde koşan bir yazılımcı. Kadıköy sokaklarındaki 3. nesil kahveciler favorim."
  })

  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null) // Dosya girişi için referans

  // Dosya seçme işlemini tetikleyen fonksiyon
  const handleEditAvatar = () => {
    fileInputRef.current?.click(); // Gizli dosya girişini tıklar
  }

  // Yeni resim seçildiğinde çalışan fonksiyon
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Resmi önizlemek için base64 URL'sini state'e kaydet
        setProfileData({...profileData, avatar: reader.result as string});
        toast.info("Yeni profil resmi yüklendi. Kaydet'e tıkladığınızda kalıcı olacaktır.");
      };
      reader.readAsDataURL(file);
    }
  }

  // Profil resmini silen fonksiyon
  const handleRemoveAvatar = () => {
    setProfileData({...profileData, avatar: DEFAULT_AVATAR});
    toast.info("Profil resmi silindi. Varsayılan resme dönüldü.");
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Kayıt simülasyonu (Değiştirilmedi)
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
          {/* Geri Dön Linki (Değiştirilmedi) */}
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
                {/* Profil Resmi ve Çerçevesi - YENİ TASARIM */}
                <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden mb-4 ring-4 ring-primary/10 border-2 border-border bg-secondary flex items-center justify-center p-1">
                  <img 
                    src={profileData.avatar} 
                    alt={profileData.fullName} 
                    className={`h-full w-full ${profileData.avatar === DEFAULT_AVATAR ? 'object-contain' : 'object-cover rounded-full'}`}
                  />
                </div>
                
                {/* YENİ: Profil Resmini Düzenle/Sil Butonları */}
                <div className="flex items-center justify-center gap-2 mb-5">
                  {/* Gizli Dosya Girişi */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/png, image/jpeg, image/webp" 
                    className="hidden" 
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEditAvatar}
                    className="rounded-full h-8 px-3.5 gap-1.5 text-xs font-medium border-border hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5 text-primary" />
                    Düzenle
                  </Button>

                  {/* Eğer resim default değilse Sil butonunu göster */}
                  {profileData.avatar !== DEFAULT_AVATAR && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-full h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Profil Resmini Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            Profil resminizi silmek ve varsayılan resme dönmek istediğinize emin misiniz?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRemoveAvatar} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sil</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-foreground">{profileData.fullName}</h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {profileData.email}
                </p>
              </div>

              {/* İstatistik Alanı - GÜNCELLENMİŞ VE TEMİZLENMİŞ TASARIM */}
              <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">BrewMap İstatistiklerin</h3>
                <div className="space-y-3.5">
                  {/* Yorum Sayısı */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Yorum Sayısı</span>
                    </div>
                    <span className="text-xl font-bold text-primary">7</span>
                  </div>

                  {/* Değerlendirme Sayısı */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Değerlendirme</span>
                    </div>
                    <span className="text-xl font-bold text-amber-500">12</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ KOLON - Profil Bilgileri Düzenleme Formu (Değiştirilmedi) */}
            <div className="md:col-span-2">
              <div className="rounded-2xl bg-card p-6 sm:p-8 shadow-sm ring-1 ring-border">
                {/* ... Form İçeriği aynı ... */}
              </div>
            </div>

          </div>
        </main>
      </div>
    </PageTransition>
  )
}
