import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../service/cart';
import { CartItem } from '../../model/cart.model';
import { Subscription } from 'rxjs';
import { Auth } from '../../service/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  cartCount: number = 0;
  private subscriptions: Subscription[] = [];
  isLoggedIn: boolean = false;

  constructor(private cartService: CartService, private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    // Initialize login status immediately
    this.isLoggedIn = this.auth.isAuthenticated();

    this.fetchCart();

    // Listen for login/logout events to update cart & login status
    const loginSub = this.auth.loginStatus$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      this.fetchCart();
    });

    this.subscriptions.push(loginSub);
  }

  logout(): void {
    this.auth.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  fetchCart(): void {
    if (!this.isLoggedIn) {
      this.cartCount = 0; // Clear cart count if not logged in
      return;
    }

    const cartSub = this.cartService.getCart().subscribe({
      next: (cartItems: CartItem[]) => {
        this.cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      },
      error: err => {
        console.error('Error fetching cart items:', err);
        this.cartCount = 0;
      }
    });

    this.subscriptions.push(cartSub);
  }

  get isAdmin(): boolean {
    return this.auth.getRole() === 'ADMIN';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
