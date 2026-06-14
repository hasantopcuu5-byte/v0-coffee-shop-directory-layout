"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { istanbulDistricts, getRemoteCoffeeShops, addRemoteCoffeeShop } from "@/lib/coffee-data"
import { db, storage } from "@/lib/firebase"
import { doc, deleteDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CoffeeCard } from "@/components/coffee-card"
import { toast } from "sonner"
import { Plus, Trash, Store, PlusCircle, Loader2 } from "lucide-react"

export default function AdminPage() {
  const [shops, setShops] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Form Stateleri
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    location: "",
    district: "",
    lat: "41.0082",
    lng: "28.9784"
  })

  const [tags, setTags] = useState<string[]>([])
  const [services, setServices] = useState<string[]>(["Espresso", "Filtre Kahve"])
  const [newService, setNewService] = useState("")

  // Veritabanından kafeleri çek
  const loadShops = async () => {
    setIsLoading(true)
    try {
      const data = await getRemoteCoffeeShops()
      setShops(data)
    } catch (error) {
      toast.error("Kafeler yüklenirken hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadShops()
  }, [])

  // Kafe Silme İşlemi
  const handleDelete = async (id: string) => {
    if (!confirm("Bu kafeyi silmek istediğinize emin misiniz?")) return
    try {
      await deleteDoc(doc(db, "coffeeShops", id))
      toast.success("Kafe başarıyla silindi!")
      loadShops() // Listeyi yenile
    } catch (error) {
      toast.error("Silinirken bir hata oluştu.")
    }
  }

  // Yeni Kafe Kaydetme (Görsel Yükleme + Firestore)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.district) return toast.error("Lütfen bir ilçe seçin!")
    if (!imageFile) return toast.error("Lütfen bilgisayarınızdan bir görsel seçin!")

    setIsSubmitting(true)
    try {
      // 1. Görseli Firebase Storage'a yükle
      const fileRef = ref(storage, `coffee-shops/${Date.now()}_${imageFile.name}`)
      await uploadBytes(fileRef, imageFile)
      const imageUrl = await getDownloadURL(fileRef)

      // 2. Verileri Firestore'a kaydet
      await addRemoteCoffeeShop({
        name: formData.name,
        image: imageUrl, // Storage'dan dönen gerçek URL
        images: [imageUrl],
        address: formData.address,
        location: formData.location,
        district: formData.district,
        tags: tags,
        services: services,
        amenities: ["Wi-Fi"], // Varsayılan özellik
        hours: [
          { day: "Pazartesi - Cuma", time: "08:00 - 22:00" },
          { day: "Hafta Sonu", time: "09:00 - 23:00" }
        ],
        coordinates: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        }
      })

      toast.success("Yeni kafe başarıyla eklendi!")
      setIsSheetOpen(false)
      loadShops() // Listeyi yenile
      
      // Formu sıfırla
      setImageFile(null)
      setFormData({ name: "", address: "", location: "", district: "", lat: "41.0082", lng: "28.9784" })
      setTags([])
      setServices(["Espresso", "Filtre Kahve"])
    } catch (error) {
      toast.error("Kaydedilirken bir hata oluştu. Konsolu kontrol edin.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Üst Bar: Başlık ve Yeni Ekle Butonu */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" /> Admin Paneli
            </h1>
            <p className="text-muted-foreground mt-1">Sistemdeki tüm kafeleri buradan yönetebilirsiniz.</p>
          </div>

          {/* SAĞDAN AÇILAN EKLEME FORMU (SHEET) */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full gap-2">
                <PlusCircle className="h-5 w-5" /> Yeni Kafe Ekle
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Yeni Kafe Ekle</SheetTitle>
                <SheetDescription>Kafenin bilgilerini ve fotoğrafını girip canlıya alabilirsiniz.</SheetDescription>
              </SheetHeader>

              <form onSubmit={handleSave} className="space-y-5">
                
                {/* DOSYA YÜKLEME ALANI */}
                <div className="space-y-2">
                  <Label htmlFor="imageFile" className="font-semibold text-primary">Kafe Fotoğrafı Yükle</Label>
                  <Input 
                    id="imageFile" 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={e => setImageFile(e.target.files?.[0] || null)} 
                    className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:rounded-md file:px-4 file:py-1 hover:file:bg-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Kafe Adı</Label>
                  <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Örn: Brew Lab" />
                </div>

                <div className="space-y-2">
                  <Label>İstanbul İlçesi</Label>
                  <Select value={formData.district} onValueChange={value => setFormData({...formData, district: value})}>
                    <SelectTrigger><SelectValue placeholder="İlçe seçin" /></SelectTrigger>
                    <SelectContent>
                      {istanbulDistricts.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Konum Özeti</Label>
                  <Input id="location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Örn: Moda, Kadıköy" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Tam Açık Adres</Label>
                  <Input id="address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Caferağa Mah..." />
                </div>

                <div className="space-y-3 border-t pt-4">
                  <Label className="text-base font-semibold">Özellikler</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wifi" checked={tags.includes("wifi")} onCheckedChange={(c) => c ? setTags([...tags, "wifi"]) : setTags(tags.filter(t => t !== "wifi"))} />
                      <label htmlFor="wifi" className="text-sm">Wi-Fi Var</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vegan" checked={tags.includes("vegan")} onCheckedChange={(c) => c ? setTags([...tags, "vegan"]) : setTags(tags.filter(t => t !== "vegan"))} />
                      <label htmlFor="vegan" className="text-sm">Vegan Seçenekler</label>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor...</> : "Kafeyi Ekle"}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* KAFELERİN LİSTELENDİĞİ GRID YAPISI */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Veritabanında henüz hiç kafe yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shops.map((shop) => (
              <div key={shop.id} className="relative group">
                {/* Ana sayfadaki aynı CoffeeCard bileşeni */}
                <CoffeeCard shop={shop} />
                
                {/* Hover olunca üstünde beliren Silme Butonu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="shadow-lg hover:scale-105 transition-transform"
                    onClick={() => handleDelete(shop.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}
