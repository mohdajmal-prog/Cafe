"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, ChevronDown, Star, Clock, Plus, Minus, ShoppingCart, Trash2, X, CreditCard, Smartphone, Wallet, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Types
interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  rating: number
  reviews: number
  time: string
}

interface CartItem extends MenuItem {
  quantity: number
}

// Menu Data
const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Tea",
    description: "Refreshing hot tea with aromatic flavors",
    price: 50,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 200,
    time: "2 min",
  },
  {
    id: "2",
    name: "Coffee",
    description: "Rich and bold brewed coffee",
    price: 80,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 350,
    time: "3 min",
  },
  {
    id: "3",
    name: "Milk",
    description: "Fresh cold milk, pure and wholesome",
    price: 40,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 150,
    time: "1 min",
  },
  {
    id: "4",
    name: "Paneer Puffs",
    description: "Crispy puffs filled with spiced paneer",
    price: 60,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 280,
    time: "3 min",
  },
  {
    id: "5",
    name: "Samosa",
    description: "Golden fried pastry with potato filling",
    price: 30,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 400,
    time: "2 min",
  },
  {
    id: "6",
    name: "Cutlet",
    description: "Spicy vegetable cutlet, crispy and delicious",
    price: 50,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 220,
    time: "3 min",
  },
  {
    id: "7",
    name: "Donut",
    description: "Sweet glazed donut, soft and fluffy",
    price: 40,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 320,
    time: "1 min",
  },
  {
    id: "8",
    name: "Brownie",
    description: "Rich chocolate brownie, fudgy and decadent",
    price: 80,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 450,
    time: "1 min",
  },
  {
    id: "9",
    name: "Chocolate Cake",
    description: "Moist chocolate cake with rich frosting",
    price: 150,
    category: "Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 500,
    time: "5 min",
  },
  {
    id: "10",
    name: "White Forest Cake",
    description: "Classic white forest cake with cherries",
    price: 180,
    category: "Cakes",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 380,
    time: "5 min",
  },
]

const CATEGORIES = [
  { id: "1", name: "Drinks", icon: "🧃" },
  { id: "2", name: "Snacks", icon: "🍪" },
  { id: "3", name: "Desserts", icon: "🍰" },
  { id: "4", name: "Cakes", icon: "🎂" },
]

const PAYMENT_METHODS = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "upi", name: "UPI", icon: Smartphone },
  { id: "wallet", name: "Digital Wallet", icon: Wallet },
  { id: "cash", name: "Cash on Delivery", icon: Banknote },
]

export default function CafePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const filteredItems = selectedCategory
    ? MENU_ITEMS.filter((item) => item.category === selectedCategory)
    : MENU_ITEMS

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0 ? prev.filter((i) => i.id !== itemId) : prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => setCart([])

  const handleCheckout = async () => {
    if (!selectedPayment) return
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsPaymentOpen(false)
    setOrderSuccess(true)
    clearCart()
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-6">Your delicious order is being prepared</p>
          <Button onClick={() => setOrderSuccess(false)} className="w-full bg-primary hover:bg-primary/90">
            Order More
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 md:px-8">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Good Morning 👋</p>
          <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
        </div>

        {/* Location Bar */}
        <button className="flex w-full items-center gap-3 rounded-xl bg-secondary/50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs text-muted-foreground">Delivery to</p>
            <p className="text-sm font-semibold text-foreground">SRM Campus 📍</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </header>

      {/* Categories */}
      <div className="px-4 py-4 md:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !selectedCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selectedCategory === category.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <section className="px-4 pb-24 md:px-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground">Popular Now 🔥</h2>
          <p className="text-sm text-muted-foreground">Most ordered items</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="relative h-28 bg-secondary">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
                <Badge className="absolute bottom-2 right-2 bg-foreground text-background">
                  <Star className="mr-1 h-3 w-3 fill-current" /> {item.rating}
                </Badge>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  <span className="font-bold text-primary">₹{item.price}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      <Clock className="mr-1 inline h-3 w-3" />
                      {item.time}
                    </span>
                    <Button size="icon" className="h-7 w-7" onClick={() => addToCart(item)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-auto">
          <Button
            onClick={() => setIsCartOpen(true)}
            className="w-full gap-2 rounded-full bg-primary py-6 text-primary-foreground shadow-lg md:px-8"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>View Cart ({cartCount})</span>
            <span className="ml-2 font-bold">₹{cartTotal}</span>
          </Button>
        </div>
      )}

      {/* Cart Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Your Cart</DialogTitle>
          </DialogHeader>

          {cart.length > 0 ? (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <span className="ml-2 font-bold text-primary">₹{item.price * item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => updateQuantity(item.id, 0)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="mt-4 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="mt-3 flex justify-between border-t pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">₹{cartTotal}</span>
                </div>
              </Card>

              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button className="flex-1 bg-primary" onClick={() => { setIsCartOpen(false); setIsPaymentOpen(true) }}>
                  Checkout • ₹{cartTotal}
                </Button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="text-6xl">🛒</div>
              <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
              <p className="mt-2 text-sm text-muted-foreground">Add delicious items from our menu</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border p-4 transition-colors",
                  selectedPayment === method.id ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"
                )}
              >
                <method.icon className="h-5 w-5 text-foreground" />
                <span className="font-medium">{method.name}</span>
              </button>
            ))}
          </div>

          <Button
            className="mt-4 w-full bg-primary"
            disabled={!selectedPayment || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? "Processing..." : `Pay ₹${cartTotal}`}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
