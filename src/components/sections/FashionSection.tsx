import React from 'react';

export const FashionSection: React.FC = () => {
  const collections = [
    {
      title: 'Cyberpunk Essentials',
      description: 'Futuristic streetwear meets functional design',
      items: 8,
      featured: true,
    },
    {
      title: 'Neon Nights',
      description: 'Glow-in-the-dark accessories and statement pieces',
      items: 12,
      featured: false,
    },
    {
      title: 'Tech Wear',
      description: 'Functional fashion for the digital age',
      items: 6,
      featured: false,
    },
  ];

  const featuredItems = [
    {
      name: 'Holographic Jacket',
      price: '$299',
      description:
        'Iridescent material that shifts colors in different lighting',
    },
    {
      name: 'LED Strip Hoodie',
      price: '$199',
      description: 'Programmable LED strips integrated into the design',
    },
    {
      name: 'Cyber Goggles',
      price: '$149',
      description: 'Augmented reality ready with built-in displays',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-mono text-cyan-400 mb-8">
          Fashion Forward
        </h1>

        <p className="text-lg text-cyan-300 mb-12">
          Where technology meets style. Curated collections that blur the line
          between fashion and function.
        </p>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {collections.map((collection, index) => (
            <div
              key={index}
              className={`border p-6 bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 cursor-pointer ${
                collection.featured ? 'border-cyan-400' : 'border-magenta-500'
              }`}
            >
              {collection.featured && (
                <div className="text-xs font-mono text-cyan-400 mb-2">
                  FEATURED
                </div>
              )}
              <h2 className="text-xl font-mono text-cyan-300 mb-2">
                {collection.title}
              </h2>
              <p className="text-gray-300 mb-4">{collection.description}</p>
              <div className="text-sm text-magenta-400">
                {collection.items} items
              </div>
            </div>
          ))}
        </div>

        {/* Featured Items */}
        <h2 className="text-3xl font-mono text-cyan-400 mb-6">
          Featured Items
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <div
              key={index}
              className="border border-magenta-500 bg-black bg-opacity-30 overflow-hidden hover:bg-opacity-50 transition-all duration-300"
            >
              {/* Placeholder for item image */}
              <div className="h-64 bg-gradient-to-br from-cyan-900 to-magenta-900 flex items-center justify-center">
                <div className="text-cyan-400 font-mono text-sm">
                  IMAGE PLACEHOLDER
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-mono text-cyan-300">
                    {item.name}
                  </h3>
                  <span className="text-magenta-400 font-mono">
                    {item.price}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                <button className="w-full border border-cyan-400 text-cyan-400 font-mono py-2 hover:bg-cyan-400 hover:text-black transition-all duration-300">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="border border-cyan-400 text-cyan-400 font-mono px-8 py-3 hover:bg-cyan-400 hover:text-black transition-all duration-300">
            EXPLORE ALL COLLECTIONS
          </button>
        </div>
      </div>
    </div>
  );
};
