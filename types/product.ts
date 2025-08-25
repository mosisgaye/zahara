export interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  rating?: number;
  handle?: string;
  description?: string;
  quantity?: number;
  variantId?: string;
  shopifyId?: string;
}

export interface CartItem extends Product {
  quantity: number;
  color?: string;
  size?: string;
  variantId?: string;
}