import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Eye,
  Grid,
  Heart,
  Image,
  Layout,
  Palette,
  Sparkles,
  Star,
  User,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

interface LookbookItem {
  id: string;
  title: string;
  description: string;
  category:
    | 'Editorial'
    | 'Streetwear'
    | 'Avant-Garde'
    | 'Tech-Wear'
    | 'Evening';
  imageUrl: string;
  tags: string[];
  photographer?: string;
  model?: string;
  stylist?: string;
  year: string;
  featured: boolean;
  likes: number;
  views: number;
  collection: string;
  colorPalette: string[];
  inspiration: string;
}

export const FashionSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<LookbookItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [currentSlide, setCurrentSlide] = useState(0);

  const lookbookItems: LookbookItem[] = [
    {
      id: '1',
      title: 'Neon Dreams',
      description:
        'A cyberpunk-inspired editorial shoot exploring the intersection of technology and haute couture. Featuring holographic fabrics and LED-integrated accessories.',
      category: 'Editorial',
      imageUrl:
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1200&fit=crop',
      tags: ['cyberpunk', 'editorial', 'neon', 'futuristic'],
      photographer: 'Alex Chen',
      model: 'Zara Nakamura',
      stylist: 'Denward Lee Aulder',
      year: '2024',
      featured: true,
      likes: 2847,
      views: 15420,
      collection: 'Digital Dystopia',
      colorPalette: ['#00FFFF', '#FF00FF', '#000000', '#FFFFFF'],
      inspiration: 'Blade Runner aesthetics meet modern street fashion',
    },
    {
      id: '2',
      title: 'Urban Glow',
      description:
        'Street photography capturing the raw energy of city nightlife through fashion. Reactive clothing that responds to sound and movement.',
      category: 'Streetwear',
      imageUrl:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop',
      tags: ['streetwear', 'urban', 'reactive', 'night'],
      photographer: 'Marcus Rivera',
      model: 'Kai Thompson',
      stylist: 'Denward Lee Aulder',
      year: '2024',
      featured: true,
      likes: 1923,
      views: 8765,
      collection: 'Night Pulse',
      colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      inspiration: 'Tokyo street culture and electronic music festivals',
    },
    {
      id: '3',
      title: 'Geometric Harmony',
      description:
        'Avant-garde exploration of shape and form in fashion. Architectural elements merge with wearable art in this striking composition.',
      category: 'Avant-Garde',
      imageUrl:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1200&fit=crop',
      tags: ['geometric', 'architectural', 'minimalist', 'art'],
      photographer: 'Sofia Andersson',
      model: 'Luna Park',
      stylist: 'Denward Lee Aulder',
      year: '2024',
      featured: false,
      likes: 3156,
      views: 12890,
      collection: 'Structured Dreams',
      colorPalette: ['#2C3E50', '#E74C3C', '#F39C12', '#FFFFFF'],
      inspiration: 'Bauhaus architecture and contemporary sculpture',
    },
    {
      id: '4',
      title: 'Tech Renaissance',
      description:
        'Fusion of classical elegance with cutting-edge technology. Smart fabrics that adapt to environmental conditions while maintaining timeless sophistication.',
      category: 'Tech-Wear',
      imageUrl:
        'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&h=1200&fit=crop',
      tags: ['tech-wear', 'smart-fabrics', 'elegant', 'adaptive'],
      photographer: 'Emma Rodriguez',
      model: 'Adrian Cross',
      stylist: 'Denward Lee Aulder',
      year: '2024',
      featured: true,
      likes: 4821,
      views: 19750,
      collection: 'Future Formal',
      colorPalette: ['#1A1A2E', '#16213E', '#E94560', '#F5F5F5'],
      inspiration: 'Renaissance art meets wearable technology',
    },
    {
      id: '5',
      title: 'Midnight Elegance',
      description:
        'Sophisticated evening wear that transitions seamlessly from formal events to underground art scenes. Modular designs for the modern nomad.',
      category: 'Evening',
      imageUrl:
        'https://images.unsplash.com/photo-1566479179817-c5db04ae7be9?w=800&h=1200&fit=crop',
      tags: ['evening', 'modular', 'sophisticated', 'versatile'],
      photographer: 'David Kim',
      model: 'Isabella Santos',
      stylist: 'Denward Lee Aulder',
      year: '2024',
      featured: false,
      likes: 2134,
      views: 9876,
      collection: 'Night Nomad',
      colorPalette: ['#000000', '#C0392B', '#F1C40F', '#FFFFFF'],
      inspiration: 'Film noir and modern art galleries',
    },
  ];

  const categories = [
    {
      id: 'all',
      label: 'ALL.LOOKS',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'cyber-primary',
    },
    {
      id: 'Editorial',
      label: 'EDITORIAL',
      icon: <Camera className="w-5 h-5" />,
      color: 'cyber-secondary',
    },
    {
      id: 'Streetwear',
      label: 'STREETWEAR',
      icon: <Zap className="w-5 h-5" />,
      color: 'cyber-accent',
    },
    {
      id: 'Avant-Garde',
      label: 'AVANT-GARDE',
      icon: <Palette className="w-5 h-5" />,
      color: 'neon-pink',
    },
    {
      id: 'Tech-Wear',
      label: 'TECH-WEAR',
      icon: <Grid className="w-5 h-5" />,
      color: 'neon-cyan',
    },
    {
      id: 'Evening',
      label: 'EVENING',
      icon: <Star className="w-5 h-5" />,
      color: 'neon-gold',
    },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? lookbookItems
      : lookbookItems.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'cyber-primary';
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + filteredItems.length) % filteredItems.length
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="page-revolutionary revolutionary-gpu-accelerated">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Revolutionary Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary via-cyber-secondary to-cyber-accent rounded-full blur-xl opacity-75 animate-revolutionary"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-cyber-primary via-cyber-secondary to-cyber-accent rounded-full flex items-center justify-center shadow-revolutionary">
                <Image className="w-16 h-16 text-black" />
              </div>
            </div>

            <h1 className="text-6xl font-cyber font-bold text-revolutionary mb-4 tracking-wider animate-cyber-pulse">
              FASHION.NEXUS
            </h1>
            <div className="text-xl font-mono text-cyber-glow mb-6 tracking-wide">
              &lt;Editorial | Streetwear | Avant-Garde | Tech-Wear /&gt;
            </div>

            <div className="flex justify-center items-center gap-6 text-secondary text-sm font-mono flex-wrap">
              <div className="flex items-center gap-2 animate-micro-bounce">
                <Camera className="w-4 h-4 text-cyber-primary" />
                <span>Creative Direction</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-100">
                <Palette className="w-4 h-4 text-cyber-secondary" />
                <span>Visual Storytelling</span>
              </div>
              <div className="flex items-center gap-2 animate-micro-bounce delay-200">
                <Sparkles className="w-4 h-4 text-cyber-accent" />
                <span>{lookbookItems.length} Curated Looks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revolutionary Filter & View Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-6">
          {/* Category Filter */}
          <div className="flex justify-center overflow-x-auto">
            <div className="card-revolutionary p-2 inline-flex rounded-2xl min-w-max">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentSlide(0);
                  }}
                  className={`relative px-4 py-3 font-mono font-bold tracking-wider transition-all duration-300 rounded-xl mx-1 ${
                    selectedCategory === category.id
                      ? `text-${category.color} bg-gradient-to-r from-${category.color}/20 to-cyber-secondary/20 shadow-cyber-glow animate-cyber-pulse`
                      : 'text-secondary hover:text-white hover:bg-cyber-primary/10 interactive-revolutionary'
                  }`}
                >
                  {selectedCategory === category.id && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-${category.color}/10 to-cyber-secondary/10 rounded-xl animate-energy-wave`}
                    ></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2 text-sm">
                    {category.icon}
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="card-revolutionary p-2 inline-flex rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`relative px-4 py-2 font-mono transition-all duration-300 rounded-lg ${
                viewMode === 'grid'
                  ? 'text-cyber-primary bg-cyber-primary/20 shadow-cyber-glow'
                  : 'text-secondary hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`relative px-4 py-2 font-mono transition-all duration-300 rounded-lg ${
                viewMode === 'masonry'
                  ? 'text-cyber-primary bg-cyber-primary/20 shadow-cyber-glow'
                  : 'text-secondary hover:text-white'
              }`}
              aria-label="Masonry view"
            >
              <Layout className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {!selectedItem ? (
          /* Lookbook Gallery */
          <div className="space-y-8">
            {/* Featured Slider */}
            {filteredItems.some(item => item.featured) && (
              <div className="card-revolutionary relative overflow-hidden">
                <div className="relative h-96 lg:h-[500px]">
                  {filteredItems
                    .filter(item => item.featured)
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          index ===
                          currentSlide %
                            filteredItems.filter(i => i.featured).length
                            ? 'opacity-100'
                            : 'opacity-0'
                        }`}
                      >
                        <div className="relative h-full bg-gradient-to-r from-black/50 to-transparent">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>

                          {/* Overlay Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="max-w-2xl">
                              <div className="flex items-center gap-3 mb-4">
                                <Star className="w-6 h-6 text-neon-gold" />
                                <span
                                  className={`text-${getCategoryColor(item.category)} font-cyber text-sm uppercase tracking-wider`}
                                >
                                  {item.category} • Featured
                                </span>
                              </div>

                              <h3 className="text-4xl font-cyber text-white mb-4">
                                {item.title}
                              </h3>

                              <p className="text-secondary text-lg mb-6 line-clamp-2">
                                {item.description}
                              </p>

                              <div className="flex items-center gap-6 text-sm text-secondary font-mono">
                                <div className="flex items-center gap-2">
                                  <Heart className="w-4 h-4 text-neon-pink" />
                                  <span>{formatNumber(item.likes)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye className="w-4 h-4 text-cyber-secondary" />
                                  <span>{formatNumber(item.views)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{item.year}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => setSelectedItem(item)}
                                className="button-revolutionary button-primary mt-6"
                              >
                                VIEW.DETAILS
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-cyber-primary/50 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ArrowLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-cyber-primary/50 transition-colors"
                    aria-label="Next slide"
                  >
                    <ArrowRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Gallery Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'md:grid-cols-2 lg:grid-cols-3'
                  : 'masonry-grid'
              }`}
            >
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="card-revolutionary hover-glow group cursor-pointer relative overflow-hidden"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        viewMode === 'grid' ? 'h-80' : 'h-auto'
                      }`}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          {item.featured && (
                            <Star className="w-4 h-4 text-neon-gold" />
                          )}
                          <span
                            className={`text-${getCategoryColor(item.category)} font-cyber text-xs uppercase tracking-wider`}
                          >
                            {item.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-cyber text-white mb-2">
                          {item.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-secondary font-mono">
                          <span>{item.collection}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-neon-pink" />
                              <span>{formatNumber(item.likes)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{formatNumber(item.views)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div className="absolute top-4 right-4 flex gap-1">
                      {item.colorPalette.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-white/50"
                          data-color={color}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Selected Item Detail View */
          <div className="space-y-8">
            {/* Back Navigation */}
            <button
              onClick={() => setSelectedItem(null)}
              className="button-revolutionary button-secondary flex items-center gap-2"
            >
              ← BACK.TO.GALLERY
            </button>

            {/* Item Details */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image */}
              <div className="card-revolutionary overflow-hidden">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Details */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {selectedItem.featured && (
                      <Star className="w-6 h-6 text-neon-gold" />
                    )}
                    <span
                      className={`text-${getCategoryColor(selectedItem.category)} font-cyber text-lg uppercase tracking-wider`}
                    >
                      {selectedItem.category}
                    </span>
                  </div>

                  <h1 className="text-4xl font-cyber text-revolutionary mb-4">
                    {selectedItem.title}
                  </h1>

                  <p className="text-white text-lg leading-relaxed mb-6">
                    {selectedItem.description}
                  </p>

                  <div className="card-revolutionary bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 mb-6">
                    <div className="p-6">
                      <h3 className="font-cyber text-white mb-4">
                        INSPIRATION
                      </h3>
                      <p className="text-secondary italic">
                        "{selectedItem.inspiration}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <h3 className="font-cyber text-white mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-cyber-primary" />
                    COLOR.PALETTE
                  </h3>
                  <div className="flex gap-3">
                    {selectedItem.colorPalette.map((color, index) => (
                      <div key={index} className="text-center">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-cyber-primary/30 mb-2"
                          data-color={color}
                        ></div>
                        <span className="text-xs font-mono text-secondary">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credits */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card-revolutionary">
                    <div className="p-6">
                      <h3 className="font-cyber text-white mb-4">CREDITS</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-cyber-primary" />
                          <span className="text-secondary">Photography:</span>
                          <span className="text-white">
                            {selectedItem.photographer}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-cyber-secondary" />
                          <span className="text-secondary">Model:</span>
                          <span className="text-white">
                            {selectedItem.model}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyber-accent" />
                          <span className="text-secondary">Styling:</span>
                          <span className="text-white">
                            {selectedItem.stylist}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-revolutionary">
                    <div className="p-6">
                      <h3 className="font-cyber text-white mb-4">DETAILS</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary">Collection:</span>
                          <span className="text-white">
                            {selectedItem.collection}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Year:</span>
                          <span className="text-white">
                            {selectedItem.year}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Likes:</span>
                          <span className="text-neon-pink">
                            {formatNumber(selectedItem.likes)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Views:</span>
                          <span className="text-cyber-secondary">
                            {formatNumber(selectedItem.views)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-cyber text-white mb-4">TAGS</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map(tag => (
                      <span key={tag} className="pill-revolutionary text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revolutionary Fashion Philosophy */}
        {!selectedItem && (
          <div className="mt-16 card-revolutionary text-center revolutionary-shimmer">
            <div className="p-8">
              <h3 className="text-3xl font-cyber text-revolutionary mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl animate-revolutionary">👗</span>
                FASHION.PHILOSOPHY
              </h3>
              <p className="text-white mb-6 text-lg max-w-4xl mx-auto leading-relaxed">
                Fashion is the bridge between personal expression and cultural
                conversation. Each look tells a story, each collection explores
                an idea, and every collaboration pushes the boundaries of what
                wearable art can become. This is fashion as a form of digital
                and physical storytelling.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="pill-revolutionary">Sustainable Practices</div>
                <div className="pill-revolutionary">Tech Integration</div>
                <div className="pill-revolutionary">Cultural Fusion</div>
                <div className="pill-revolutionary">Artistic Expression</div>
                <div className="pill-revolutionary">Future-Forward</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FashionSection;
