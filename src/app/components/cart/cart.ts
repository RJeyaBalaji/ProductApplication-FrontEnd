import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../service/cart';
import { CartItem } from '../../model/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: items => this.cartItems = items,
      error: err => console.error('Error loading cart:', err)
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id, item.product.id).subscribe({
      next: () => this.loadCart(),
      error: err => console.error('Error removing item:', err)
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe({
      next: () => this.cartItems = [],
      error: err => console.error('Error clearing cart:', err)
    });
  }

  incrementQty(item: CartItem) {
    const newQty = item.quantity + 1;
    this.cartService.updateQuantity(item.id, item.product.id, newQty).subscribe({
      next: () => this.loadCart(),
      error: err => console.error('Error updating quantity:', err)
    });
  }

  decrementQty(item: CartItem) {
    const newQty = item.quantity - 1;
    if (newQty <= 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item.id, item.product.id, newQty).subscribe({
        next: () => this.loadCart(),
        error: err => console.error('Error updating quantity:', err)
      });
    }
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
