// src/types/types.ts
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
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MenuItem {
    _id: string;
    restaurantId: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    imageUrl: string;
    preparationTime: number;
    createdAt: string;
    updatedAt: string;
  }