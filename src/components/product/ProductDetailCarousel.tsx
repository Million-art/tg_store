import { DialogClose } from "../ui/dialog";
import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { addToCart } from "../../store/slice/cartReducer";
import { useDispatch } from "react-redux";
 import { Product } from "../../interface/product";
import { AppDispatch } from "../../store/store";
import { CartItem } from "../../interface/cart";

 

interface Props {
  product: Product;
}

const ProductDetailCarousel = ({ product }: Props) => {
  const dispatch = useDispatch<AppDispatch>();  
  const [addedToCart, setAddedToCart] = useState(false);
  const userId = "123"; // Replace with dynamic user ID

  const handleAddToCart = () => {
    if (!addedToCart) {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image, 
        quantity: 1,
      };

      dispatch(addToCart({ userId, product: cartItem }));  
      setAddedToCart(true);
    }
  };

  return (
    <div className="relative bg-gray-800 p-6 rounded-lg text-white max-w-xl">
      {/* Close Button */}
      <DialogClose className="absolute top-3 right-3 text-white">
        <X size={24} />
      </DialogClose>

      {/* Image Carousel */}
      <Carousel showThumbs={false} infiniteLoop autoPlay>
        {product.image.map((img, index) => (
          <div key={index}>
            <img src={img} alt={product.name} className="rounded-lg" />
          </div>
        ))}
      </Carousel>

      {/* Product Info */}
      <h2 className="text-2xl font-semibold mt-4">{product.name}</h2>
      <p className="text-lg font-bold text-yellow-400 mt-1">${product.price}</p>
      <p className="text-gray-300 mt-2">{product.description}</p>

      {/* Add to Cart Button */}
      <button
        className={`w-full ${
          addedToCart ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        } text-white font-medium py-2 rounded-lg mt-4 flex items-center justify-center transition`}
        onClick={handleAddToCart}
        disabled={addedToCart}
      >
        <ShoppingCart size={18} className="mr-2" />
        {addedToCart ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductDetailCarousel;
