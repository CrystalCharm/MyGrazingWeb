import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../model/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,
     private customerService: CustomerService,
     private router: Router
    ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      customerEmail: ['', [Validators.required, Validators.email]],
      customerUsername: ['', [Validators.required]],
      customerPassword: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      middlename: [''],
      lastname: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });
  }

  onSignup() {
    this.submitted = true; // Set to true when the form is submitted
    if (this.signupForm.valid) {
      const customer: Customer = { ...this.signupForm.value };
  
      this.customerService.add(customer).subscribe(
        response => {
          console.log('Customer created successfully:', response);
          console.log('Customer ID set:', response.customerId); // Assuming backend returns the customer with its ID
          // Redirect to login page
          this.router.navigate(['/signin']);
        },
        error => {
          console.error('Error creating customer:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
