// src/app/service/customer.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseHttpService {

  constructor(http: HttpClient) {
    super(http, '/api/customer');
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.add(customer);
  }

  getCustomerById(id: number): Observable<Customer | null> {
    return this.http.get<Customer[]>(`${this.baseUrl}`).pipe(
      map((customers: Customer[]) => {
        const customer = customers.find(c => c.id === id);
        return customer || null;
      }),
      catchError(error => {
        console.error('Error fetching customers', error);
        return of(null); // Return null if there’s an error
      })
    );
  }


  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  signIn(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.add(loginData);
  }
}
