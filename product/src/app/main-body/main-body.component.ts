// src/app/component/main-body.component.ts

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { AuthService } from '../service/auth.service';
import { CustomerService } from '../service/customer.service';
import { Product } from '../model/product';
import { ProductCategory } from '../model/product-category';
import { Customer } from '../model/customer';

@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.css']
})
export class MainBodyComponent implements OnInit {
  public products: Product[] = [];
  public userEmail: string | null = null;
  public gender: string | null = null;
  public address: string | null = null;
  public phoneNumber: string | null = null;
  public customerId: number | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  // src/app/component/main-body.component.ts

// src/app/component/main-body.component.ts

ngOnInit(): void {
  console.log("ngOnInit called");

  const status = this.authService.isLoggedIn() ? 'user' : 'guest';
  console.log(`Current login status: ${status}`);

  if (this.authService.isLoggedIn()) {
    this.userEmail = this.authService.getCurrentUserEmail();
    this.gender = this.authService.getCurrentGender();
    console.log(`Current user email: ${this.userEmail}`);
    console.log('Current gender: ', this.gender);

    const customerId = this.authService.getCurrentCustomerId();
    if (customerId) {
      const idNumber = Number(customerId);

      this.customerService.getCustomerById(idNumber).subscribe(
        (customer: Customer | null,) => {
          if (customer) { // Check if customer is not null
            console.log('Customer object:', customer); // Log the entire customer object
            this.address = customer.address;
            this.phoneNumber = customer.phoneNumber;
            this.customerId = customer.id;
            

            // Log the specific fields for verification
            console.log('Customer Address:', this.address);
            console.log('Customer Phone Number:', this.phoneNumber);
          } else {
            console.warn('Customer not found.');
          }
        },
        error => {
          console.error('Error fetching customer details', error);
        }
      );
    }
  } else {
    console.log("No user is logged in.");
  }

  this.productService.getData().subscribe((data: ProductCategory[]) => {
    this.products = data.flatMap(category => category.products);
  });
}



  viewProduct(product: Product): void {
    console.log(`Viewing product: ${product.name}`);
  }

  navigateToAllProducts(): void {
    console.log("Navigating to all products");
  }
}
