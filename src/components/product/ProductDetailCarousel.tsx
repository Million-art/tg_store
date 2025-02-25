import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { addToCart } from "../../store/slice/cartReducer";
import { Product } from "../../interface/product";
import { AppDispatch, RootState } from "../../store/store";
import { useMemo } from "react";
import { setShowMessage } from "../../store/slice/messageReducer";
import { telegramId } from "../../libs/telegram";

interface Props {
  product: Product;
}

const ProductDetailCarousel = ({ product }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const userId = String(telegramId);  
  
  // Use useMemo to optimize performance
  const isInCart = useMemo(
    () => cartItems.some((item) => item.id === product.id),
    [cartItems, product.id]
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCart) {
      dispatch(addToCart({ userId, product }));
      dispatch(
        setShowMessage({
          message: 'Product added successfully!',
          color: 'green',
        })
      );
    }
    
  };

  return (
    <div className="relative p-6 rounded-lg  max-w-xl">
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
      <p className="text-lg font-bold  mt-1">${product.price}</p>
      <p className=" mt-2">{product.description}</p>

      {/* Add to Cart Button
      <button
        className={`w-full ${
          isInCart ? "bg-gray-light cursor-not-allowed" : "bg-blue-light"
        }  font-medium py-2 rounded-lg mt-3 flex items-center justify-center transition`}
        onClick={handleAddToCart}
        disabled={isInCart}
      >
        <ShoppingCart size={18} className="mr-2" />
        {isInCart ? "" : "Add to Cart"}
      </button> */}
    </div>
  );
};

export default ProductDetailCarousel;
