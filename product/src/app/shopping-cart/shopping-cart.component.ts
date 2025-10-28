import { Component } from '@angular/core';
import { CartService } from '../service/cart.service';
import { OrderItem } from '../model/orderItem';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Order } from '../model/order';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  public orderItems: OrderItem[] = [];
  public hasSelectedItems: boolean = false;
  public isGuest: boolean = true;
  overallTotal: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.isGuest = !this.authService.isLoggedIn();
    this.loadCartData();
  }

  loadCartData(): void {
    this.cartService.getData().subscribe((data: OrderItem[]) => {
      console.log('Loaded data:', data);

      if (!this.isGuest) {
        const currentCustomerId = this.authService.getCurrentCustomerId();
        if (currentCustomerId) {
          // Logged-in users see only their own items
          this.orderItems = data.filter(item => item.customerId.toString() === currentCustomerId);
        }
      } else {
        // Guests see only items with customerId == 0
        this.orderItems = data.filter(item => item.customerId === 0);
      }

      this.checkSelectedItems();
    });
  }

  toggleSelection(item: OrderItem): void {
    item.status = item.status === "selected" ? "not_selected" : "selected";
    console.log(`Toggled selection for Item ID: ${item.id}, Status: ${item.status}`);
    this.checkSelectedItems();
  }

  checkSelectedItems(): void {
    this.hasSelectedItems = this.orderItems.some(item => item.status === 'selected');
  }

  calculateTotalPerItem(quantity: number, price: string): string {
    const itemTotal = quantity * Number(price);
    return itemTotal.toFixed(2);
  }

  getOverallTotal(): number {
    return this.orderItems
      .filter(item => item.status === "selected")
      .reduce((total, item) => {
        const itemQuantity = Number(item.quantity);
        const itemPrice = Number(item.price);
        return total + (itemQuantity * itemPrice);
      }, 0);
  }

  formatPrice(price: string): string {
    return `&#8369;${parseFloat(price).toFixed(2)}`;
  }

  increaseQuantity(item: OrderItem): void {
    item.quantity++;
    item.showConfirm = true;
  }

  decreaseQuantity(item: OrderItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      item.showConfirm = true;
    }
  }

  confirmQuantityChange(item: OrderItem): void {
    item.showConfirm = false;
  }

  removeItem(item: OrderItem): void {
    if (!item.id) {
      console.error('Item ID is undefined. Cannot remove item.');
      alert('Item ID is not defined. Cannot remove item.');
      return;
    }

    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeItemFromCart(item.id).subscribe({
        next: () => {
          this.orderItems = this.orderItems.filter(i => i.id !== item.id);
          this.checkSelectedItems();
        },
        error: (err) => {
          console.error('Error removing item:', err);
          alert('Failed to remove item. Please try again.');
        }
      });
    }
  }

  OnCheckOut(): void {
    if (this.isGuest) {
      // Display a message prompting the guest to register
      alert('Please register or log in to check out items.');
      this.router.navigate(['/signup']); // Redirect to signup page if desired
      return;
    }
  
    const selectedItems = this.orderItems.filter(item => item.status === "selected");
  
    selectedItems.forEach(item => {
      const currentOrderId = item.id;
  
      if (!currentOrderId || currentOrderId === 0) {
        console.warn(`Invalid item ID: ${currentOrderId}. Skipping item.`);
        return;
      }
  
      const newOrder: Order = {
        customerId: item.customerId,
        address: "",
        phoneNumber: "",
        customerName: item.customerName || "",
        orderId: currentOrderId,
        productId: item.productId,
        productName: item.productName,
        imageFile: item.imageFile,
        quantity: item.quantity,
        price: item.price,
        uom: item.uom,
        status: "Check-out-in-progress",
        transactionId: 0,
        transactionDate: new Date().toISOString(),
        totalAmount: this.calculateTotalPerItem(item.quantity, item.price)
      };
  
      console.log(`Processing checkout for Item ID: ${currentOrderId}`);
  
      this.orderService.saveOrder(newOrder).subscribe({
        next: (response: Order) => {
          console.log('Order saved successfully:', response);
          this.router.navigate(['/checkout']);
        },
        error: (error: any) => {
          console.error('Error saving order:', error);
        }
      });
    });
  }
  
}
