import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { Order } from '../model/order';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseHttpService {
  private orders: Order[] = []; // Local state for orders
  private ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(this.orders);

  constructor(protected override http: HttpClient) { 
    super(http, '/api/order');
  }

  saveOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  getOrdersByCustomerId(customerId: string | null): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl).pipe(
      map((orders: Order[]) => {
        this.orders = orders.filter(order => order.customerId.toString() === customerId);
        this.ordersSubject.next(this.orders); // Update the observable state
        return this.orders;
      })
    );
  }

  removeOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${orderId}`).pipe(
      tap(() => {
        this.orders = this.orders.filter(order => order.id !== orderId);
        this.ordersSubject.next(this.orders); // Update the observable state
      })
    );
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    const url = `${this.baseUrl}/${orderId}/status`;
    return this.http.put(url, { status });
  }

  // putUpdate method for updating an existing order
  putUpdate(orderId: number, updatedOrder: Order): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}`, updatedOrder).pipe(
      tap((updatedOrderResponse: Order) => {
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrderResponse; // Update the local orders array
          this.ordersSubject.next(this.orders); // Notify subscribers of changes
        }
      })
    );
  }

  // Observable to provide the orders data
  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

 
// In your order.service.ts



}
