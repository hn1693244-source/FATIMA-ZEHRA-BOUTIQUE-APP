"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="card-product rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/25 hover:-translate-y-3">
        {/* Product Image Container */}
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover img-zoom transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 badge-gold">
              -{discountPercent}%
            </div>
          )}

          {/* In Stock Badge */}
          {product.inStock && (
            <div className="absolute top-3 left-3 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
              In Stock
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:bg-pink-500 hover:text-white transition-all duration-300"
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-current" : ""}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Category Badge */}
          <div className="mb-2">
            <span className="badge-pink text-xs">{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-pink-500 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-current"
                      : "stroke-current fill-none"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Material */}
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
            {product.material}
          </p>

          {/* Price Section - Flexed to bottom */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  Rs {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    Rs {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product);
              }}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2 text-sm font-semibold"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
