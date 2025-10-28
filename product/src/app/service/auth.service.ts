import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomerService } from './customer.service';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.checkLoggedInStatus());
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private customerService: CustomerService) {}

  signIn(email: string, password: string): Observable<any> {
    return this.customerService.findAll().pipe(
      map(customers => {
        const user = customers.find((customer: any) => 
          customer.customerEmail === email && customer.customerPassword === password
        );

        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUserEmail', user.customerEmail); // Store the user email
          localStorage.setItem('currentUsername', user.customerUsername);
          localStorage.setItem('currentCustomerId', user.id);
          localStorage.setItem('currentGender', user.gender);
          localStorage.setItem('currentPhoneNumber', user.phoneNumber);
          localStorage.setItem('currentAddress', user.address);


          this.loggedInSubject.next(true);
          return { success: true };
        } else {
          throw new Error('Invalid email or password');
        }
      }),
      catchError(error => {
        console.error('Error during sign-in:', error);
        throw error;
      })
    );
}


  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserEmail'); // Remove the user email on logout
    localStorage.removeItem('currentUsername'); // Remove the username on logout
    localStorage.removeItem('currentCustomerId'); // Remove the user id on logout
    localStorage.removeItem('currentGender');
    localStorage.removeItem('currentPhoneNumber');
    localStorage.removeItem('currentAddress');
    

    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.getValue();
  }

  private checkLoggedInStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }


  getCurrentUserEmail(): string | null {
    return localStorage.getItem('currentUserEmail');
  }
  getCurrentUsername(): string | null {
    return localStorage.getItem('currentUsername');
}
getCurrentCustomerId(): string | null {
  return localStorage.getItem('currentCustomerId');
}

getCurrentGender(): string | null {
  return localStorage.getItem('currentGender');
}

getCurrentPhoneNumber(): string | null {
  return localStorage.getItem('currentPhoneNumber');
}

getCurrentAddress(): string | null {
  return localStorage.getItem('currentAddress');
}





}
