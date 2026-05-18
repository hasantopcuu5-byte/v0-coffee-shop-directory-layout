export interface Review {
  id: number
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
}

export interface CoffeeShop {
  id: number
  name: string
  image: string
  images: string[]
  rating: number
  reviews: number
  location: string
  address: string
  tags: string[]
  hours: {
    day: string
    time: string
  }[]
  services: string[]
  amenities: string[]
  userReviews: Review[]
  coordinates: {
    lat: number
    lng: number
  }
}

export const coffeeShops: CoffeeShop[] = [
  {
    id: 1,
    name: "The Roasted Bean",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
    ],
    rating: 4.8,
    reviews: 324,
    location: "123 Main St, Downtown",
    address: "123 Main Street, Downtown District, Istanbul 34000",
    tags: ["wifi", "vegan"],
    hours: [
      { day: "Pazartesi", time: "07:00 - 22:00" },
      { day: "Salı", time: "07:00 - 22:00" },
      { day: "Çarşamba", time: "07:00 - 22:00" },
      { day: "Perşembe", time: "07:00 - 22:00" },
      { day: "Cuma", time: "07:00 - 23:00" },
      { day: "Cumartesi", time: "08:00 - 23:00" },
      { day: "Pazar", time: "08:00 - 21:00" },
    ],
    services: ["Espresso", "Pour Over", "Cold Brew", "Latte Art", "Pastane"],
    amenities: ["Wi-Fi", "Elektrik Prizi", "Vegan Seçenekler", "Açık Alan", "Klima"],
    coordinates: { lat: 41.0082, lng: 28.9784 },
    userReviews: [
      { id: 1, author: "Ahmet Y.", avatar: "https://i.pravatar.cc/100?img=1", rating: 5, date: "2024-01-15", comment: "Harika bir mekan! Kahveleri gerçekten çok lezzetli ve personel çok ilgili." },
      { id: 2, author: "Elif K.", avatar: "https://i.pravatar.cc/100?img=2", rating: 4, date: "2024-01-10", comment: "Atmosfer çok güzel, çalışmak için ideal bir ortam. Wi-Fi hızı da gayet iyi." },
      { id: 3, author: "Mehmet S.", avatar: "https://i.pravatar.cc/100?img=3", rating: 5, date: "2024-01-05", comment: "En sevdiğim kahveci! Cold brew tarifleri muhteşem." },
      { id: 4, author: "Zeynep A.", avatar: "https://i.pravatar.cc/100?img=4", rating: 5, date: "2023-12-28", comment: "Vegan süt alternatifleri çok başarılı. Yulaf sütlü latte favorim oldu." },
      { id: 5, author: "Can D.", avatar: "https://i.pravatar.cc/100?img=5", rating: 4, date: "2023-12-20", comment: "Fiyatlar biraz yüksek ama kalite buna değiyor." },
    ],
  },
  {
    id: 2,
    name: "Artisan Coffee Lab",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
    ],
    rating: 4.9,
    reviews: 512,
    location: "456 Oak Ave, Midtown",
    address: "456 Oak Avenue, Midtown, Istanbul 34100",
    tags: ["wifi", "pet"],
    hours: [
      { day: "Pazartesi", time: "06:30 - 21:00" },
      { day: "Salı", time: "06:30 - 21:00" },
      { day: "Çarşamba", time: "06:30 - 21:00" },
      { day: "Perşembe", time: "06:30 - 21:00" },
      { day: "Cuma", time: "06:30 - 22:00" },
      { day: "Cumartesi", time: "07:00 - 22:00" },
      { day: "Pazar", time: "07:00 - 20:00" },
    ],
    services: ["Specialty Coffee", "V60", "Chemex", "Aeropress", "Kahvaltı"],
    amenities: ["Wi-Fi", "Evcil Hayvan Dostu", "Kitaplık", "Toplantı Odası"],
    coordinates: { lat: 41.0122, lng: 28.9760 },
    userReviews: [
      { id: 1, author: "Selin M.", avatar: "https://i.pravatar.cc/100?img=6", rating: 5, date: "2024-01-18", comment: "Şehirdeki en iyi specialty coffee deneyimi! Barista gerçekten işinin ehli." },
      { id: 2, author: "Burak T.", avatar: "https://i.pravatar.cc/100?img=7", rating: 5, date: "2024-01-12", comment: "V60 kahveleri mükemmel. Kahve çeşitleri çok zengin." },
      { id: 3, author: "Ayşe N.", avatar: "https://i.pravatar.cc/100?img=8", rating: 4, date: "2024-01-08", comment: "Köpeğimle gelebildiğim için çok mutluyum. Personel çok anlayışlı." },
      { id: 4, author: "Emre K.", avatar: "https://i.pravatar.cc/100?img=9", rating: 5, date: "2024-01-02", comment: "Toplantılarımı burada yapıyorum. Sessiz ve profesyonel bir ortam." },
    ],
  },
  {
    id: 3,
    name: "Morning Glory Cafe",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    ],
    rating: 4.6,
    reviews: 198,
    location: "789 Elm St, Westside",
    address: "789 Elm Street, Westside, Istanbul 34200",
    tags: ["vegan", "pet"],
    hours: [
      { day: "Pazartesi", time: "08:00 - 20:00" },
      { day: "Salı", time: "08:00 - 20:00" },
      { day: "Çarşamba", time: "08:00 - 20:00" },
      { day: "Perşembe", time: "08:00 - 20:00" },
      { day: "Cuma", time: "08:00 - 21:00" },
      { day: "Cumartesi", time: "09:00 - 21:00" },
      { day: "Pazar", time: "09:00 - 19:00" },
    ],
    services: ["Organic Coffee", "Vegan Pastane", "Smoothie", "Brunch"],
    amenities: ["Evcil Hayvan Dostu", "Vegan Menü", "Bahçe", "Çocuk Dostu"],
    coordinates: { lat: 41.0050, lng: 28.9800 },
    userReviews: [
      { id: 1, author: "Deniz A.", avatar: "https://i.pravatar.cc/100?img=10", rating: 5, date: "2024-01-16", comment: "Vegan seçenekleri harika! Sonunda düzgün bitki bazlı süt bulan bir yer." },
      { id: 2, author: "Gizem Y.", avatar: "https://i.pravatar.cc/100?img=11", rating: 4, date: "2024-01-11", comment: "Bahçesi çok güzel, yaz aylarında mutlaka gelin." },
      { id: 3, author: "Kerem B.", avatar: "https://i.pravatar.cc/100?img=12", rating: 5, date: "2024-01-06", comment: "Brunch menüsü mükemmel. Her hafta sonu geliyoruz." },
    ],
  },
  {
    id: 4,
    name: "Brew & Beyond",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    ],
    rating: 4.7,
    reviews: 267,
    location: "321 Pine Rd, Eastside",
    address: "321 Pine Road, Eastside District, Istanbul 34300",
    tags: ["wifi"],
    hours: [
      { day: "Pazartesi", time: "07:00 - 23:00" },
      { day: "Salı", time: "07:00 - 23:00" },
      { day: "Çarşamba", time: "07:00 - 23:00" },
      { day: "Perşembe", time: "07:00 - 23:00" },
      { day: "Cuma", time: "07:00 - 00:00" },
      { day: "Cumartesi", time: "08:00 - 00:00" },
      { day: "Pazar", time: "08:00 - 22:00" },
    ],
    services: ["Single Origin", "Espresso", "Nitro Coffee", "Cocktail Coffee"],
    amenities: ["Wi-Fi", "Elektrik Prizi", "Gece Açık", "Canlı Müzik"],
    coordinates: { lat: 41.0100, lng: 28.9850 },
    userReviews: [
      { id: 1, author: "Ozan K.", avatar: "https://i.pravatar.cc/100?img=13", rating: 5, date: "2024-01-17", comment: "Gece geç saatlere kadar açık olması büyük avantaj. Nitro coffee muhteşem!" },
      { id: 2, author: "Pınar S.", avatar: "https://i.pravatar.cc/100?img=14", rating: 4, date: "2024-01-13", comment: "Cuma akşamları canlı müzik var, atmosfer harika oluyor." },
      { id: 3, author: "Tolga M.", avatar: "https://i.pravatar.cc/100?img=15", rating: 5, date: "2024-01-09", comment: "Single origin kahveleri çok kaliteli. Fiyat/performans oranı çok iyi." },
      { id: 4, author: "Seda E.", avatar: "https://i.pravatar.cc/100?img=16", rating: 4, date: "2024-01-04", comment: "Cocktail coffee konsepti ilginç ve lezzetli." },
    ],
  },
  {
    id: 5,
    name: "The Coffee Collective",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    ],
    rating: 4.5,
    reviews: 143,
    location: "654 Cedar Ln, Northside",
    address: "654 Cedar Lane, Northside, Istanbul 34400",
    tags: ["wifi", "vegan", "pet"],
    hours: [
      { day: "Pazartesi", time: "08:00 - 21:00" },
      { day: "Salı", time: "08:00 - 21:00" },
      { day: "Çarşamba", time: "08:00 - 21:00" },
      { day: "Perşembe", time: "08:00 - 21:00" },
      { day: "Cuma", time: "08:00 - 22:00" },
      { day: "Cumartesi", time: "09:00 - 22:00" },
      { day: "Pazar", time: "09:00 - 20:00" },
    ],
    services: ["Filter Coffee", "Espresso", "Tea Selection", "Homemade Cake"],
    amenities: ["Wi-Fi", "Vegan Seçenekler", "Evcil Hayvan Dostu", "Terrace"],
    coordinates: { lat: 41.0150, lng: 28.9700 },
    userReviews: [
      { id: 1, author: "Merve T.", avatar: "https://i.pravatar.cc/100?img=17", rating: 5, date: "2024-01-14", comment: "Homemade kekler inanılmaz! Kahve eşliğinde harika gidiyor." },
      { id: 2, author: "Cem A.", avatar: "https://i.pravatar.cc/100?img=18", rating: 4, date: "2024-01-07", comment: "Terası çok güzel, manzara eşliğinde kahve içmek keyifli." },
      { id: 3, author: "Nilgün K.", avatar: "https://i.pravatar.cc/100?img=19", rating: 4, date: "2024-01-01", comment: "Çay seçenekleri de çok zengin, sadece kahveci değil." },
    ],
  },
  {
    id: 6,
    name: "Espresso Express",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    ],
    rating: 4.4,
    reviews: 89,
    location: "987 Birch Blvd, Southside",
    address: "987 Birch Boulevard, Southside, Istanbul 34500",
    tags: ["wifi"],
    hours: [
      { day: "Pazartesi", time: "06:00 - 19:00" },
      { day: "Salı", time: "06:00 - 19:00" },
      { day: "Çarşamba", time: "06:00 - 19:00" },
      { day: "Perşembe", time: "06:00 - 19:00" },
      { day: "Cuma", time: "06:00 - 20:00" },
      { day: "Cumartesi", time: "07:00 - 20:00" },
      { day: "Pazar", time: "Kapalı" },
    ],
    services: ["Quick Espresso", "Americano", "Cappuccino", "To-Go"],
    amenities: ["Wi-Fi", "Hızlı Servis", "Paket Servis", "Sadık Müşteri Kartı"],
    coordinates: { lat: 40.9980, lng: 28.9900 },
    userReviews: [
      { id: 1, author: "Hakan B.", avatar: "https://i.pravatar.cc/100?img=20", rating: 5, date: "2024-01-19", comment: "Sabah işe giderken uğramak için mükemmel. Hızlı ve kaliteli servis." },
      { id: 2, author: "Esra Y.", avatar: "https://i.pravatar.cc/100?img=21", rating: 4, date: "2024-01-15", comment: "Fiyatlar uygun ve espresso kalitesi gayet iyi." },
    ],
  },
  {
    id: 7,
    name: "Caffeine Dreams",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
    ],
    rating: 4.8,
    reviews: 421,
    location: "147 Maple Dr, Harbor District",
    address: "147 Maple Drive, Harbor District, Istanbul 34600",
    tags: ["vegan"],
    hours: [
      { day: "Pazartesi", time: "07:30 - 22:00" },
      { day: "Salı", time: "07:30 - 22:00" },
      { day: "Çarşamba", time: "07:30 - 22:00" },
      { day: "Perşembe", time: "07:30 - 22:00" },
      { day: "Cuma", time: "07:30 - 23:00" },
      { day: "Cumartesi", time: "08:00 - 23:00" },
      { day: "Pazar", time: "08:00 - 21:00" },
    ],
    services: ["Specialty Latte", "Vegan Options", "Seasonal Drinks", "Art Coffee"],
    amenities: ["Vegan Menü", "Deniz Manzarası", "Açık Hava", "Fotoğraf Noktası"],
    coordinates: { lat: 41.0200, lng: 28.9650 },
    userReviews: [
      { id: 1, author: "Beren G.", avatar: "https://i.pravatar.cc/100?img=22", rating: 5, date: "2024-01-20", comment: "Deniz manzarası eşliğinde kahve içmek paha biçilemez!" },
      { id: 2, author: "Kaan O.", avatar: "https://i.pravatar.cc/100?img=23", rating: 5, date: "2024-01-16", comment: "Latte art'ları muhteşem, Instagram'lık fotoğraflar çekiliyor." },
      { id: 3, author: "İrem S.", avatar: "https://i.pravatar.cc/100?img=24", rating: 4, date: "2024-01-12", comment: "Seasonal drinks menüsü çok yaratıcı, her seferinde farklı bir şey deniyorum." },
      { id: 4, author: "Barış K.", avatar: "https://i.pravatar.cc/100?img=25", rating: 5, date: "2024-01-08", comment: "Vegan seçenekleri çok zengin ve lezzetli." },
      { id: 5, author: "Defne A.", avatar: "https://i.pravatar.cc/100?img=26", rating: 5, date: "2024-01-03", comment: "Şehrin en romantik kahvecisi. Date için mükemmel!" },
    ],
  },
  {
    id: 8,
    name: "Urban Grind",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
    ],
    rating: 4.6,
    reviews: 256,
    location: "258 Walnut Way, Arts Quarter",
    address: "258 Walnut Way, Arts Quarter, Istanbul 34700",
    tags: ["wifi", "pet"],
    hours: [
      { day: "Pazartesi", time: "08:00 - 22:00" },
      { day: "Salı", time: "08:00 - 22:00" },
      { day: "Çarşamba", time: "08:00 - 22:00" },
      { day: "Perşembe", time: "08:00 - 22:00" },
      { day: "Cuma", time: "08:00 - 23:00" },
      { day: "Cumartesi", time: "09:00 - 23:00" },
      { day: "Pazar", time: "09:00 - 21:00" },
    ],
    services: ["Drip Coffee", "Espresso", "Art Events", "Local Roasters"],
    amenities: ["Wi-Fi", "Evcil Hayvan Dostu", "Sanat Galerisi", "Workshop Alanı"],
    coordinates: { lat: 41.0070, lng: 28.9750 },
    userReviews: [
      { id: 1, author: "Yasemin D.", avatar: "https://i.pravatar.cc/100?img=27", rating: 5, date: "2024-01-21", comment: "Sanat galerisi konsepti çok güzel, her ay yeni sergiler var." },
      { id: 2, author: "Onur T.", avatar: "https://i.pravatar.cc/100?img=28", rating: 4, date: "2024-01-17", comment: "Local roaster'larla çalışmaları çok değerli. Kahve kalitesi üst düzey." },
      { id: 3, author: "Ceren M.", avatar: "https://i.pravatar.cc/100?img=29", rating: 5, date: "2024-01-13", comment: "Workshop'lara katıldım, latte art öğrendim. Harika bir deneyimdi!" },
      { id: 4, author: "Murat A.", avatar: "https://i.pravatar.cc/100?img=30", rating: 4, date: "2024-01-09", comment: "Arts Quarter'ın en cool mekanı. Hipster ama samimi." },
    ],
  },
]

export function getCoffeeShopById(id: number): CoffeeShop | undefined {
  return coffeeShops.find(shop => shop.id === id)
}
