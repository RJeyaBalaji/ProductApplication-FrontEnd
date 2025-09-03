import { Component, OnInit } from '@angular/core';
import { Order } from '../../service/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  imports: [ CommonModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit{
  orders: Order[] = [];
  loading = false;
  error = '';

  constructor(private orderService: Order) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  getOrderTotal(order: Order): number {
  return order.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);
}


  fetchOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.error = 'Failed to load your orders. Please try again later.';
        this.loading = false;
      }
    });
  }
}
