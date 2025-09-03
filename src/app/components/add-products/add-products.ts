import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { describe } from 'node:test';
import { ProductService } from '../../service/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [ FormsModule, CommonModule],
  templateUrl: './add-products.html',
  styleUrl: './add-products.css'
})
export class AddProducts {
  product: any = {
    name: '',
    brand: '',
    describe: '',
    price: '',
    category: '',
    stockQuantity: '',
    releaseDate: '',
    productAvailable: false
  }; 

  selectedImage: File | undefined;


  constructor(private productService: ProductService, private router: Router) {}

  handleImageChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
    }
  }
 
  onSubmit() {
  this.productService.addProduct(this.product, this.selectedImage).subscribe({
    next: (res) => {
      this.product = null;
      this.selectedImage = undefined;
      this.router.navigate(['/products']);
    },
    error: (err) => console.error('Error adding product:', err)
  });
}


}
