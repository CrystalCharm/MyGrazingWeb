package com.matoza.controller;

import com.matoza.model.Customer;
import com.matoza.service.CustomerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @RequestMapping("/api/customer")
    public ResponseEntity<?> getCustomers() {
        try {
            List<Customer> customers = customerService.getCustomers();
            return ResponseEntity.ok(customers);
        } catch (Exception ex) {
            log.error("Failed to retrieve order items: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/api/customer")
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        log.info("Create Input >> {}", customer);
        try {
            Customer newCustomer = customerService.create(customer);
            return ResponseEntity.ok(newCustomer);
        } catch (Exception ex) {
            log.error("Failed to create order item: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
    @PutMapping("/api/customer/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable int id, @RequestBody Customer customer) {
        log.info("Updating Customer with ID {} >> {}", id, customer);
        try {
            // Check if the item with the given ID exists
            Customer updatedCustomer = customerService.update(id, customer);
            return ResponseEntity.ok(updatedCustomer);
        } catch (EntityNotFoundException ex) {
            log.error("Customer with id {} not found: {}", id, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            log.error("Failed to update order item: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the order item.");
        }
    }


    @DeleteMapping("/api/customer/{id}")
    public ResponseEntity<?> delete(@PathVariable final Integer id) {
        log.info("Input >> {}", id);
        try {
            customerService.delete(id);
            return ResponseEntity.ok(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/api/customer/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable int id) {
        log.info("Fetching customer with ID: {}", id);
        try {
            Customer customer = customerService.findById(id);
            if (customer != null) {
                return ResponseEntity.ok(customer);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
            }
        } catch (Exception ex) {
            log.error("Failed to retrieve customer: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

}
