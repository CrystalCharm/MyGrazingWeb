import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { OrderItem } from '../model/orderItem';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
/*
  it('should add item to cart and update cart items subject', () => {
    const newItem: OrderItem = {
      productId: 1,
      productName: 'Test Product',
      imageFile: 'test.jpg',
      quantity: 1,
      price: "100",
      uom: 'pcs',
      status: '',
      customerId: 1,
      orderId: 0,
      
  
    };

    service.addItemToCart(newItem).subscribe(response => {
      expect(response).toBeTruthy(); // Ensure it returns a response
    });

    const req = httpMock.expectOne('/api/orderItem');
    expect(req.request.method).toBe('POST');
    req.flush(newItem); // Simulate API response

    

    // Subscribe to the cart items


    
    
    





  });
  */
});
