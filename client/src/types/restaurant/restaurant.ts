export interface Restaurant {
    _id: string;
    name: string;
    description: string;
    address: string;
    contactNumber: string;
    email: string;
    cuisineType: string[];
    openingHours: string;
    isAvailable: boolean;
    imageUrl: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    imageUrl: string;
    restaurantId: string;
    createdAt: Date;
    updatedAt: Date;
  }