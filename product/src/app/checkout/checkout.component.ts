// src/app/component/checkout.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';
import { Router, NavigationStart } from '@angular/router';
import { Order } from '../model/order';
import { Subscription, forkJoin, of } from 'rxjs';
import { OrderItem } from '../model/orderItem';
import { CartService } from '../service/cart.service';
import { Customer } from '../model/customer';
import { CustomerService } from '../service/customer.service';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';
import { finalize } from 'rxjs/operators';
import { catchError, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public orders: Order[] = [];
  public orderItems: OrderItem[] = [];
  private currentCustomerId: string | null = null;
  totalAmount: number = 0;
  public paid: boolean = false;
  public paymentSuccess: boolean = false;
  private routerSubscription!: Subscription;
  public selectedPaymentMethod: string = '';
  public customerName: string = '';
  public customerEmail: string = '';
  public address: string = '';
  public phoneNumber: string = '';
  public currentOrderId: number = 0;
  public transactionId: string ='';
  public orderId: number = 0;
  processingOrder: boolean = false;
  orderStatus: string = 'Check-out-in-progress'; 
  public isProcessing: boolean = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private cartService: CartService,
    private customerService: CustomerService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentCustomerId = this.authService.getCurrentCustomerId();
    this.loadOrders();
    this.subscribeToRouterEvents();
    this.populateCustomerDetails(); // Populate customer details
    this.transactionId = this.generateTransactionId();
    window.addEventListener('beforeunload', this.handleBeforeUnload);




  this.productService.getAllProducts().subscribe(products => {
    console.log('Products retrieved in CheckoutComponent:', products);
    this.logMatchingProducts(products);
  });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  private populateCustomerDetails(): void {
    const customerId = this.authService.getCurrentCustomerId();
    if (customerId) {
      const idNumber = Number(customerId);
      this.customerService.getCustomerById(idNumber).subscribe(
        (customer: Customer | null) => {
          if (customer) {
            this.customerName = `${customer.firstname} ${customer.lastname}`;
            this.customerEmail = customer.customerEmail;
            this.address = customer.address;
            this.phoneNumber = customer.phoneNumber;
            console.log('Customer details populated:', {
              name: this.customerName,
              email: this.customerEmail,
              address: this.address,
              phoneNumber: this.phoneNumber
              
            });
          } else {
            console.warn('Customer not found');
          }
        },
        error => {
          console.error('Error fetching customer details', error);
        }
      );
    }
  }
// New method to log products that match order.productId
private logMatchingProducts(products: Product[]): void {
  this.orders.forEach(order => {
    const matchingProduct = products.find(product => product.id === order.productId);
    if (matchingProduct) {
      console.log('Matching product found for order productId:', {
        orderId: order.id,
        productId: matchingProduct.id,
        productDetails: matchingProduct
      });
    } else {
      console.warn(`No matching product found for order productId: ${order.productId}`);
    }
  });
}
  private handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (!this.paid && this.orders.length > 0) {
      const confirmationMessage = 'You have items in your checkout. If you leave this page, those items will be deleted.';
      event.returnValue = confirmationMessage; 
    }
  }

  private loadOrders(): void {
    this.orderService.getOrdersByCustomerId(this.currentCustomerId).subscribe({
      next: (data: Order[]) => {
        this.orders = data.filter(order => 
          order.customerId === Number(this.currentCustomerId) && 
          order.status === "Check-out-in-progress"
        );
        this.calculateTotalAmount();

        if (this.orders.length > 0 && this.orders[0].id !== undefined) {
          this.currentOrderId = this.orders[0].id;
          //this.orders[0].transactionId = this.transactionId;
        } else {
          console.error('No valid orders found or order ID is undefined');
          this.currentOrderId = 0; 
        }

        this.orderStatus = this.orders.length > 0 ? this.orders[0].status : 'No orders found';
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  simulateEwalletPayment(): void {
    this.isProcessing = true;
    this.paymentSuccess = false;
  
    console.log('Processing payment for the following orders:', this.orders);
    this.processingOrder = true;
  
    setTimeout(() => {
      this.paid = true;
      this.isProcessing = false;
      this.processingOrder = false;
      this.paymentSuccess = true;
  
      const updateObservables = this.orders.map(order => {
        if (order.id !== undefined) {
          order.status = 'To Ship'; 
          order.address = this.address; // Use the populated address
          order.customerName = this.customerName;
          order.transactionId = Number(this.transactionId.replace('T100', ''));  // Convert to number
  
          console.log('Updating order:', order);
          
          // Update order in OrderService
          return this.orderService.putUpdate(order.id, order);
        } else {
          console.error('Order ID is undefined for the order:', order);
          return of(null); 
        }
      });
  
      forkJoin(updateObservables).pipe(
        finalize(() => {
          // After updating orders, handle stock decrement for each order's product
          this.updateProductStocks();
        })
      ).subscribe({
        next: (responses) => {
          responses.forEach((response, index) => {
            if (response) {
              console.log(`Order ID ${this.orders[index].id} status updated to 'To Ship':`, response);
            }
          });
          this.removeItemsFromCart();
        },
        error: (error) => {
          console.error('Error updating orders:', error);
        },
      });
    }, 2000);
  }
  
  private updateProductStocks(): void {
    const stockUpdateObservables = this.orders.map(order => {
      return this.productService.getProductById(order.productId).pipe(
        switchMap(product => {
          if (product) {
            const updatedStock = Math.max(0, parseInt(product.quantityInStock || '0', 10) - order.quantity);
            product.quantityInStock = updatedStock.toString();
  
            console.log(`Updating stock for product ID ${product.id}: New stock = ${product.quantityInStock}`);
  
            // Update the product stock in ProductService
            return this.productService.putUpdate(product);
          } else {
            console.warn(`Product with ID ${order.productId} not found.`);
            return of(null);
          }
        }),
        catchError(error => {
          console.error(`Error updating stock for product with ID ${order.productId}:`, error);
          return of(null);
        })
      );
    });
  
    // Perform all stock updates simultaneously
    forkJoin(stockUpdateObservables).subscribe({
      next: responses => {
        responses.forEach((response, index) => {
          if (response) {
            console.log(`Product stock updated for order ID ${this.orders[index].id}:`, response);
          }
        });
      },
      error: error => {
        console.error('Error updating product stocks:', error);
      }
    });
  }
  

  private subscribeToRouterEvents(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.confirmNavigation(event);
      }
    });
  }


  private removeCurrentOrders(): void {
    this.orders.forEach(order => {
      if (order.id) {
        this.orderService.removeOrder(order.id).subscribe({
          next: () => {
            console.log(`Order with ID ${order.id} deleted successfully.`);
            // Optionally: Remove from local orders array if needed
            this.orders = this.orders.filter(o => o.id !== order.id);
          },
          error: (error) => {
            console.error('Error deleting order:', error);
          }
        });
      }
    });
  }


  
  private confirmNavigation(event: NavigationStart): void {
    if (!this.paid && this.orders.length > 0) {
      const confirmation = confirm('You have items in your checkout. If you leave this page, those items will be deleted. Do you want to proceed?');
      if (confirmation) {
        this.removeCurrentOrders();
      } else {
        this.router.navigateByUrl(this.router.url);
      }
    }
  }

  private removeItemsFromCart(): void {
    const removeObservables = this.orders.map(order => {
      if (order.orderId) {
        return this.cartService.removeItemFromCart(order.orderId);
      } else {
        console.error('Order ID is undefined for the order:', order);
        return of(null); 
      }
    });

    forkJoin(removeObservables).subscribe({
      next: responses => {
        responses.forEach((response, index) => {
          if (response) {
            console.log(`Order Item with ID ${this.orders[index].orderId} removed from the cart.`);
          }
        });
      },
      error: (error) => {
        console.error('Error removing order item from cart:', error);
      },
    });
  }

  closePaymentModal(): void {
    this.paymentSuccess = false;
  }

  private calculateTotalAmount(): void {
    this.totalAmount = this.orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
  }

// src/app/component/checkout.component.ts

printInvoice(): void {
  const orderSummary = document.getElementById('order-summary');
  if (orderSummary) {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      // Copy the order summary content to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              /* Add basic styles here for the print view */
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .text-primary { color: #007bff; font-weight: bold; }
            </style>
          </head>
          <body>
            ${orderSummary.innerHTML}
          </body>
        </html>
      `);

      // Wait until content is loaded, then print and close the window
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  } else {
    console.error('Order summary not found.');
  }
}


  updatePaymentButton(): void {
    this.paymentSuccess = false;
    this.paid = false;
  }


  private generateTransactionId(): string {
    const prefix = "T100";
    let unique = false;
    let transactionId = "";

    while (!unique) {
      // Generate a random alphanumeric string of length 8
      const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
      transactionId = `${prefix}${randomString}`;

      // Here we assume `checkTransactionIdUnique` checks existing IDs to ensure uniqueness
      unique = this.checkTransactionIdUnique(transactionId);
    }

    return transactionId;


  }


  private checkTransactionIdUnique(transactionId: string): boolean {
    // This should be replaced with actual logic to verify uniqueness, such as querying the backend.
    // For now, assume it's unique by default for demonstration.
    // In practice, store existing transaction IDs or query an API to validate uniqueness.
    return !this.orders.some(order => String(order.transactionId) === transactionId);

  }



}
