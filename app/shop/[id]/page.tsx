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
  Quote
} from "lucide-react"
import { getCoffeeShopById, type CoffeeShop, type Review } from "@/lib/coffee-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

      {/* Photo Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button 
            onClick={() => setShowModal(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          
          <button 
            onClick={() => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <img 
            src={images[currentIndex]} 
            alt={`${shopName} - ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
          />
          
          <button 
            onClick={() => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
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

function ReviewCarousel({ reviews, onShowAll }: { reviews: Review[], onShowAll: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isHovered && reviews.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % reviews.length)
      }, 4000)
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovered, reviews.length])

  const currentReview = reviews[currentIndex]

  return (
    <div 
      className="space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative min-h-[180px] overflow-hidden rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <Quote className="absolute right-4 top-4 h-8 w-8 text-muted/30" />
        
        <div className="flex items-start gap-4">
          <img 
            src={currentReview.avatar} 
            alt={currentReview.author}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">{currentReview.author}</h4>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-4 w-4",
                      i < currentReview.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(currentReview.date).toLocaleDateString('tr-TR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="mt-3 text-foreground leading-relaxed">{currentReview.comment}</p>
          </div>
        </div>
      </div>
      
      {/* Indicators */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {reviews.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === currentIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
        
        <Button variant="ghost" onClick={onShowAll} className="text-primary hover:text-primary/80">
          Tüm Yorumları Gör ({reviews.length})
        </Button>
      </div>
    </div>
  )
}

function AllReviewsModal({ reviews, isOpen, onClose }: { reviews: Review[], isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-background">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background p-4">
          <h3 className="text-xl font-bold text-foreground">Tüm Yorumlar ({reviews.length})</h3>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="max-h-[calc(85vh-60px)] overflow-y-auto p-4">
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
                <div className="flex items-start gap-4">
                  <img 
                    src={review.avatar} 
                    alt={review.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">{review.author}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "h-3.5 w-3.5",
                              i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('tr-TR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="mt-2 text-foreground">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MapEmbed({ coordinates, name }: { coordinates: { lat: number, lng: number }, name: string }) {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${coordinates.lat},${coordinates.lng}&zoom=15`
  
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-border">
      <div className="relative aspect-[16/9] w-full bg-muted">
        {/* Static map placeholder with styled design */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px),
                             linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
          
          {/* Roads */}
          <div className="absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 bg-background/60" />
          <div className="absolute bottom-0 left-1/3 top-0 w-3 bg-background/60" />
          <div className="absolute bottom-0 right-1/4 top-0 w-2 bg-background/40" />
          
          {/* Center pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-primary shadow-lg flex items-center justify-center">
                <Coffee className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-primary" />
            </div>
          </div>
        </div>
        
        {/* Overlay with location info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{name}</span>
          </div>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Google Maps&apos;te Aç
            <ChevronRight className="h-4 w-4" />
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

  useEffect(() => {
    const id = Number(params.id)
    const foundShop = getCoffeeShopById(id)
    setShop(foundShop || null)
  }, [params.id])

  if (!shop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Kahveci Bulunamadı</h1>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4">
          <Link 
            href="/" 
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-medium text-foreground line-clamp-1">{shop.name}</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Title & Address */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{shop.name}</h1>
          <p className="mt-2 text-lg italic text-muted-foreground">{shop.address}</p>
        </div>

        {/* Image Gallery */}
        <section className="mb-10">
          <ImageGallery images={shop.images} shopName={shop.name} />
        </section>

        {/* Info Columns */}
        <section className="mb-10 grid gap-6 sm:grid-cols-3">
          {/* Hours */}
          <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Çalışma Saatleri</h3>
            </div>
            <ul className="space-y-2">
              {shop.hours.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.day}</span>
                  <span className={cn(
                    "font-medium",
                    item.time === "Kapalı" ? "text-destructive" : "text-foreground"
                  )}>{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-4 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Servisler</h3>
            </div>
            <ul className="space-y-2">
              {shop.services.map((service, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Amenities */}
          <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">İmkanlar</h3>
            </div>
            <ul className="space-y-2">
              {shop.amenities.map((amenity, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Rating */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">Kullanıcı Puanı</h2>
          <RatingDisplay rating={shop.rating} reviewCount={shop.reviews} />
        </section>

        {/* Reviews */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">Yorumlar</h2>
          <ReviewCarousel reviews={shop.userReviews} onShowAll={() => setShowAllReviews(true)} />
        </section>

        {/* Map */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">Konum</h2>
          <MapEmbed coordinates={shop.coordinates} name={shop.name} />
        </section>
      </main>

      {/* All Reviews Modal */}
      <AllReviewsModal 
        reviews={shop.userReviews} 
        isOpen={showAllReviews} 
        onClose={() => setShowAllReviews(false)} 
      />
    </div>
  )
}
