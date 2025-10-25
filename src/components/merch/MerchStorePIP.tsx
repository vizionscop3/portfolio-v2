import React, { useState } from 'react';
import { Star, Heart, Eye, Plus, Minus } from 'lucide-react';

interface MerchItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  inStock: boolean;
}

interface MerchStorePIPProps {
  onClose: () => void;
  onMoreClick: () => void;
  cartItems: { [key: string]: number };
  setCartItems: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

export const MerchStorePIP: React.FC<MerchStorePIPProps> = ({
  onClose: _onClose,
  onMoreClick,
  cartItems,
  setCartItems,
}) => {
  const [selectedItem, setSelectedItem] = useState<MerchItem | null>(null);

  // Sample merch items
  const merchItems: MerchItem[] = [
    {
      id: '1',
      name: 'Cyberpunk Sticker Pack',
      price: 12.99,
      image: '/api/placeholder/150/150',
      rating: 4.8,
      description:
        'Collection of 12 holographic stickers featuring original cyberpunk designs.',
      inStock: true,
    },
    {
      id: '2',
      name: 'VIZIONSCOPE T-Shirt',
      price: 24.99,
      image: '/api/placeholder/150/150',
      rating: 4.9,
      description: 'Premium cotton tee with glow-in-the-dark logo design.',
      inStock: true,
    },
    {
      id: '3',
      name: 'Digital Art Print',
      price: 18.99,
      image: '/api/placeholder/150/150',
      rating: 4.7,
      description: 'High-quality print of exclusive digital artwork.',
      inStock: false,
    },
    {
      id: '4',
      name: 'Neon Mousepad',
      price: 16.99,
      image: '/api/placeholder/150/150',
      rating: 4.6,
      description: 'RGB-edge gaming mousepad with cyberpunk aesthetic.',
      inStock: true,
    },
  ];

  const addToCart = (itemId: string) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  return (
    <div className="merch-content-wrapper">
      {/* Content */}
      <div className="merch-content">
        {!selectedItem ? (
          <>
            {/* Featured Items Grid */}
            <div className="merch-grid">
              {merchItems.map(item => (
                <div key={item.id} className="merch-item-card">
                  <div className="merch-item-image">
                    <img src={item.image} alt={item.name} />
                    {!item.inStock && (
                      <div className="out-of-stock-overlay">OUT OF STOCK</div>
                    )}
                  </div>
                  <div className="merch-item-info">
                    <h3 className="merch-item-name">{item.name}</h3>
                    <div className="merch-item-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.floor(item.rating)
                              ? 'star-filled'
                              : 'star-empty'
                          }
                        />
                      ))}
                      <span className="rating-text">({item.rating})</span>
                    </div>
                    <div className="merch-item-price">${item.price}</div>
                    <div className="merch-item-actions">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="merch-btn merch-btn-view"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="merch-btn merch-btn-favorite">
                        <Heart size={14} />
                      </button>
                      {item.inStock && (
                        <div className="quantity-controls">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="quantity-btn"
                            disabled={!cartItems[item.id]}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="quantity">
                            {cartItems[item.id] || 0}
                          </span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="quantity-btn"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* More Button */}
            <div className="merch-footer">
              <button onClick={onMoreClick} className="merch-more-btn">
                VIEW FULL STORE
              </button>
            </div>
          </>
        ) : (
          /* Item Detail View */
          <div className="merch-item-detail">
            <button onClick={() => setSelectedItem(null)} className="back-btn">
              ← Back
            </button>
            <div className="detail-content">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="detail-image"
              />
              <div className="detail-info">
                <h3>{selectedItem.name}</h3>
                <div className="detail-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(selectedItem.rating)
                          ? 'star-filled'
                          : 'star-empty'
                      }
                    />
                  ))}
                  <span>({selectedItem.rating})</span>
                </div>
                <p className="detail-description">{selectedItem.description}</p>
                <div className="detail-price">${selectedItem.price}</div>
                {selectedItem.inStock ? (
                  <div className="detail-actions">
                    <div className="quantity-controls-large">
                      <button
                        onClick={() => removeFromCart(selectedItem.id)}
                        className="quantity-btn"
                        disabled={!cartItems[selectedItem.id]}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-large">
                        {cartItems[selectedItem.id] || 0}
                      </span>
                      <button
                        onClick={() => addToCart(selectedItem.id)}
                        className="quantity-btn"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="out-of-stock-message">
                    Currently Out of Stock
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
