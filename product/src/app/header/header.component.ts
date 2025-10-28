import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuService } from '../service/menu.service';
import { Menu } from '../model/menu';
import { CartService } from '../service/cart.service'; 
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Import AuthService

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public menus: Menu[] = [];
  public cartItemCount: number = 0;
  public isLoggedIn: boolean = false; // Track login state
  public username: string | null = null; // To hold the username
  public userEmail: string | null = null; // To hold the user email

  constructor(
    private menuService: MenuService, 
    private cartService: CartService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.menuService.getData().subscribe(data => { 
      this.menus = data; 
    });

    // Get initial count of items in the cart
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });

    // Check if the user is logged in
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.username = this.authService.getCurrentUsername(); // Get username from AuthService
      this.userEmail = localStorage.getItem('currentUserEmail'); // Get email from local storage
    }
  }

  logout(): void {
    this.authService.logout(); // Call the logout method in AuthService
    this.username = null; // Reset username
    this.userEmail = null; // Reset email
    this.isLoggedIn = false; // Update login state
    
    this.refreshLogout();
}



  refreshCart() {
    this.router.navigate(['/cart']).then(() => {
      setTimeout(() => {
        window.location.reload(); 
      }, 100); 
    });
  }
  refreshLogout() {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        window.location.reload(); 
      }, 100); 
    });
  }


  
}
