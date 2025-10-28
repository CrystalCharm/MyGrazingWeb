import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { OrderItem } from '../model/orderItem';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseHttpService {
  private cartItems: OrderItem[] = [];
  private cartItemsSubject: BehaviorSubject<OrderItem[]> = new BehaviorSubject<OrderItem[]>(this.cartItems);

  private localCartCount: number = 0; // Local count of cart items
  private liveCartCount: number = 0; // Count from API

  private cartCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.localCartCount);

  constructor(protected override http: HttpClient, private authService: AuthService) { 
    super(http, '/api/orderItem');
    this.initializeCartCount();
  }

  private initializeCartCount(): void {
    const userId = Number(this.authService.getCurrentCustomerId());
    if (userId === 0) {
      this.clearCartForGuest();
    } else {
      this.getCartItemCountFromAPI().subscribe(count => {
        this.liveCartCount = count;
        this.localCartCount = count;
        this.cartCountSubject.next(this.localCartCount);
      });
    }
  }

  getCartItems(): Observable<OrderItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  getCartItemCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  private getCartItemCountFromAPI(): Observable<number> {
    const userId = Number(this.authService.getCurrentCustomerId());
    return this.http.get<OrderItem[]>(this.baseUrl).pipe(
      map((items: OrderItem[]) => {
        const userItems = userId === 0 
          ? items.filter(item => item.customerId === 0)
          : items.filter(item => item.customerId === userId);

        this.cartItems = userItems;
        this.cartItemsSubject.next(this.cartItems);
        this.localCartCount = userItems.length;
        this.liveCartCount = userItems.length;
        this.cartCountSubject.next(this.localCartCount);
        return userItems.length;
      })
    );
  }

  addItemToCart(item: OrderItem): Observable<OrderItem> {
    return this.add(item).pipe(
      tap(() => {
        this.cartItems.push(item);
        this.localCartCount++;
        this.updateCartCount();
        this.cartItemsSubject.next(this.cartItems);
      })
    );
  }

  removeItemFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${itemId}`).pipe(
      tap(() => {
        this.cartItems = this.cartItems.filter(item => item.productId !== itemId);
        this.localCartCount--;
        this.updateCartCount();
        this.cartItemsSubject.next(this.cartItems);
      })
    );
  }

  putUpdate(productId: number, orderItem: OrderItem): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.baseUrl}/${productId}`, orderItem).pipe(
      tap(updatedItem => {
        const index = this.cartItems.findIndex(existingItem => existingItem.productId === updatedItem.productId);
        if (index !== -1) {
          this.cartItems[index] = updatedItem;
          this.cartItemsSubject.next(this.cartItems);
        }
      })
    );
  }

  clearCartForGuest(): void {
    this.cartItems = [];
    this.localCartCount = 0;
    this.liveCartCount = 0;
    this.cartItemsSubject.next(this.cartItems);
    this.cartCountSubject.next(this.localCartCount);
  }

  private updateCartCount(): void {
    if (this.localCartCount !== this.liveCartCount) {
      this.cartCountSubject.next(this.localCartCount);
    } else {
      this.cartCountSubject.next(this.liveCartCount);
    }
  }

  /* Future implementation for live editing (e.g., status, quantity)
  updateItemStatus(itemId: number, status: string): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.baseUrl}/${itemId}/status`, { status });
  }

  updateItemQuantity(itemId: number, quantity: number): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.baseUrl}/${itemId}`, { quantity });
  }
  */
}
