"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Coffee, 
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Quote,
  MessageSquarePlus,
  ThumbsUp,
  Award
} from "lucide-react"
import { getCoffeeShopById, type CoffeeShop, type Review } from "@/lib/coffee-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PageTransition } from "@/components/page-transition"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

// Genişletilmiş Yorum Tipi (Yeni özellikler için)
interface ExtendedReview extends Review {
  helpfulCount?: number
  badge?: string
  categoryRatings?: { coffee: number, ambiance: number, hospitality: number }
}

function ImageGallery({ images, shopName }: { images: string[], shopName: string }) {
  const [showModal, setShowModal] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const displayImages = images.slice(0, 4)
  const hasMorePhotos = images.length > 4

  return (
    <>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {displayImages.map((img, index) => (
          <div 
            key={index} 
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer",
              index === 0 && "col-span-2 row-span-2 aspect-square"
            )}
            onClick={() => {
              setCurrentIndex(index)
              setShowModal(true)
            }}
          >
            <img 
              src={img} 
              alt={`${shopName} - ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {index === 3 && hasMorePhotos && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-colors hover:bg-black/60">
                <span className="text-lg font-semibold text-white">
                  +{images.length - 4} Daha Fazla
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <X className="h-6 w-6" />
          </button>
          <button onClick={() => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)} className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img src={images[currentIndex]} alt={`${shopName} - ${currentIndex + 1}`} className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain" referrerPolicy="no-referrer" />
          <button onClick={() => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)} className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

function RatingDisplay({ rating, reviewCount }: { rating: number, reviewCount: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="text-5xl font-bold text-foreground">{rating.toFixed(1)}</div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "h-6 w-6",
              i < fullStars 
                ? "fill-primary text-primary" 
                : i === fullStars && hasHalfStar 
                  ? "fill-primary/50 text-primary" 
                  : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <p className="text-muted-foreground">{reviewCount} değerlendirme</p>
    </div>
  )
}

function ReviewCarousel({ reviews, onShowAll, helpfulVotes, onHelpfulToggle }: { reviews: ExtendedReview[], onShowAll: () => void, helpfulVotes: Record<number, boolean>, onHelpfulToggle: (id: number) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isHovered && reviews.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % reviews.length)
      }, 5000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovered, reviews.length])

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground bg-card rounded-2xl ring-1 ring-border shadow-sm">
        Henüz değerlendirme yapılmamış. İlk yorumu siz yapın!
      </div>
    )
  }

  const currentReview = reviews[currentIndex]
  const isHelpful = helpfulVotes[currentReview.id]

  return (
    <div className="space-y-4" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative min-h-[180px] overflow-hidden rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border flex flex-col justify-between">
        <Quote className="absolute right-4 top-4 h-8 w-8 text-muted/30" />
        
        <div className="flex items-start gap-4">
          <img src={currentReview.avatar || "/placeholder-avatar.svg"} alt={currentReview.author} className="h-12 w-12 rounded-full object-cover ring-2 ring-secondary" referrerPolicy="no-referrer" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{currentReview.author}</h4>
                {currentReview.badge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-[10px] font-bold">
                    <Award className="h-3 w-3" />
                    {currentReview.badge}
                  </span>
                )}
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < currentReview.rating ? "fill-primary text-primary" : "fill-muted text-muted")} />
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(currentReview.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="mt-3 text-foreground leading-relaxed">{currentReview.comment}</p>
          </div>
        </div>

        {/* Yararlı Butonu */}
        <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
          <button 
            onClick={() => onHelpfulToggle(currentReview.id)}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors",
              isHelpful ? "bg-primary/10 text-primary" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            )}
          >
            <ThumbsUp className={cn("h-3.5 w-3.5", isHelpful && "fill-primary text-primary")} />
            Yararlı ({ (currentReview.helpfulCount || 0) + (isHelpful ? 1 : 0) })
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {reviews.slice(0, 5).map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)} className={cn("h-2 rounded-full transition-all", i === currentIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30")} />
          ))}
        </div>
        <Button variant="ghost" onClick={onShowAll} className="text-primary hover:text-primary/80">
          Tüm Yorumları Gör ({reviews.length})
        </Button>
      </div>
    </div>
  )
}

function AllReviewsModal({ reviews, isOpen, onClose, helpfulVotes, onHelpfulToggle }: { reviews: ExtendedReview[], isOpen: boolean, onClose: () => void, helpfulVotes: Record<number, boolean>, onHelpfulToggle: (id: number) => void }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-background border border-border shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background p-4 z-10">
          <h3 className="text-xl font-bold text-foreground">Tüm Yorumlar ({reviews.length})</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
        </div>
        
        <div className="max-h-[calc(85vh-60px)] overflow-y-auto p-4">
          <div className="space-y-4">
            {reviews.map(review => {
              const isHelpful = helpfulVotes[review.id]
              return (
                <div key={review.id} className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
                  <div className="flex items-start gap-4">
                    <img src={review.avatar || "/placeholder-avatar.svg"} alt={review.author} className="h-10 w-10 rounded-full object-cover ring-2 ring-secondary" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{review.author}</h4>
                          {review.badge && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-[10px] font-bold">
                              <Award className="h-3 w-3" />
                              {review.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {new Date(review.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="mt-3 text-foreground leading-relaxed">{review.comment}</p>
                      
                      <div className="mt-3 pt-3 flex justify-start">
                        <button 
                          onClick={() => onHelpfulToggle(review.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors",
                            isHelpful ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground"
                          )}
                        >
                          <ThumbsUp className={cn("h-3.5 w-3.5", isHelpful && "fill-primary text-primary")} />
                          Yararlı ({ (review.helpfulCount || 0) + (isHelpful ? 1 : 0) })
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function AddReviewModal({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (ratings: { coffee: number, ambiance: number, hospitality: number }, comment: string) => void }) {
  const [coffee, setCoffee] = useState(0)
  const [ambiance, setAmiance] = useState(0)
  const [hospitality, setHospitality] = useState(0)
  const [comment, setComment] = useState("")

  if (!isOpen) return null

  // Filtrelenecek kelime havuzu
  const bannedWords = ["küfür1", "argo2", "salak", "aptal", "gerizekalı", "şerefsiz", "kötü"] 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (coffee === 0 || ambiance === 0 || hospitality === 0) {
      toast.error("Lütfen tüm kategorileri puanlayın!")
      return
    }

    const checkText = comment.toLowerCase()
    const hasBannedWord = bannedWords.some(word => checkText.includes(word))

    if (hasBannedWord) {
      toast.error("Yorumunuz topluluk kurallarına aykırı kelimeler içeriyor. Lütfen düzenleyin.")
      return
    }

    onSubmit({ coffee, ambiance, hospitality }, comment)
    setCoffee(0); setAmiance(0); setHospitality(0); setComment("")
    onClose()
  }

  const StarSelector = ({ value, onChange, label }: { value: number, onChange: (val: number) => void, label: string }) => (
    <div className="flex flex-col gap-1.5 py-3 border-b border-border/50 last:border-0">
      <span className="text-sm font-semibold text-foreground/90">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer">
            <Star className={cn("h-8 w-8 transition-colors", star <= value ? "fill-primary text-primary" : "text-muted fill-muted/20 hover:text-primary/40")} />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-background border border-border shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MessageSquarePlus className="h-6 w-6 text-primary" />
            Deneyimini Puanla
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <StarSelector label="1. Kahve Tadı ve Kalitesi" value={coffee} onChange={setCoffee} />
          <StarSelector label="2. Mekan Ambiyansı ve Ortam" value={ambiance} onChange={setAmiance} />
          <StarSelector label="3. Misafirperverlik ve Servis" value={hospitality} onChange={setHospitality} />

          <div className="space-y-2 pt-4">
            <label className="text-sm font-semibold text-foreground/90">Yorumunuz (İsteğe Bağlı)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Detaylı yorumlar diğer kahve severlere daha çok yardımcı olur..."
              className="w-full min-h-[100px] rounded-xl border border-border bg-secondary/30 p-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              maxLength={500}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full px-6">
              İptal
            </Button>
            <Button type="submit" className="rounded-full bg-primary text-primary-foreground font-semibold px-8 shadow-md">
              Değerlendirmeyi Gönder
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MapEmbed({ coordinates, name }: { coordinates: { lat: number, lng: number }, name: string }) {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-border">
      <div className="relative aspect-[16/9] w-full bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
          <div className="absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 bg-background/60" />
          <div className="absolute bottom-0 left-1/3 top-0 w-3 bg-background/60" />
          <div className="absolute bottom-0 right-1/4 top-0 w-2 bg-background/40" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-primary shadow-lg flex items-center justify-center">
                <Coffee className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-primary" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{name}</span>
          </div>
          <a href={`http://googleusercontent.com/maps.google.com/3{coordinates.lat},${coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            Google Maps'te Aç <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CoffeeShopDetailPage() {
  const params = useParams()
  
  const [shop, setShop] = useState<CoffeeShop | null>(null)
  
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showAddReview, setShowAddReview] = useState(false)
  
  // Yararlı butonları için state
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({})
  
  const { user } = useAuth()

  useEffect(() => {
    const id = Number(params.id)
    const foundShop = getCoffeeShopById(id)
    if (foundShop) {
      setShop({ ...foundShop, userReviews: [...foundShop.userReviews] })
    }
  }, [params.id])

  const toggleHelpful = (reviewId: number) => {
    setHelpfulVotes(prev => ({ ...prev, [reviewId]: !prev[reviewId] }))
  }

  const handleAddReviewSubmit = (ratings: { coffee: number, ambiance: number, hospitality: number }, comment: string) => {
    if (!shop || !user) return

    const reviewAvgRating = (ratings.coffee + ratings.ambiance + ratings.hospitality) / 3
    
    // 1. Yorum Ağırlığı Faktörü (100 karakterden uzunsa %100 etki, kısaysa %50 etki)
    const isDetailed = comment.trim().length > 100
    const weight = isDetailed ? 1 : 0.5

    // 2. Kullanıcı Katkı Seviyesi Rozeti
    const userBadge = isDetailed ? "Kahve Gurmesi" : "Mekan Kaşifi"

    const newReview: ExtendedReview = {
      id: Date.now(),
      author: user.displayName || "Mekan Kaşifi",
      avatar: user.photoURL || "/placeholder-avatar.svg",
      rating: Math.round(reviewAvgRating * 10) / 10,
      date: new Date().toISOString().split('T')[0],
      comment: comment.trim() || "Puanlama yapıldı.",
      badge: userBadge,
      helpfulCount: 0,
      categoryRatings: ratings
    }

    // Google Tarzı Ağırlıklı Ortalama Hesaplama
    const totalExistingReviews = shop.reviews
    const currentGlobalRating = shop.rating
    
    // Basit bir kümülatif formül: (Mevcut Toplam Puan + Yeni Ağırlıklı Puan) / (Toplam Sayı + Ağırlık)
    const assumedTotalWeight = totalExistingReviews * 0.8 // Eski yorumların ortalama ağırlığı kabulü
    const newGlobalRating = ((currentGlobalRating * assumedTotalWeight) + (reviewAvgRating * weight)) / (assumedTotalWeight + weight)

    setShop({
      ...shop,
      rating: Math.round(newGlobalRating * 10) / 10,
      reviews: totalExistingReviews + 1,
      userReviews: [newReview, ...shop.userReviews]
    })

    toast.success(isDetailed ? "Detaylı harika yorumunuz eklendi! 'Kahve Gurmesi' rozeti kazandınız." : "Değerlendirmeniz başarıyla eklendi!")
  }

  if (!shop) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Kahveci Bulunamadı</h1>
            <Link href="/" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background font-sans">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="font-medium text-foreground line-clamp-1">{shop.name}</span>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{shop.name}</h1>
            <p className="mt-2 text-lg italic text-muted-foreground">{shop.address}</p>
          </div>

          <section className="mb-10">
            <ImageGallery images={shop.images} shopName={shop.name} />
          </section>

          <section className="mb-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Çalışma Saatleri</h3>
              </div>
              <ul className="space-y-2">
                {shop.hours.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">{item.day}</span>
                    <span className={cn("font-medium", item.time === "Kapalı" ? "text-destructive" : "text-foreground")}>{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
              <div className="mb-4 flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Servisler</h3>
              </div>
              <ul className="space-y-2.5">
                {shop.services.map((service, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />{service}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">İmkanlar</h3>
              </div>
              <ul className="space-y-2.5">
                {shop.amenities.map((amenity, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />{amenity}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" /> Mekan Puanı
            </h2>
            {/* Orijinal basit tasarıma geri dönüldü */}
            <RatingDisplay rating={shop.rating} reviewCount={shop.reviews} />
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Quote className="h-5 w-5 text-primary" /> Ziyaretçi Yorumları
            </h2>
            <ReviewCarousel reviews={shop.userReviews} onShowAll={() => setShowAllReviews(true)} helpfulVotes={helpfulVotes} onHelpfulToggle={toggleHelpful} />
            
            {user ? (
              <div className="flex justify-center pt-4">
                <button onClick={() => setShowAddReview(true)} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md active:scale-95 cursor-pointer">
                  <MessageSquarePlus className="h-4 w-4" /> Değerlendirme Ekle
                </button>
              </div>
            ) : (
              <div className="text-center pt-4 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-xl">
                Değerlendirme yapabilmek için lütfen önce <Link href="/" className="text-primary hover:underline font-medium">giriş yapın</Link>.
              </div>
            )}
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground">Konum</h2>
            <MapEmbed coordinates={shop.coordinates} name={shop.name} />
          </section>
        </main>

        <AllReviewsModal reviews={shop.userReviews} isOpen={showAllReviews} onClose={() => setShowAllReviews(false)} helpfulVotes={helpfulVotes} onHelpfulToggle={toggleHelpful} />
        <AddReviewModal isOpen={showAddReview} onClose={() => setShowAddReview(false)} onSubmit={handleAddReviewSubmit} />
      </div>
    </PageTransition>
  )
}