import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../service/customer.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { OrderItem } from '../model/orderItem';
import { CartService } from '../service/cart.service';
import { switchMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { Product } from '../model/product';
import { catchError, retry, delay } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm!: FormGroup;
  errorMessage: string = '';
  private currentCurrentCustomerId: string | null = "";
  private currentUsername: string | null = "";

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.signinForm = this.fb.group({
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPassword: ['', [Validators.required]],
    });
  }

  onSignin() {
    this.authService.signIn(this.signinForm.value.customerEmail, this.signinForm.value.customerPassword)
      .subscribe(
        () => {
          this.currentCurrentCustomerId = this.authService.getCurrentCustomerId();
          this.currentUsername = this.authService.getCurrentUsername();
  
          // Navigate to the homepage
          this.router.navigate(['']).then(() => {
            // Update guest items' customer ID in the background
            this.updateCusIDofOrdID().subscribe({
              next: responses => {
                console.log('Updated customer IDs for guest items:', responses);
                
                // Add a slight delay before refreshing to ensure updates are complete
                setTimeout(() => {
                  window.location.reload();
                }, 200); // Adjust delay as needed
              },
              error: error => console.error('Error updating customer IDs for guest items:', error)
            });
          });
        },
        error => {
          this.errorMessage = error.message;
        }
      );
  }
  
  

  updateCusIDofOrdID() {
    return this.cartService.getData().pipe(
      switchMap((items: OrderItem[]) => {
        const guestItems = items.filter(item => item.customerId === 0);
        const currentUserItems = items.filter(item => item.customerId === Number(this.currentCurrentCustomerId));
  
        const updateObservables = guestItems.map(item => {
          const existsInCurrentCart = currentUserItems.some(userItem => userItem.productId === item.productId);
          
          if (!existsInCurrentCart) {
            const updatedItem: OrderItem = {
              ...item,
              customerId: Number(this.currentCurrentCustomerId),
              customerName: this.currentUsername || ''
            };
            return this.cartService.putUpdate(item.id, updatedItem).pipe(
              retry(3),
              catchError(error => {
                console.error(`Failed to update item ${item.id}`, error);
                return of(null);
              })
            );
          } else {
            console.log(`Item with productId ${item.productId} already exists in the current user's cart. Skipping update.`);
            return of(null);
          }
        }).filter(obs => obs !== null);
  
        return forkJoin(updateObservables);
      }),
      delay(200)
    );
  }
  
  
}
