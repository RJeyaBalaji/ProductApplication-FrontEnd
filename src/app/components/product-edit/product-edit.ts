import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product';
import { Product } from '../../model/product.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.html',
  styleUrls: ['./product-edit.css']
})
export class ProductEdit {
  productId!: number;
  product: Product | null = null;
  editForm!: FormGroup;
  selectedImage: File | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router
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

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  updateProduct() {
  if (!this.product || !this.editForm.valid) return;

  const updatedProduct: Product = {
    ...this.product,
    ...this.editForm.value
  };

  // If no new image is selected, convert existing base64 image to File
  if (!this.selectedImage && this.product.imagedata && this.product.imagetype) {
    const byteString = atob(this.product.imagedata);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([intArray], { type: this.product.imagetype });
    this.selectedImage = new File([blob], 'existing-image', { type: this.product.imagetype });
  }

  this.productService.updateProduct(this.productId, updatedProduct, this.selectedImage).subscribe({
    next: () => {
      alert('✅ Product updated successfully');
      this.router.navigate(['/products']);
    },
    error: (err) => console.error('Update failed:', err)
  });
}


  deleteProduct() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.productId).subscribe({
        next: () => {
          alert('🗑️ Product deleted');
          this.router.navigate(['/products']);
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }
}
