import { FashionItem } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, X, ZoomIn } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface FashionGalleryProps {
  items: FashionItem[];
  onItemSelect?: (item: FashionItem) => void;
}

interface ImageModalProps {
  item: FashionItem;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ item, isOpen, onClose }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      if (!isZoomed) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
        setIsZoomed(true);
      } else {
        setIsZoomed(false);
      }
    },
    [isZoomed]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    },
    [isZoomed, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
        onClick={() => (isZoomed ? setIsZoomed(false) : onClose())}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-7xl w-full max-h-[90vh] bg-gradient-to-br from-purple-900 to-black border border-cyan-400"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-cyan-400">
            <div>
              <h2 className="text-xl font-mono text-cyan-400">{item.name}</h2>
              <p className="text-sm text-gray-400">
                {item.category} • {item.year}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="text-cyan-400 hover:text-white transition-colors p-2"
                title={isZoomed ? 'Zoom out' : 'Zoom in'}
              >
                <Maximize2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="text-cyan-400 hover:text-white transition-colors p-2"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div
            className="relative overflow-hidden"
            style={{ height: 'calc(90vh - 120px)' }}
          >
            <motion.img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain cursor-zoom-in"
              onClick={handleImageClick}
              animate={{
                scale: isZoomed ? 2.5 : 1,
                transformOrigin: isZoomed
                  ? `${zoomPosition.x}% ${zoomPosition.y}%`
                  : 'center',
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                cursor: isZoomed ? 'zoom-out' : 'zoom-in',
              }}
            />

            {/* Zoom Instructions */}
            {!isZoomed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-cyan-400 px-3 py-2 text-sm font-mono"
              >
                Click to zoom • ESC to close
              </motion.div>
            )}
          </div>

          {/* Item Details */}
          <div className="p-4 border-t border-gray-700">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-magenta-400 bg-magenta-400 bg-opacity-20 px-2 py-1 border border-magenta-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const FashionGallery: React.FC<FashionGalleryProps> = ({
  items,
  onItemSelect,
}) => {
  const [selectedItem, setSelectedItem] = useState<FashionItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemClick = useCallback(
    (item: FashionItem) => {
      setSelectedItem(item);
      onItemSelect?.(item);
    },
    [onItemSelect]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        layout
      >
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleItemClick(item)}
            >
              <div className="relative overflow-hidden border border-magenta-500 bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-500">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    animate={{
                      scale: hoveredItem === item.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />

                  {/* Gradient Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredItem === item.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-mono text-xs">
                          {item.category}
                        </span>
                        <motion.div
                          animate={{
                            scale: hoveredItem === item.id ? 1.2 : 1,
                            rotate: hoveredItem === item.id ? 90 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ZoomIn className="text-cyan-400" size={16} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Featured Badge */}
                  {item.featured && (
                    <motion.div
                      className="absolute top-2 left-2 bg-cyan-400 text-black px-2 py-1 text-xs font-mono"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      FEATURED
                    </motion.div>
                  )}

                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-400"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredItem === item.id ? 0.3 : 0,
                      boxShadow:
                        hoveredItem === item.id
                          ? '0 0 20px rgba(0, 255, 255, 0.5)'
                          : '0 0 0px rgba(0, 255, 255, 0)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <motion.h3
                    className="text-lg font-mono text-cyan-300 mb-2 transition-colors"
                    animate={{
                      color: hoveredItem === item.id ? '#00FFFF' : '#67E8F9',
                    }}
                  >
                    {item.name}
                  </motion.h3>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag, tagIndex) => (
                      <motion.span
                        key={tag}
                        className="text-xs font-mono text-magenta-400 bg-magenta-400 bg-opacity-20 px-2 py-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.1 + tagIndex * 0.05 + 0.4,
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  <div className="text-xs font-mono text-gray-500">
                    {item.year}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        item={selectedItem!}
        isOpen={!!selectedItem}
        onClose={handleCloseModal}
      />
    </>
  );
};
