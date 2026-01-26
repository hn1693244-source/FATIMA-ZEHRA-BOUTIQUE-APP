'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-96 md:h-[500px] bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
          Fatima Zehra Boutique
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">
          Elegant Fashion for Every Occasion
        </p>
        <Link
          href="/products"
          className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
