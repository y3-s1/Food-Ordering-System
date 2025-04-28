export interface IRestaurant {
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
    location: {
      lat: number;
      lng: number;
    };
    createdAt: string;
    updatedAt: string;
  }
  