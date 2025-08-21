import React from 'react';

export const MerchSection: React.FC = () => {
  const products = [
    {
      name: 'Cyberpunk Sticker Pack',
      price: '$12.99',
      description: 'Holographic stickers featuring original cyberpunk designs',
      category: 'Accessories',
      inStock: true,
    },
    {
      name: 'Digital Art Print Set',
      price: '$29.99',
      description: 'High-quality prints of original digital artwork',
      category: 'Art',
      inStock: true,
    },
    {
      name: 'Neon Logo T-Shirt',
      price: '$24.99',
      description: 'Premium cotton tee with glow-in-the-dark logo',
      category: 'Apparel',
      inStock: false,
    },
    {
      name: 'Tech Enthusiast Mug',
      price: '$16.99',
      description: 'Color-changing mug with circuit board design',
      category: 'Accessories',
      inStock: true,
    },
    {
      name: 'Audio Waveform Poster',
      price: '$19.99',
      description: 'Minimalist poster featuring audio visualization art',
      category: 'Art',
      inStock: true,
    },
    {
      name: 'Cyberpunk Hoodie',
      price: '$49.99',
      description: 'Premium hoodie with embroidered cyberpunk graphics',
      category: 'Apparel',
      inStock: true,
    },
  ];

  const categories = ['All', 'Apparel', 'Art', 'Accessories'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-mono text-cyan-400 mb-8">
          Merchandise Store
        </h1>

        <p className="text-lg text-cyan-300 mb-8">
          Support the creative journey with exclusive merchandise and digital
          art pieces.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              className="border border-magenta-500 text-magenta-400 font-mono px-4 py-2 hover:bg-magenta-500 hover:text-black transition-all duration-300"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="border border-cyan-400 bg-black bg-opacity-30 overflow-hidden hover:bg-opacity-50 transition-all duration-300"
            >
              {/* Product Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-purple-900 to-cyan-900 flex items-center justify-center relative">
                <div className="text-cyan-400 font-mono text-sm">
                  PRODUCT IMAGE
                </div>
                {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-mono px-2 py-1">
                    OUT OF STOCK
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-mono text-cyan-300">
                    {product.name}
                  </h3>
                  <span className="text-magenta-400 font-mono font-bold">
                    {product.price}
                  </span>
                </div>

                <div className="text-xs font-mono text-gray-400 mb-2">
                  {product.category}
                </div>

                <p className="text-gray-300 text-sm mb-4">
                  {product.description}
                </p>

                <button
                  className={`w-full font-mono py-2 transition-all duration-300 ${
                    product.inStock
                      ? 'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black'
                      : 'border border-gray-600 text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-12 border border-cyan-400 p-6 bg-black bg-opacity-50">
          <h3 className="text-xl font-mono text-cyan-400 mb-4">
            Shopping Cart
          </h3>
          <div className="text-gray-300 mb-4">
            Your cart is empty. Add some items to get started!
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-magenta-400">Total: $0.00</span>
            <button className="border border-magenta-500 text-magenta-400 font-mono px-6 py-2 hover:bg-magenta-500 hover:text-black transition-all duration-300">
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
