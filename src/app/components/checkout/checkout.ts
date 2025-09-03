import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout {
  checkoutForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private cartService: CartService, private router: Router) {
    this.checkoutForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      paymentMethod: ['cod', Validators.required]
    });
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.checkoutForm.value;

    this.cartService.placeOrder(formData).subscribe({
      next: res => {
        this.isLoading = false;
        alert('✅ Order placed successfully!');
        this.router.navigate(['/products']);
      },
      error: err => {
        this.isLoading = false;
        alert('❌ Failed to place order. Try again later.');
      }
    });
  }
}
