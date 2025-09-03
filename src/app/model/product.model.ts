export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  category: string;
  releaseDate: string; 
  productAvailable: boolean;
  stockQuantity: number;
  imagename?: string;
  imagetype?: string;
  imagedata?: string; 
}
