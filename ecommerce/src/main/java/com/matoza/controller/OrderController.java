package com.matoza.controller;

import com.matoza.model.Order;
import com.matoza.service.OrderService;
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
public class OrderController {

    @Autowired
    private OrderService orderService;

    @RequestMapping("/api/order")
    public ResponseEntity<?> getOrders() {
        try {
            List<Order> orders = orderService.getOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception ex) {
            log.error("Failed to retrieve order items: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/api/order")
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        log.info("Create Input >> {}", order);
        try {
            Order newOrder = orderService.create(order);
            return ResponseEntity.ok(newOrder);
        } catch (Exception ex) {
            log.error("Failed to create order item: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
    @PutMapping("/api/order/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable int id, @RequestBody Order order) {
        log.info("Updating Order with ID {} >> {}", id, order);
        try {
            // Check if the item with the given ID exists
            Order updatedOrder = orderService.update(id, order);
            return ResponseEntity.ok(updatedOrder);
        } catch (EntityNotFoundException ex) {
            log.error("Order with id {} not found: {}", id, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            log.error("Failed to update order item: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the order item.");
        }
    }


    @DeleteMapping("/api/order/{id}")
    public ResponseEntity<?> delete(@PathVariable final Integer id) {
        log.info("Input >> {}", id);
        try {
            orderService.delete(id);
            return ResponseEntity.ok(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

}
