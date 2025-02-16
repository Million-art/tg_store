import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart, fetchProducts } from "../store/slice/productSlice";
import type { RootState, AppDispatch } from "../store/store";
import { ShoppingCart, Search } from "lucide-react"; // Import icons

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // Filter products based on search input
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
          <div
            key={product.id}
            className="bg-white shadow-md rounded-2xl p-4 transition-transform transform hover:scale-105"
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
              onClick={() => dispatch(addToCart(product))}
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
