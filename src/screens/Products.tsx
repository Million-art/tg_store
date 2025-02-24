import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProducts } from "../store/slice/productSlice";
import { addToCart } from "../store/slice/cartReducer";
import type { RootState, AppDispatch } from "../store/store";
import { ShoppingCart, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Product } from "../interface/product";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductDetailCarousel from "../components/product/ProductDetailCarousel";
import { Category } from "../interface/Category";

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartProducts, setCartProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const userId = "123";

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCategories();
    fetchCartProducts();
  }, [dispatch]);

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const categoryQuery = collection(db, "categories");
      const querySnapshot = await getDocs(categoryQuery);
      const categoryList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch products in the cart for the user
  const fetchCartProducts = async () => {
    try {
      const cartQuery = query(collection(db, "carts"), where("userId", "==", userId));
      const querySnapshot = await getDocs(cartQuery);
      const productIds = querySnapshot.docs.map((doc) => doc.data().id);
      setCartProducts(productIds);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Check if a product is in the cart
  const isInCart = (productId: string) => cartProducts.includes(productId);

  // Add a product to the cart
  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCart(product.id)) {
      dispatch(addToCart({ userId, product }));
      setCartProducts((prev) => [...prev, product.id]);
    }
  };

  // Filter products based on search term and selected category
  const filteredProducts = items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "" || product.category?.id === selectedCategory)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mt-16 mx-auto p-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-3 sm:space-y-0">
        {/* Search Input */}
        <div className="flex items-center  rounded-lg px-4 py-3 w-full sm:max-w-md shadow-md border">
          <Search className="text-gray-medium" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none w-full ml-3 text-gray-dark placeholder-gray-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          className="w-full sm:w-48 p-2 border border-gray-medium rounded-lg shadow-sm cursor-pointer"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => {
            return (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {displayedProducts.map((product) => (
          <Dialog key={product.id}>
            <DialogTrigger asChild>
              <div
                className="bg-white shadow-lg rounded-xl p-4 transition-transform transform hover:scale-105 cursor-pointer border border-gray-medium"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-36 object-cover rounded-lg"
                />
                <h2 className="text-md font-semibold mt-2 text-gray-dark">{product.name}</h2>
                <p className="text-gray-medium text-sm">${product.price}</p>

                {/* Add to Cart Button */}
                <button
                  className={`w-full ${
                    isInCart(product.id) ? "bg-gray-medium cursor-not-allowed" : "bg-orange-light hover:bg-orange-medium"
                  } text-white font-medium py-2 rounded-lg mt-3 flex items-center justify-center transition`}
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={isInCart(product.id)}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </DialogTrigger>

            {selectedProduct?.id === product.id && (
              <DialogContent className="max-w-2xl p-6 bg-gray-dark text-white rounded-xl shadow-xl">
                <ProductDetailCarousel product={selectedProduct} />
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`mx-1 px-3 py-2 rounded-lg ${
              currentPage === i + 1 ? "bg-orange-light text-white" : "bg-gray-light text-gray-dark"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Products;