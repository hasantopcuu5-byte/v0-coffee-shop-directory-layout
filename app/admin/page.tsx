"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { istanbulDistricts, getRemoteCoffeeShops, addRemoteCoffeeShop } from "@/lib/coffee-data"
import { db } from "@/lib/firebase"
import { doc, deleteDoc } from "firebase/firestore"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CoffeeCard } from "@/components/coffee-card"
import { toast } from "sonner"
import { Plus, Trash, Store, ArrowLeft, Save, Clock, Coffee, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react"

export default function AdminPage() {
  const [shops, setShops] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Hangi ekrandayız? 'list' (Kafelerim) veya 'editor' (Yeni Kafe Ekle / Tam Sayfa)
  const [view, setView] = useState<"list" | "editor">("list")

  // --- EDİTÖR STATE'LERİ ---
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: "Yeni Kafe Adı",
    address: "",
    district: "",
    neighborhood: "",
  })

  const [hours, setHours] = useState([
    { day: "Pazartesi", time: "08:00 - 20:00" },
    { day: "Salı", time: "08:00 - 20:00" },
    { day: "Çarşamba", time: "08:00 - 20:00" },
    { day: "Perşembe", time: "08:00 - 20:00" },
    { day: "Cuma", time: "08:00 - 21:00" },
    { day: "Cumartesi", time: "09:00 - 21:00" },
    { day: "Pazar", time: "09:00 - 20:00" }
  ])
  const [services, setServices] = useState<string[]>(["Espresso", "Filtre Kahve", "V60"])
  const [amenities, setAmenities] = useState<string[]>(["Wi-Fi", "Evcil Hayvan Dostu"])
  
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

  // Yeni Kafeyi Kaydet (Firebase hatası vermesin diye Ücretsiz ImgBB API kullanıyoruz)
  const handleSave = async () => {
    if (!formData.district || !formData.neighborhood) return toast.error("Lütfen İlçe ve Mahalle seçin!")
    if (imageFiles.length === 0) return toast.error("Lütfen en az 1 görsel seçin!")

    setIsSubmitting(true)
    try {
      // 1. Çoklu Resimleri ImgBB API'ye yükle
      const uploadPromises = imageFiles.map(async (file) => {
        const imgFormData = new FormData()
        imgFormData.append("image", file)
        
        // LÜTFEN KENDİ IMGBB API KEY'İNİZİ AŞAĞIDAKİ LİNKE YAPIŞTIRIN
        const res = await fetch("https://api.imgbb.com/1/upload?key=cd7f9a2c0e6848d8de8cdb2d763d8e07", {
          method: "POST",
          body: imgFormData
        })
        const data = await res.json()
        return data.data.url // ImgBB'den dönen gerçek ve güvenli URL
      })
      
      const uploadedUrls = await Promise.all(uploadPromises)

      // 2. Verileri Firebase veritabanına kaydet
      await addRemoteCoffeeShop({
        name: formData.name,
        image: uploadedUrls[0], // İlk resim kapak fotoğrafı
        images: uploadedUrls, // Tüm resimlerin listesi
        address: formData.address,
        location: `${formData.neighborhood}, ${formData.district}`,
        district: formData.district,
        tags: amenities.slice(0, 3), // İlk 3 imkanı tag yapalım
        services: services,
        amenities: amenities,
        hours: hours,
        coordinates: { lat: 41.0082, lng: 28.9784 }
      })

      toast.success("Kafe harika bir şekilde sisteme eklendi!")
      setView("list") // Listeleme ekranına dön
      loadShops()
      
      // Formu sıfırla
      setImageFiles([])
      setFormData({ name: "Yeni Kafe Adı", address: "", district: "", neighborhood: "" })
    } catch (error) {
      toast.error("Kaydedilirken hata oluştu. API Key'i kontrol edin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- 1. EKRAN: LİSTELEME GÖRÜNÜMÜ ---
  if (view === "list") {
    return (
      <div className="min-h-screen bg-background pb-12">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
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
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shops.map(shop => (
                <div key={shop.id} className="relative group">
                  <CoffeeCard shop={shop} />
                  <Button size="icon" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 z-10 transition-all" onClick={() => handleDelete(shop.id)}>
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

  // --- 2. EKRAN: WYSIWYG EDİTÖR GÖRÜNÜMÜ (TAM SAYFA) ---
  const availableNeighborhoods = formData.district ? istanbulNeighborhoods[formData.district] || [] : []

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Editör Üst Bar (Kaydet ve Geri Dön Tuşları) */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b p-4 mb-6 shadow-sm">
        <div className="mx-auto max-w-5xl flex justify-between items-center">
          <Button variant="ghost" onClick={() => setView("list")}><ArrowLeft className="mr-2 h-4 w-4"/> İptal ve Geri Dön</Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">Sayfayı kullanıcı gözünden tasarlıyorsunuz</span>
            <Button onClick={handleSave} disabled={isSubmitting} className="rounded-full px-8">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4"/>} 
              Mekanı Yayınla
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* BAŞLIK DÜZENLEME */}
        <div className="mb-8">
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="text-4xl md:text-5xl font-bold bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none w-full transition-colors pb-2 text-foreground"
            placeholder="Kafe Adını Girin..."
          />
        </div>

        {/* ÇOKLU GALERİ ALANI */}
        <div className="mb-10">
          <div className="bg-secondary/30 border-2 border-dashed border-border rounded-3xl p-12 text-center relative hover:bg-secondary/50 transition-colors">
            <input 
              type="file" multiple accept="image/*" 
              onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Görselleri Yüklemek İçin Tıklayın (Çoklu Seçim)</h3>
            <p className="text-sm text-muted-foreground mb-4">Birden fazla görsel seçebilirsiniz. Bu görseller detay sayfasında galeri olarak sergilenecektir.</p>
            {imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {imageFiles.map((file, i) => (
                  <span key={i} className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">{file.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LOKASYON BİLGİLERİ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-card p-6 rounded-3xl border shadow-sm">
          <div className="space-y-2">
            <Label className="text-muted-foreground">İlçe</Label>
            <Select value={formData.district} onValueChange={v => setFormData({...formData, district: v, neighborhood: ""})}>
              <SelectTrigger className="font-semibold text-base h-12"><SelectValue placeholder="İlçe Seç" /></SelectTrigger>
              <SelectContent>{istanbulDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Mahalle (İlçeye Göre)</Label>
            <Select value={formData.neighborhood} onValueChange={v => setFormData({...formData, neighborhood: v})} disabled={!formData.district}>
              <SelectTrigger className="font-semibold text-base h-12"><SelectValue placeholder="Mahalle Seç" /></SelectTrigger>
              <SelectContent>{availableNeighborhoods.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Açık Adres</Label>
            <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Sokak, No..." className="h-12 text-base" />
          </div>
        </div>

        {/* 3'LÜ BİLGİ KARTLARI (Çalışma Saatleri, Servisler, İmkanlar) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Card className="shadow-sm border rounded-2xl overflow-hidden">
            <CardHeader className="bg-secondary/30 pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2"><Clock className="text-primary h-5 w-5"/> Çalışma Saatleri</CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-3">
              {hours.map((h, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-border/40 pb-2.5 last:border-0">
                  <span className="font-medium text-muted-foreground">{h.day}</span>
                  <input 
                    type="text" value={h.time} 
                    onChange={(e) => { const newH = [...hours]; newH[i].time = e.target.value; setHours(newH); }}
                    className="w-28 text-right outline-none font-semibold bg-transparent focus:border-b-2 focus:border-primary px-1 transition-all"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border rounded-2xl overflow-hidden">
            <CardHeader className="bg-secondary/30 pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2"><Coffee className="text-primary h-5 w-5"/> Servisler</CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-3">
              {services.map((ser, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-foreground group">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="flex-1">{ser}</span>
                  <Trash className="h-4 w-4 text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setServices(services.filter((_, idx) => idx !== i))} />
                </div>
              ))}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                <Input value={newService} onChange={e => setNewService(e.target.value)} placeholder="Servis Ekle..." className="h-9 text-sm" />
                <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => {if(newService){setServices([...services, newService]); setNewService("");}}}><Plus className="h-4 w-4"/></Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border rounded-2xl overflow-hidden">
            <CardHeader className="bg-secondary/30 pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="text-primary h-5 w-5"/> İmkanlar</CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-3">
              {amenities.map((am, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-foreground group">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="flex-1">{am}</span>
                  <Trash className="h-4 w-4 text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setAmenities(amenities.filter((_, idx) => idx !== i))} />
                </div>
              ))}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                <Input value={newAmenity} onChange={e => setNewAmenity(e.target.value)} placeholder="İmkan Ekle..." className="h-9 text-sm" />
                <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => {if(newAmenity){setAmenities([...amenities, newAmenity]); setNewAmenity("");}}}><Plus className="h-4 w-4"/></Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
