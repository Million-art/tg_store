"use client"

import { useDispatch, useSelector } from "react-redux"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { addToCart } from "../../store/slice/cartReducer"
import type { Product } from "../../interface/product"
import type { AppDispatch, RootState } from "../../store/store"
import { useMemo } from "react"
import { setShowMessage } from "../../store/slice/messageReducer"
import { telegramId } from "../../libs/telegram"
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react"

interface Props {
  product: Product
}

const ProductDetailCarousel = ({ product }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const userId = telegramId ? String(telegramId) : ""

  // Check if product is already in cart
  const isInCart = useMemo(() => cartItems.some((item) => item.id === product.id), [cartItems, product.id])

  const handleAddToCart = () => {
    if (!userId) {
      dispatch(
        setShowMessage({
          message: "User ID is required to add items to cart",
          color: "red",
        }),
      )
      return
    }

    if (isInCart) {
      dispatch(
        setShowMessage({
          message: "Product already in cart",
          color: "blue",
        }),
      )
      return
    }

    dispatch(addToCart({ userId, product }))
  }

  // Custom carousel arrows
  const renderArrowPrev = (clickHandler: () => void) => (
    <button
      onClick={clickHandler}
      className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 rounded-full"
      aria-label="Previous slide"
    >
      <ArrowLeft size={20} className="text-white" />
    </button>
  )

  const renderArrowNext = (clickHandler: () => void) => (
    <button
      onClick={clickHandler}
      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 rounded-full"
      aria-label="Next slide"
    >
      <ArrowRight size={20} className="text-white" />
    </button>
  )

  return (
    <div className="relative  p-2 rounded-lg max-w-xl mx-auto">
      {/* Image Carousel */}
      {product.image && product.image.length > 0 ? (
        <Carousel
          showThumbs={true}
          infiniteLoop
          autoPlay
          interval={5000}
          showStatus={false}
          renderArrowPrev={renderArrowPrev}
          renderArrowNext={renderArrowNext}
          className="mb-6"
        >
          {product.image.map((img, index) => (
            <div key={index} className="relative aspect-video">
              <img
                src={img || "/placeholder.svg"}
                alt={`${product.name} - image ${index + 1}`}
                className="rounded-lg object-contain h-full w-full"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=400"
                }}
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="w-full aspect-video bg-gray-700 rounded-lg flex items-center justify-center mb-6">
          <ShoppingCart size={48} className="text-gray-500" />
        </div>
      )}

      {/* Product Info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">{product.name}</h2>

        {/* Price */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-blue-light">{product.price.toFixed(2)}ETB</p>


        </div>

        {/* Category */}
        {product.category && (
          <div className="flex items-center">
            <span className="text-sm text-gray-400">Category:</span>
            <span className="ml-2 text-sm bg-gray-700 px-2 py-1 rounded-full text-white">{product.category.name}</span>
          </div>
        )}

        {/* Description */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-white mb-2">Description</h3>
          <p className="text-gray-300 leading-relaxed">
            {product.description || "No description available for this product."}
          </p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        className={`w-full ${
          isInCart ? "bg-gray-600 cursor-not-allowed" : "bg-blue hover:bg-blue-light"
        } text-white font-medium py-3 rounded-lg mt-6 flex items-center justify-center transition`}
        onClick={handleAddToCart}
        disabled={isInCart}
      >
        <ShoppingCart size={20} className="mr-2" />
        {isInCart ? "Already in Cart" : "Add to Cart"}
      </button>
    </div>
  )
}

export default ProductDetailCarousel

