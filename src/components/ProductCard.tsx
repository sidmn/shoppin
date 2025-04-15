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

type Props = {
  product: Product;
  onSwipe: (direction: "left" | "right" | "top", id: number) => void;
};

export default function SwipeableCard({ product, onSwipe }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const bounds = {
      minY: -window.innerHeight,
      maxY: 0,
    };

    Draggable.create(el, {
      type: "x,y",
      inertia: true,
      edgeResistance: 0,
      allowContextMenu: true,
      bound: bounds,

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
        gsap.to(el, { rotation, duration: 0, ease: "none" });
      },
      onDragEnd() {
        const el = cardRef.current;
        const thresholdX = 100;
        const thresholdY = -100;

        const currentX = this.endX;
        const currentY = this.endY;

        if (currentX > thresholdX) {
          gsap.to(el, {
            x: window.innerWidth,
            rotation: 20,
            opacity: 0,
            ease: "none",
            onComplete: () => onSwipe("right", product.id),
          });
        } else if (currentX < -thresholdX) {
          gsap.to(el, {
            x: -window.innerWidth,
            rotation: -20,
            opacity: 0,
            ease: "none",
            onComplete: () => onSwipe("left", product.id),
          });
        } else if (currentY < thresholdY) {
          gsap.to(el, {
            y: -window.innerHeight,
            opacity: 0,
            ease: "none",
            onComplete: () => onSwipe("top", product.id),
          });
        } else {
          gsap.to(el, { x: 0, y: 0, rotation: 0, ease: "none" });
        }
      },
    });
  }, [product.id, onSwipe]);

  return (
    <div
      ref={cardRef}
      className="absolute w-11/12 max-w-sm p-4 bg-white rounded-2xl shadow-lg"
      style={{
        transformOrigin: "bottom center", // ✅ Pivot from bottom
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
