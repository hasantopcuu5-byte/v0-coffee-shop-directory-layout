"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { istanbulDistricts, addRemoteCoffeeShop } from "@/lib/coffee-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Plus, Trash, Store } from "lucide-react"

export default function AdminPage() {
  const [isSubmitting, setIsSaving] = useState(false)
  
  // Form Alanları State Yapısı
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    address: "",
    location: "", // örn: "Moda, Kadıköy"
    district: "",
    lat: "41.0082",
    lng: "28.9784"
  })

  // Etiketler ve Hizmetler State
  const [tags, setTags] = useState<string[]>([]) // wifi, vegan, pet
  const [services, setServices] = useState<string[]>(["Espresso", "Filter Coffee"])
  const [amenities, setAmenities] = useState<string[]>(["Wi-Fi"])

  // Dinamik Alanlar için Geçici Input Stateleri (Örn yeni hizmet ekleme)
  const [newService, setNewService] = useState("")
  const [newAmenity, setNewAmenity] = useState("")

  // Çalışma Saatleri Varsayılan Şablon
  const [hours, setHours] = useState([
    { day: "Pazartesi", time: "08:00 - 22:00" },
    { day: "Salı", time: "08:00 - 22:00" },
    { day: "Çarşamba", time: "08:00 - 22:00" },
    { day: "Perşembe", time: "08:00 - 22:00" },
    { day: "Cuma", time: "08:00 - 23:00" },
    { day: "Cumartesi", time: "09:00 - 23:00" },
    { day: "Pazar", time: "09:00 - 22:00" }
  ])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.district) {
      toast.error("Lütfen bir ilçe seçin!")
      return
    }

    setIsSaving(true)
    try {
      await addRemoteCoffeeShop({
        name: formData.name,
        image: formData.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
        images: [formData.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"],
        address: formData.address,
        location: formData.location,
        district: formData.district,
        tags: tags,
        services: services,
        amenities: amenities,
        hours: hours,
        coordinates: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        }
      })

      toast.success("Yeni kafe başarıyla Firestore veritabanına eklendi!")
      // Formu sıfırla
      setFormData({ name: "", image: "", address: "", location: "", district: "", lat: "41.0082", lng: "28.9784" })
      setTags([])
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen konsolu kontrol edin.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="shadow-md">
          <CardHeader className="border-b border-border pb-4 mb-6">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" /> Admin Yönetim Paneli
            </CardTitle>
            <CardDescription>Buradan eklediğiniz kafeler anında canlı veritabanına kaydedilir.</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Kafe Adı */}
              <div className="space-y-2">
                <Label htmlFor="name">Kafe Adı</Label>
                <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Örn: Brew Lab" />
              </div>

              {/* Fotoğraf Linki */}
              <div className="space-y-2">
                <Label htmlFor="image">Görsel URL (Unsplash vb.)</Label>
                <Input id="image" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." />
              </div>

              {/* İlçe Seçimi */}
              <div className="space-y-2">
                <Label>İstanbul İlçesi</Label>
                <Select value={formData.district} onValueChange={value => setFormData({...formData, district: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="İlçe seçin" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {istanbulDistricts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Konum Özeti ve Açık Adres */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Konum Özeti</Label>
                  <Input id="location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Örn: Moda, Kadıköy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Tam Açık Adres</Label>
                  <Input id="address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Caferağa Mah..." />
                </div>
              </div>

              {/* Koordinatlar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Enlem (Latitude)</Label>
                  <Input id="lat" type="number" step="any" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Boylam (Longitude)</Label>
                  <Input id="lng" type="number" step="any" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} />
                </div>
              </div>

              {/* Filtre Etiketleri (Tags Overlay) */}
              <div className="space-y-3 border-t pt-4">
                <Label className="text-base font-semibold">Filtre Özellikleri</Label>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="wifi" checked={tags.includes("wifi")} onCheckedChange={(checked) => checked ? setTags([...tags, "wifi"]) : setTags(tags.filter(t => t !== "wifi"))} />
                    <label htmlFor="wifi" className="text-sm font-medium">Wi-Fi Var</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="vegan" checked={tags.includes("vegan")} onCheckedChange={(checked) => checked ? setTags([...tags, "vegan"]) : setTags(tags.filter(t => t !== "vegan"))} />
                    <label htmlFor="vegan" className="text-sm font-medium">Vegan Süt / Seçenekler</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pet" checked={tags.includes("pet")} onCheckedChange={(checked) => checked ? setTags([...tags, "pet"]) : setTags(tags.filter(t => t !== "pet"))} />
                    <label htmlFor="pet" className="text-sm font-medium">Pet Friendly (Hayvan Dostu)</label>
                  </div>
                </div>
              </div>

              {/* Dinamik Hizmet (Services) Listesi */}
              <div className="space-y-2 border-t pt-4">
                <Label className="text-base font-semibold">Sunulan Kahveler / Servisler</Label>
                <div className="flex gap-2">
                  <Input value={newService} onChange={e => setNewService(e.target.value)} placeholder="Örn: Cold Brew, V60" />
                  <Button type="button" onClick={() => { if(newService) { setServices([...services, newService]); setNewService(""); } }} variant="outline"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {services.map((ser, index) => (
                    <span key={index} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full">
                      {ser} <Trash className="h-3 w-3 text-destructive cursor-pointer" onClick={() => setServices(services.filter((_, i) => i !== index))} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Kaydet Butonu */}
              <div className="flex justify-end pt-6 border-t border-border">
                <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary text-primary-foreground font-medium px-8 shadow-sm">
                  {isSubmitting ? "Firestore'a Kaydediliyor..." : "Mekanı Canlıya Ekle"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
