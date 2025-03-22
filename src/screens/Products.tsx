import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useCallback } from "react"
import { fetchProducts, fetchCategories, fetchProductsByCategory } from "../store/slice/productSlice"
import { addToCart } from "../store/slice/cartReducer"
import type { RootState, AppDispatch } from "../store/store"
import { ShoppingCart, Search, Filter, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog"
import type { Product } from "../interface/product"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import ProductDetailCarousel from "../components/product/ProductDetailCarousel"
import { setShowMessage } from "../store/slice/messageReducer"
import { telegramId } from "../libs/telegram"
import { Button } from "../components/ui/button"
import { Spinner } from "../components/ui/spinner"

const Products = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    items: products,
    loading,
    error,
    categories,
    categoriesLoading,
  } = useSelector((state: RootState) => state.products)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10
  const userId = telegramId ? String(telegramId) : ""

  // Check if a product is in the cart
  const isInCart = useCallback(
    (productId: string) => {
      return cartItems.some((item) => item.id === productId)
    },
    [cartItems],
  )

  // Fetch products and categories on component mount
  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  // Handle category change
  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchProductsByCategory(selectedCategory))
    } else {
      dispatch(fetchProducts())
    }
  }, [dispatch, selectedCategory])

  // Add a product to the cart
  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!userId) {
      dispatch(
        setShowMessage({
          message: "User ID is required to add items to cart",
          color: "red",
        }),
      )
      return
    }

    if (isInCart(product.id)) {
      dispatch(
        setShowMessage({
          message: "Product already in cart",
          color: "gray",
        }),
      )
      return
    }

    dispatch(addToCart({ userId, product }))
  }

  // Filter products based on search term
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const displayedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  return (
    <div className="max-w-6xl mb-20 mx-auto p-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-3 sm:space-y-0 sm:gap-4">
        {/* Search Input */}
        <div className="flex items-center rounded-lg px-4 py-3 w-full sm:max-w-md shadow-md border border-gray-700 bg-transparent">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none w-full ml-3 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="relative w-full sm:w-48">
          {categoriesLoading ? (
            <div className="w-full p-3 border border-gray-700 rounded-lg bg-transparent  flex items-center justify-center">
              <Spinner className="mr-2" />
              Loading...
            </div>
          ) : (
            <select
              className="w-full p-3 border  rounded-lg   cursor-pointer appearance-none pr-10"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className=" bg-gray-600 text-white">
                  {category.name}
                </option>
              ))}
            </select>
          )}
          <Filter
            className="absolute right-3 top-1/2 transform -translate-y-1/2  pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-10 h-10 animate-spin text-blue-light mb-4" />
          <p className="text-gray-400">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-100 p-4 rounded-lg mb-6">
          <p>{error}</p>
          <Button className="mt-2 bg-red-700 hover:bg-red-800" onClick={() => dispatch(fetchProducts())}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-10">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm
              ? `No products matching "${searchTerm}"`
              : selectedCategory
                ? "No products in this category"
                : "No products available at the moment"}
          </p>
          {(searchTerm || selectedCategory) && (
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("")
              }}
              className="bg-blue hover:bg-blue-light"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {displayedProducts.map((product) => (
            <Dialog key={product.id}>
              <DialogTrigger asChild>
                <div
                  className=" shadow-lg rounded-xl transition-transform transform  cursor-pointer border border-gray-700 hover:border-blue-"
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Product Image */}
                  {product.image && product.image.length > 0 ? (
                    <img
                      src={product.image[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=144&width=200"
                      }}
                    />
                  ) : (
                    <div className="w-full h-36 px-2 bg-gray-700 flex items-center justify-center">
                      <ShoppingCart className="text-gray-500" size={32} />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex justify-between items-center px-2">
                    <h2 className="text-md font-semibold truncate">{product.name}</h2>
                    <p className="text-blue-light text-sm font-bold">{product.price.toFixed(2)}ETB</p>
                  </div>
                  


                  {/* Add to Cart Button */}
                  <button
                    className={`w-full ${
                      isInCart(product.id) ? "bg-gray-600 cursor-not-allowed" : "bg-blue hover:bg-blue-light"
                    }  py-1  mt-3 flex items-center justify-center transition`}
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={isInCart(product.id)}
                  >
                    <ShoppingCart size={12} className="mr-2" />
                    {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                  </button>
                </div>
              </DialogTrigger>

              {selectedProduct?.id === product.id && (
                <DialogContent className="max-w-2xl p-6 bg-gray-800 rounded-xl shadow-xl">
                  <ProductDetailCarousel product={selectedProduct} />
                </DialogContent>
              )}
            </Dialog>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex flex-wrap gap-2">
            {/* Previous Page Button */}
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-gray-700 text-gray-300"
            >
              Previous
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className={currentPage === i + 1 ? "bg-blue" : "border-gray-700 text-gray-300"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            {/* Next Page Button */}
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-gray-700 text-gray-300"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products

