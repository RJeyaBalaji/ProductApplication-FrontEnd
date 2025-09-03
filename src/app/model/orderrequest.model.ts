export interface OrderRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}
