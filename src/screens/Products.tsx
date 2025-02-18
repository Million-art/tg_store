import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart, fetchProducts } from "../store/slice/productSlice";
import type { RootState, AppDispatch } from "../store/store";
import { ShoppingCart, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Product } from "../interface/product";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const filteredProducts = items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mt-24 mx-auto p-4">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 mb-6 w-full max-w-lg mx-auto">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          className="bg-transparent outline-none w-full ml-2 text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Dialog key={product.id}>
            <DialogTrigger asChild>
              <div
                className="bg-white shadow-md rounded-2xl p-4 transition-transform transform hover:scale-105 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                <p className="text-gray-500 text-sm">${product.price}</p>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg mt-3 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addToCart(product));
                  }}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </DialogTrigger>

            {/* Product Detail Dialog */}
            {selectedProduct && (
              <DialogContent className="sm:max-w-[625px]">
                <div className="flex justify-end">
                  <X
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    size={24}
                    onClick={() => setSelectedProduct(null)}
                  />
                </div>
                <ProductDetailCarousel product={selectedProduct} />
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>
    </div>
  );
};

// Product Detail Carousel Component
const ProductDetailCarousel = ({ product }: { product: Product }) => {
  return (
    <div className="flex flex-col gap-4">
      <Carousel showThumbs={false} infiniteLoop autoPlay>
        {product.image.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`${product.name} ${index + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        ))}
      </Carousel>
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p className="text-gray-700">{product.description}</p>
      <p className="text-lg font-semibold">${product.price}</p>
    </div>
  );
};

export default Products;
