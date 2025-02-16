import { Product } from "../../interface/product";
import { Button } from "../ui/button";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

const ProductDetailModal = ({ product, onClose, onAddToCart }: ProductDetailModalProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto mb-4">
        {product.image.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${product.name} - Image ${index + 1}`}
            className="w-32 h-32 object-cover rounded"
          />
        ))}
      </div>
      <p className="text-lg font-semibold">Price: ${product.price}</p>
      <p className="text-sm text-gray-600">In Stock: {product.quantity}</p>
      <p className="text-sm text-gray-600">{product.description}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onAddToCart}>Add to Cart</Button>
      </div>
    </div>
  );
};

export default ProductDetailModal;