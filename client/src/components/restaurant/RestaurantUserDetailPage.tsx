import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem, Restaurant } from '../../types/restaurant/restaurant';
import { fetchMenuItems, fetchRestaurantById } from '../../services/resturent/restaurantService';
import { updateItemQuantity, addToCart } from '../../services/cart/cartService';
import { Cart } from '../../types/cart/cart';
import CartDrawer from '../../components/cart/CartDrawer';
// import { useMediaQuery } from '../../hooks/useMediaQuery';
// import CartComponent from '../cart/Cart';

const RestaurantUserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCartOpen, setCartOpen] = useState(false);

  // Cart state with proper Cart type
  const [cart, setCart] = useState<Cart>({
    items: [],
    discountAmount: 0,
    subtotal: 0,
    fees: { deliveryFee: 0, serviceFee: 0, tax: 0 },
    total: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const [restaurantData, menuItemsData] = await Promise.all([
          fetchRestaurantById(id),
          fetchMenuItems(id),
        ]);
        
        setRestaurant(restaurantData);
        // Only show available menu items to customers
        setMenuItems(menuItemsData.filter(item => item.isAvailable));
      } catch (err) {
        setError('Failed to load restaurant details. Please try again later.');
        console.error('Error loading restaurant details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  // Cart management functions
  const handleUpdateQty = useCallback((itemId: string, qty: number) => {
    if (qty < 1) return;
    updateItemQuantity(itemId, qty).then(setCart);
  }, []);

  // const handleRemoveItem = useCallback((itemId: string) => {
  //   removeItem(itemId).then(setCart);
  // }, []);

  // const handleClearCart = useCallback(() => {
  //   clearCart().then(setCart);
  // }, []);

  // const handlePlaceOrder = useCallback(async () => {
  //   try {
  //     const draft = await fetchDraft();
  //     navigate('/order/new', { state: draft });
  //   } catch (err) {
  //     console.error('Error placing order:', err);
  //   }
  // }, [navigate]);

  const handleAddToCart = useCallback((item: MenuItem) => {
    // Prepare the item data according to the API requirements
    const cartItem = {
        _id:         item._id, 
        restaurantId: item.restaurantId,
        menuItemId:   item._id,
        name:         item.name,
        imageUrl:     item.imageUrl,
        quantity:     1,
        unitPrice:    item.price,
        notes:        ''    // or item.notes if you want to carry options
    };

    console.log('cartItem', cartItem)
    
    // Check if item already exists in cart
    const existingItem = cart.items.find(i => i.menuItemId === item._id);
    
    if (existingItem) {
      // If item exists, just update its quantity
      const newQuantity = existingItem.quantity + 1;
      handleUpdateQty(item._id, newQuantity);
    } else {
      // Add new item to cart through API
      addToCart(cartItem)
      .then(response => {
        return response;
      })
      .then(updatedCart => {
        setCart(updatedCart);
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
      });
    }


    sessionStorage.setItem('openCartAfterReload', 'true');
    navigate(0);

  }, [cart.items, handleUpdateQty, navigate]);

  useEffect(() => {
    if (sessionStorage.getItem('openCartAfterReload') === 'true') {
      setCartOpen(true);
      sessionStorage.removeItem('openCartAfterReload');
    }
  }, []);
  

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  
  const filteredMenuItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-blue-200 rounded-full"></div>
          <div className="mt-2 text-gray-500">Loading restaurant details...</div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-3xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Restaurant not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Restaurant Header */}
      <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative h-64 w-full">
          {restaurant.imageUrl ? (
            <img 
              src={restaurant.imageUrl} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg">No Image</span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              restaurant.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {restaurant.isAvailable ? 'Open' : 'Closed'}
            </span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
            </div>
            <button
              onClick={() => setCartOpen(!isCartOpen)}
              className="relative bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Cart ({cart.items.reduce((total, item) => total + item.quantity, 0)})
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{restaurant.address}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>{restaurant.contactNumber}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>{restaurant.email}</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{restaurant.openingHours}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-500 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path>
                </svg>
                <div className="flex flex-wrap gap-1">
                  {restaurant.cuisineType.map((cuisine, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
        </div>

        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredMenuItems.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-10 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No menu items found</h3>
            <p className="mt-1 text-gray-500">
              {activeCategory === 'all' 
                ? 'This restaurant has not added any menu items yet.' 
                : `No items found in the "${activeCategory}" category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => (
              <div 
                key={item._id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <span className="text-sm text-blue-600 font-medium">{item.category}</span>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">LKR {item.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart integration - show CartComponent directly for desktop, CartDrawer for mobile */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default RestaurantUserDetailPage;