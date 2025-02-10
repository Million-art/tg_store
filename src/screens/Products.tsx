import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slice/cartReducer";
import { RootState, AppDispatch } from "../store/store";
import { TUser } from "../store/slice/userReducer";
import { Product } from "../interface/product";

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.value) as TUser | null;  

  const products: Product[] = [
    { id: "1", name: "Laptop", price: 999, quantity: 1 },
    { id: "2", name: "Phone", price: 599, quantity: 1 },
  ];

  const handleAddToCart = (product: Product) => {
    if (!user) {
      alert("Please log in to add items to the cart.");
      return;
    }
    dispatch(addToCart({ userId: user.uid, product }));  
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p>${product.price}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-2"
            onClick={() => handleAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Products;
