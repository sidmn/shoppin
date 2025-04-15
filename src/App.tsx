import { useState } from "react";
import { products as mockProducts } from "./data/products";
import ProductCard from "./components/ProductCard";

const App = () => {
  const [index, setIndex] = useState(0);

  const handleSwipe = (
    direction: "left" | "right" | "top",
    productId: number
  ) => {
    console.log(`${direction.toUpperCase()} swipe on Product ID: ${productId}`);
    setIndex((prev) => prev + 1);
  };

  const currentProducts = mockProducts.slice(index);

  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
      {currentProducts.length > 0 ? (
        currentProducts
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSwipe={handleSwipe}
            />
          ))
          .reverse()
      ) : (
        <div className="text-center text-xl font-medium text-gray-600">
          No more products 🎉
        </div>
      )}
    </div>
  );
};

export default App;
