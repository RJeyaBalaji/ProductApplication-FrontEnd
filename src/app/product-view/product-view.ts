import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../service/product';
import { Product } from '../model/product.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../service/cart';
import { Auth } from '../service/auth';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-view.html',
  styleUrls: ['./product-view.css']
})
export class ProductView {
  productId!: number;
  product: Product | null = null;
  editForm!: FormGroup;
  selectedImage: File | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.product = data;
        this.editForm = this.fb.group({
          name: [data.name],
          description: [data.description],
          brand: [data.brand],
          category: [data.category],
          price: [data.price],
          stockQuantity: [data.stockQuantity],
          productAvailable: [data.productAvailable],
          releaseDate: [data.releaseDate]
        });
      },
      error: (err) => console.error('Error loading product:', err)
    });
  }

  get isAdmin(): boolean {
    return this.auth.getRole() === 'ADMIN';  // or whatever your role string is
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  editProduct() {
    if (!this.product) return;
    this.router.navigate(['/product/edit', this.product.id]);
  }

  deleteProduct() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.productId).subscribe({
        next: () => {
          alert('Product deleted');
          this.router.navigate(['/products']);
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product).subscribe({
        next: () => alert(`${this.product!.name} has been added to your cart.`),
        error: err => {
          console.error('Add to cart failed:', err);
          alert('Failed to add product to cart. Please try again.');
        }
      });
    }
  }

}
