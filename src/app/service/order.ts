// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  // add other product fields as needed
}

export interface OrderItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Order {
  id: number;
  orderDate: string;
  status: string;
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: string;
  paymentSuccessful: boolean;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class Order {

  private baseUrl = 'http://localhost:8083/api/orders';

  constructor(private http: HttpClient) { }

  getMyOrders(): Observable<Order[]> {
  const token = sessionStorage.getItem('jwtToken'); // or wherever you store it

  return this.http.get<Order[]>('http://localhost:8083/api/orders/my', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

}
