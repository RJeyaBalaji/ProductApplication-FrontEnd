import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({providedIn: 'root'})
export class ProductService {
  private baseUrl = 'http://localhost:8083/api/product';

  constructor(private http: HttpClient) {}

  addProduct(product: any, imageFile?: File): Observable<string> {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }
  return this.http.post(`${this.baseUrl}`, formData, { responseType: 'text' });
}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}s`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateProduct(id: number, product: Product, imageFile?: File): Observable<String>{
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json'}));
    if(imageFile){
      formData.append('imageFile', imageFile);
    }
    return this.http.put(`${this.baseUrl}/${id}`, formData, {responseType: 'text'});
  }

}
