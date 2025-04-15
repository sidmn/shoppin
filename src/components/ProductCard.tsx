import { useEffect, useRef } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  imageUrl: string;
};

type CardProps = {
  product: Product;
  onSwipe: (direction: "left" | "right" | "top", id: number) => void;
};

export default function ProductCard({ product, onSwipe }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const bounds = {
      minY: -window.innerHeight,
      maxY: 0,
    };

    Draggable.create(card, {
      type: "x,y",
      inertia: true,
      edgeResistance: 0,
      allowContextMenu: true,
      bound: bounds,

      // to disable bottom swipe/drag
      liveSnap: {
        y: function (endValue) {
          return endValue > 0 ? 0 : endValue;
        },
      },

      onPress() {
        this.startX = this.x;
        this.startY = this.y;
      },
      onDrag() {
        const rotation = this.x / 20;
        gsap.to(card, { rotation, duration: 0, ease: "none" });
      },
      onDragEnd() {
        const card = cardRef.current;
        const thresholdX = 100;
        const thresholdY = -100;

        const currentX = this.endX;
        const currentY = this.endY;

        if (currentX > thresholdX) {
          //right swipe successful
          gsap.to(card, {
            x: window.innerWidth,
            rotation: 20,
            opacity: 0,
            ease: "none",
            onComplete: () => onSwipe("right", product.id),
          });
        } else if (currentX < -thresholdX) {
          //left swipe sucessful
          gsap.to(card, {
            x: -window.innerWidth,
            rotation: -20,
            opacity: 0,
            ease: "none",
            onComplete: () => onSwipe("left", product.id),
          });
        } else if (currentY < thresholdY) {
          //top swipe successful
          gsap.to(card, {
            y: -window.innerHeight,
            opacity: 0,
            ease: "none",
            onComplete: () => onSwipe("top", product.id),
          });
        } else {
          gsap.to(card, { x: 0, y: 0, rotation: 0, ease: "none" });
        }
      },
    });
  }, [product.id, onSwipe]);

  return (
    <div
      ref={cardRef}
      className="absolute w-80 h-110 max-w-sm p-4 bg-white rounded-2xl shadow-lg"
      style={{
        transformOrigin: "bottom center", 
      }}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-64 object-cover rounded-xl mb-4"
      />
      <h3 className="text-lg font-semibold capitalize">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.brand}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xl font-bold text-pink-600">
          ₹{product.price}
        </span>
        {product.originalPrice !== product.price && (
          <>
            <span className="text-sm line-through text-gray-400">
              ₹{product.originalPrice}
            </span>
            <span className="text-sm text-green-600 font-medium">
              ({product.discountPercentage}% OFF)
            </span>
          </>
        )}
      </div>
    </div>
  );
}
