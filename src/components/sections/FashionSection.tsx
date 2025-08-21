import { FashionCollection, FashionItem } from '@/types';
import React, { useCallback, useState } from 'react';
import { FashionGallery } from './FashionGallery';

export const FashionSection: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  // Sample fashion data - in a real app, this would come from an API or CMS
  const collections: FashionCollection[] = [
    {
      id: 'cyberpunk',
      title: 'Cyberpunk Essentials',
      description: 'Futuristic streetwear meets functional design',
      featured: true,
      items: [
        {
          id: 'holo-jacket',
          name: 'Holographic Jacket',
          description:
            'Iridescent material that shifts colors in different lighting conditions. Features integrated LED strips and responsive fabric technology.',
          category: 'Outerwear',
          imageUrl:
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
          tags: ['holographic', 'LED', 'futuristic'],
          year: '2024',
          featured: true,
        },
        {
          id: 'led-hoodie',
          name: 'LED Strip Hoodie',
          description:
            'Programmable LED strips integrated seamlessly into the fabric. Customizable patterns and colors via mobile app.',
          category: 'Streetwear',
          imageUrl:
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop',
          tags: ['LED', 'programmable', 'streetwear'],
          year: '2024',
          featured: true,
        },
        {
          id: 'cyber-goggles',
          name: 'Cyber Goggles',
          description:
            'Augmented reality ready eyewear with built-in displays and gesture controls. Perfect for the digital nomad.',
          category: 'Accessories',
          imageUrl:
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
          tags: ['AR', 'wearable tech', 'accessories'],
          year: '2024',
          featured: false,
        },
      ],
    },
    {
      id: 'neon-nights',
      title: 'Neon Nights',
      description: 'Glow-in-the-dark accessories and statement pieces',
      featured: false,
      items: [
        {
          id: 'glow-sneakers',
          name: 'Reactive Glow Sneakers',
          description:
            'Motion-activated glow technology that responds to your movement. Perfect for night events and festivals.',
          category: 'Footwear',
          imageUrl:
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop',
          tags: ['glow', 'reactive', 'footwear'],
          year: '2023',
          featured: true,
        },
        {
          id: 'neon-backpack',
          name: 'Electro Backpack',
          description:
            'Solar-powered LED backpack with customizable display panel. Charge your devices while making a statement.',
          category: 'Accessories',
          imageUrl:
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
          tags: ['solar', 'LED', 'functional'],
          year: '2023',
          featured: false,
        },
      ],
    },
    {
      id: 'tech-wear',
      title: 'Tech Wear',
      description: 'Functional fashion for the digital age',
      featured: false,
      items: [
        {
          id: 'smart-fabric-tee',
          name: 'Smart Fabric Tee',
          description:
            'Temperature-regulating fabric with moisture-wicking properties. Embedded sensors monitor health metrics.',
          category: 'Basics',
          imageUrl:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
          tags: ['smart fabric', 'health tech', 'basics'],
          year: '2024',
          featured: false,
        },
      ],
    },
  ];

  // Flatten all items for filtering
  const allItems = collections.flatMap(collection => collection.items);

  const filteredItems =
    selectedCollection === 'all'
      ? allItems
      : collections.find(c => c.id === selectedCollection)?.items || [];

  const handleItemSelect = useCallback((item: FashionItem) => {
    // Optional: Add analytics or other side effects when an item is selected
    console.log('Fashion item selected:', item.name);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-mono text-cyan-400 mb-8">
            Fashion Forward
          </h1>

          <p className="text-lg text-cyan-300 mb-12">
            Where technology meets style. Curated collections that blur the line
            between fashion and function.
          </p>
        </div>

        {/* Collection Filter */}
        <div className="flex flex-wrap gap-4 mb-8 animate-fade-in">
          <button
            onClick={() => setSelectedCollection('all')}
            className={`px-4 py-2 font-mono text-sm border transition-all duration-300 ${
              selectedCollection === 'all'
                ? 'border-cyan-400 bg-cyan-400 text-black'
                : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black'
            }`}
          >
            ALL COLLECTIONS
          </button>
          {collections.map(collection => (
            <button
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={`px-4 py-2 font-mono text-sm border transition-all duration-300 ${
                selectedCollection === collection.id
                  ? 'border-magenta-400 bg-magenta-400 text-black'
                  : 'border-magenta-400 text-magenta-400 hover:bg-magenta-400 hover:text-black'
              }`}
            >
              {collection.title.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Fashion Gallery with Enhanced Features */}
        <FashionGallery items={filteredItems} onItemSelect={handleItemSelect} />
      </div>
    </div>
  );
};
