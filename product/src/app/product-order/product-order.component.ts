import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';
import { Order } from '../model/order';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent implements OnInit, OnDestroy {
  public orders: Order[] = [];
  private currentCustomerId: string | null = null;
  private orderSubscription!: Subscription;
  
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentCustomerId = this.authService.getCurrentCustomerId();
    this.loadOrders();
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  private loadOrders(): void {
    this.orderSubscription = this.orderService.getOrdersByCustomerId(this.currentCustomerId).subscribe({
      next: (data: Order[]) => {
        // Filter orders to exclude "Check-out-in-progress" and show only recent orders
        this.orders = data.filter(order => 
          order.customerId === Number(this.currentCustomerId) && 
          order.status !== "Check-out-in-progress"
        );

        if (this.orders.length === 0) {
          console.warn('No recent orders found for this customer.');
        }
      },
      error: (error) => {
        console.error('Error fetching recent orders:', error);
      }
    });
  }

  viewOrderDetails(orderId: number): void {
    // Navigate to order details page, or handle order details display logic
    this.router.navigate(['/order-details', orderId]);
  }
}
