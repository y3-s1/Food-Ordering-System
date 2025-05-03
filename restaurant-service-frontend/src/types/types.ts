export type Restaurant = {
  _id: string;
  name: string;
  description: string;
  location: { lat: number; lng: number };
  address: string;
  contactNumber: string;
  email: string;
  cuisineType: string[];
  openingHours: string;
  isAvailable: boolean;
  imageUrl: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  ownerId: string;
};

export type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  restaurantId: string;
  imageUrl: string;
};
