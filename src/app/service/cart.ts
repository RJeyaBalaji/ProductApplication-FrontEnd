import { Injectable } from '@angular/core';
import { CartItem } from '../model/cart.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:8083/api/cart'; 
  private checkoutUrl = 'http://localhost:8083/api/checkout';

  constructor(private http: HttpClient) {}

  private getUserEmail(): string {
    return sessionStorage.getItem('email') || '';
  }

  getCart(): Observable<CartItem[]> {
    const email = this.getUserEmail();
    return this.http.get<CartItem[]>(`${this.apiUrl}?email=${email}`);
  }

  addToCart(product: Product, quantity: number = 1): Observable<any> {
    const email = this.getUserEmail();

    const body = new HttpParams()
      .set('email', email)
      .set('productId', product.id.toString())
      .set('quantity', quantity.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${this.apiUrl}/add`, body.toString(), { headers });
  }

  removeFromCart(cartItemId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${cartItemId}?productId=${productId}`);
  }


  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear?email=${this.getUserEmail()}`);
  }

  updateQuantity(cartItemId: number, productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, {
      cartItemId,
      productId,
      quantity
    });
  }

  placeOrder(formData: any): Observable<any> {
  const token = sessionStorage.getItem('jwtToken');
  console.log('Token:', token);
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post('http://localhost:8083/api/checkout', formData, { headers });
}
 
}
