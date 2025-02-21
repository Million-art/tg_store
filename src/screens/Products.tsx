import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProducts } from "../store/slice/productSlice";
import { addToCart } from "../store/slice/cartReducer";
import type { RootState, AppDispatch } from "../store/store";
import { ShoppingCart, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Product } from "../interface/product";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartProducts, setCartProducts] = useState<string[]>([]);
  const userId = "123"; 

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCartProducts();
  }, [dispatch]);

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

  const isInCart = (productId: string) => cartProducts.includes(productId);

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCart(product.id)) {
      dispatch(addToCart({ userId, product }));
      setCartProducts((prev) => [...prev, product.id]);
    }
  };

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const filteredProducts = items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mt-16 mx-auto p-4">
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 mb-8 w-full max-w-md mx-auto shadow-sm">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          className="bg-transparent outline-none w-full ml-3 text-gray-700 placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Dialog key={product.id}>
            <DialogTrigger asChild>
              <div
                className="bg-white shadow-lg rounded-xl p-4 transition-transform transform hover:scale-105 cursor-pointer border border-gray-200"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-44 object-cover rounded-lg"
                />
                <h2 className="text-lg font-semibold mt-3 text-gray-900">{product.name}</h2>
                <p className="text-gray-600 text-sm">${product.price}</p>

                {/* Add to Cart Button */}
                <button
                  className={`w-full ${
                    isInCart(product.id) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  } text-white font-medium py-2 rounded-lg mt-4 flex items-center justify-center transition`}
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={isInCart(product.id)}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </DialogTrigger>

            {selectedProduct?.id === product.id && (
              <DialogContent className="max-w-2xl p-6 bg-gray-800 text-white rounded-xl shadow-xl">
                <ProductDetailCarousel product={selectedProduct} />
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>
    </div>
  );
};

const ProductDetailCarousel = ({ product }: { product: Product }) => {
  return (
    <div className="grid grid-cols-1 text-white md:grid-cols-2 gap-6">
      <Carousel showThumbs={false} infiniteLoop autoPlay>
        {product.image.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`${product.name} ${index + 1}`}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        ))}
      </Carousel>
      <div>
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="mt-2">{product.description}</p>
        <p className="text-lg font-semibold mt-3">${product.price}</p>
      </div>
    </div>
  );
};

export default Products;
