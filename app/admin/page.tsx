"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { getRemoteCoffeeShops, addRemoteCoffeeShop } from "@/lib/coffee-data"
import { istanbulDistrictsList, istanbulNeighborhoods } from "@/lib/istanbul"
import { db, storage } from "@/lib/firebase"
import { doc, deleteDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CoffeeCard } from "@/components/coffee-card"
import { toast } from "sonner"
import { Plus, Trash, Store, ArrowLeft, Save, Clock, Coffee, Sparkles, ImagePlus, Loader2 } from "lucide-react"

export default function AdminPage() {
  const [shops, setShops] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 'list' (Kafelerim) veya 'editor' (Yeni Kafe Ekle - Tam Sayfa WYSIWYG)
  const [view, setView] = useState<"list" | "editor">("list")

  // --- EDİTÖR STATE'LERİ ---
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    neighborhood: "",
  })

  const [hours, setHours] = useState([
    { day: "Pazartesi", time: "08:00 - 22:00" },
    { day: "Salı", time: "08:00 - 22:00" },
    { day: "Çarşamba", time: "08:00 - 22:00" },
    { day: "Perşembe", time: "08:00 - 22:00" },
    { day: "Cuma", time: "08:00 - 23:00" },
    { day: "Cumartesi", time: "09:00 - 23:00" },
    { day: "Pazar", time: "09:00 - 21:00" }
  ])
  const [services, setServices] = useState<string[]>(["Espresso", "Filtre Kahve", "V60"])
  const [amenities, setAmenities] = useState<string[]>(["Wi-Fi", "Açık Alan", "Evcil Hayvan Dostu"])
  
  const [newService, setNewService] = useState("")
  const [newAmenity, setNewAmenity] = useState("")

  // Veritabanından Kafeleri Çek
  const loadShops = async () => {
    setIsLoading(true)
    try {
      const data = await getRemoteCoffeeShops()
      setShops(data)
    } catch (error) {
      toast.error("Kafeler yüklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadShops() }, [])

  // Kafe Sil
  const handleDelete = async (id: string) => {
    if (!confirm("Bu kafeyi silmek istediğinize emin misiniz?")) return
    try {
      await deleteDoc(doc(db, "coffeeShops", id))
      toast.success("Kafe silindi!")
      loadShops()
    } catch (error) {
      toast.error("Silinirken hata oluştu.")
    }
  }

  // Çoklu Resim Seçimi ve Önizleme
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles(files)
    
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

 // --- YENİ VE TEMİZ KAYDETME İŞLEMİ ---
  const handleSave = async () => {
    if (!formData.name) return toast.error("Lütfen kafe adını girin!")
    if (!formData.district || !formData.neighborhood) return toast.error("Lütfen İlçe ve Mahalle seçin!")
    if (imageFiles.length === 0) return toast.error("Lütfen en az 1 görsel seçin!")

    setIsSubmitting(true)
    const toastId = toast.loading("Adım 1/2: Görseller Firebase Storage'a yükleniyor...")
    
    try {
      // 1. Çoklu Resimleri Firebase Storage'a yükle
      const uploadPromises = imageFiles.map(async (file) => {
        const fileRef = ref(storage, "coffee-shops/" + Date.now() + "_" + file.name)
        await uploadBytes(fileRef, file)
        return getDownloadURL(fileRef)
      })
      
      const uploadedUrls = await Promise.all(uploadPromises)

      toast.loading("Adım 2/2: Mekan bilgileri Firestore'a kaydediliyor...", { id: toastId })

      // 2. Verileri Firebase Firestore veritabanına kaydet
      await addRemoteCoffeeShop({
        name: formData.name,
        image: uploadedUrls[0], 
        images: uploadedUrls, 
        address: formData.address,
        location: formData.neighborhood + ", " + formData.district,
        district: formData.district,
        tags: amenities.slice(0, 3), 
        services: services,
        amenities: amenities,
        hours: hours,
        coordinates: { lat: 41.0082, lng: 28.9784 }
      })

      toast.success("Mekan harika bir şekilde canlıya alındı!", { id: toastId })
      setView("list") 
      loadShops()
      
      // Formu sıfırla
      setImageFiles([])
      setImagePreviews([])
      setFormData({ name: "", address: "", district: "", neighborhood: "" })

    } catch (err: any) {
      console.error("Kayıt hatası:", err)
      toast.error("Yayınlama Başarısız: " + (err.message || "Bilinmeyen hata"), { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableNeighborhoods = formData.district ? istanbulNeighborhoods[formData.district] || [] : []

  // --- 1. EKRAN: LİSTELEME GÖRÜNÜMÜ ---
  if (view === "list") {
    return (
      <div className="min-h-screen bg-background pb-12">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b pb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2"><Store className="text-primary" /> Admin Paneli</h1>
              <p className="text-muted-foreground mt-1">Sistemdeki tüm kafeleri yönetin.</p>
            </div>
            <Button onClick={() => setView("editor")} className="rounded-full gap-2 px-6">
              <Plus className="h-5 w-5"/> Yeni Kafe Ekle
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : shops.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Store className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Veritabanında henüz hiç kafe yok.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shops.map(shop => (
                <div key={shop.id} className="relative group">
                  <CoffeeCard shop={shop} />
                  <Button size="icon" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 z-10 transition-all shadow-lg" onClick={() => handleDelete(shop.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    )
  }

  // --- 2. EKRAN: DETAY SAYFASI GİBİ GÖRÜNEN DÜZENLEYİCİ (TAM SAYFA) ---
  return (
    <div className="min-h-screen bg-background pb-20 font-sans">
      <Header />
      
      {/* Üst Sabit Kontrol Barı */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b p-4 mb-6 shadow-sm">
        <div className="mx-auto max-w-5xl flex justify-between items-center">
          <Button variant="ghost" onClick={() => setView("list")} className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4"/> İptal
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">Detay sayfasını canlı olarak tasarlıyorsunuz</span>
            <Button onClick={handleSave} disabled={isSubmitting} className="rounded-full px-8 font-semibold shadow-md">
              {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4"/>} 
              Mekanı Yayınla
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* BAŞLIK VE LOKASYON ALANI */}
        <div className="mb-6 space-y-4">
          <Input 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="text-3xl sm:text-4xl font-bold bg-transparent border-none shadow-none h-auto px-0 placeholder:text-muted-foreground/40 focus-visible:ring-0 text-foreground"
            placeholder="Kafenin Adını Yazın..."
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={formData.district} onValueChange={v => setFormData({...formData, district: v, neighborhood: ""})}>
              <SelectTrigger className="w-[180px] bg-secondary/50 border-0 font-medium"><SelectValue placeholder="İlçe Seç" /></SelectTrigger>
              <SelectContent>{istanbulDistrictsList.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
            
            <Select value={formData.neighborhood} onValueChange={v => setFormData({...formData, neighborhood: v})} disabled={!formData.district}>
              <SelectTrigger className="w-[180px] bg-secondary/50 border-0 font-medium"><SelectValue placeholder="Mahalle Seç" /></SelectTrigger>
              <SelectContent>{availableNeighborhoods.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
            </Select>

            <Input 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="flex-1 bg-secondary/50 border-0 italic placeholder:not-italic text-sm"
              placeholder="Sokak, Bina No, Açık Adres Girin..."
            />
          </div>
        </div>

        {/* DETAY SAYFASI TASARIMLI ÇOKLU RESİM ALANI */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-secondary/30 border-2 border-dashed border-border min-h-[340px] flex flex-col items-center justify-center group transition-colors hover:bg-secondary/50">
            <input 
              type="file" multiple accept="image/*" 
              onChange={handleImageSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            {imagePreviews.length === 0 ? (
              <div className="text-center p-8 pointer-events-none">
                <ImagePlus className="h-14 w-14 mx-auto text-muted-foreground/70 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Görselleri Sürükleyin veya Dosya Seçin</h3>
                <p className="text-sm text-muted-foreground mt-1">Sitedeki galeri düzeni için birden fazla fotoğraf seçebilirsiniz.</p>
              </div>
            ) : (
              <div className="w-full h-full p-4 pointer-events-none z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-full">
                  {imagePreviews.slice(0, 4).map((src, i) => (
                    <div key={i} className={`relative rounded-xl overflow-hidden shadow-sm ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"}`}>
                      <img src={src} alt="Önizleme" className="w-full h-full object-cover" />
                      {i === 3 && imagePreviews.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                          +{imagePreviews.length - 4} Fotoğraf
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3'LÜ BİLGİ KARTLARI (Çalışma Saatleri, Servisler, İmkanlar) */}
        <section className="mb-10 grid gap-6 sm:grid-cols-3">
          
          {/* Çalışma Saatleri */}
          <div className="rounded-2xl bg-card p-5 shadow-xs ring-1 ring-border">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Çalışma Saatleri</h3>
            </div>
            <ul className="space-y-2">
              {hours.map((h, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-muted-foreground font-medium">{h.day}</span>
                  <input 
                    type="text" value={h.time} 
                    onChange={(e) => { const newH = [...hours]; newH[i].time = e.target.value; setHours(newH); }}
                    className="w-28 text-right outline-none font-semibold bg-transparent border-b border-transparent focus:border-primary px-1 transition-all"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Servisler */}
          <div className="rounded-2xl bg-card p-5 shadow-xs ring-1 ring-border">
            <div className="mb-4 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Servisler</h3>
            </div>
            <ul className="space-y-2.5">
              {services.map((ser, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground group">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="flex-1 font-medium">{ser}</span>
                  <Trash className="h-3 w-3 text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-all" onClick={() => setServices(services.filter((_, idx) => idx !== i))} />
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
              <Input value={newService} onChange={e => setNewService(e.target.value)} placeholder="Servis ekle..." className="h-8 text-xs bg-secondary/50 border-0 focus-visible:ring-1" />
              <Button size="icon" variant="secondary" className="h-8 w-8 shrink-0" onClick={() => {if(newService){setServices([...services, newService]); setNewService("");}}}><Plus className="h-4 w-4"/></Button>
            </div>
          </div>

          {/* İmkanlar */}
          <div className="rounded-2xl bg-card p-5 shadow-xs ring-1 ring-border">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">İmkanlar</h3>
            </div>
            <ul className="space-y-2.5">
              {amenities.map((am, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground group">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="flex-1 font-medium">{am}</span>
                  <Trash className="h-3 w-3 text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-all" onClick={() => setAmenities(amenities.filter((_, idx) => idx !== i))} />
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
              <Input value={newAmenity} onChange={e => setNewAmenity(e.target.value)} placeholder="İmkan ekle..." className="h-8 text-xs bg-secondary/50 border-0 focus-visible:ring-1" />
              <Button size="icon" variant="secondary" className="h-8 w-8 shrink-0" onClick={() => {if(newAmenity){setAmenities([...amenities, newAmenity]); setNewAmenity("");}}}><Plus className="h-4 w-4"/></Button>
            </div>
          </div>

        </section>

      </main>
    </div>
  )
}
