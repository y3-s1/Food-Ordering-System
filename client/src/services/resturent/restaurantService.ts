import axios from 'axios';

export const getRestaurantById = async (restaurantId: string) => {
    const res = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('res.data', res.data)
    return res.data;
  };
