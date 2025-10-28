import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { Observable, of } from 'rxjs';
import { Product } from '../model/product';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseHttpService {

  constructor(protected override http: HttpClient) { 
    super(http, '/api/product');
  }

  getProductById(productId: number): Observable<Product | null> {
    return this.http.get<{ categoryName: string, products: Product[] }[]>(this.baseUrl).pipe(
      map((categories) => {
        console.log(categories); // Log the categories and products for debugging
        for (const category of categories) {
          const product = category.products.find((product) => product.id === productId);
          if (product) {
            return product; // Return the found product
          }
        }
        return null; // Return null if no product is found
      }),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of(null); // Return null in case of error
      })
    );
  }
  

  // Update product details
// Update product details
// Update product details by sending the entire product object
putUpdate(product: Product): Observable<Product> {
  return this.http.put<Product>(`${this.baseUrl}`, product).pipe(
    tap(updatedProduct => {
      console.log(`Successfully updated product with ID ${updatedProduct.id}:`, updatedProduct);
    }),
    catchError(error => {
      console.error('Failed to update product:', error);
      return of(null as any); // Return null in case of error
    })
  );
}


  // Add this method in ProductService
getAllProducts(): Observable<Product[]> {
  return this.http.get<{ categoryName: string, products: Product[] }[]>(this.baseUrl).pipe(
    map((categories) => {
      const allProducts: Product[] = categories.flatMap(category => category.products);
      console.log('All Products:', allProducts); // Log all products for debugging
      return allProducts;
    }),
    catchError((error) => {
      console.error('Error fetching all products:', error);
      return of([]); // Return an empty array in case of error
    })
  );
}

  
}
