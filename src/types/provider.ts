export interface Provider {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  category: string;
  city: string;
  area: string;
  description: string;
  priceAmount: number;
  priceType: string;
  averageRating: number;
  verified: boolean;
}
