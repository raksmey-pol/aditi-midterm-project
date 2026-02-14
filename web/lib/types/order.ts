export interface OrderItem {
  id: string;
  productId: string;
  sellerId: string;
  productName: string;
  quantity: number;
  price: number;
  status?: string;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string; 
  items: OrderItem[];
}
