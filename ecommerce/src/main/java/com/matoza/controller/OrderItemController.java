package com.matoza.controller;

import com.matoza.model.OrderItem;
import com.matoza.service.OrderItemService;
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
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    @RequestMapping("/api/orderItem")
    public ResponseEntity<?> getOrderItems() {
        try {
            List<OrderItem> orderItems = orderItemService.getOrderItems();
            return ResponseEntity.ok(orderItems);
        } catch (Exception ex) {
            log.error("Failed to retrieve order items: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/api/orderItem")
    public ResponseEntity<?> createOrderItem(@RequestBody OrderItem orderItem) {
        log.info("Create Input >> {}", orderItem);
        try {
            OrderItem newOrderItem = orderItemService.create(orderItem);
            return ResponseEntity.ok(newOrderItem);
        } catch (Exception ex) {
            log.error("Failed to create order item: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
    @PutMapping("/api/orderItem/{id}")
    public ResponseEntity<?> updateOrderItem(@PathVariable int id, @RequestBody OrderItem orderItem) {
        log.info("Updating OrderItem with ID {} >> {}", id, orderItem);
        try {
            // Check if the item with the given ID exists
            OrderItem updatedOrderItem = orderItemService.update(id, orderItem);




            return ResponseEntity.ok(updatedOrderItem);
        } catch (EntityNotFoundException ex) {
            log.error("OrderItem with id {} not found: {}", id, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            log.error("Failed to update order item: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the order item.");
        }
    }



    @DeleteMapping("/api/orderItem/{id}")
    public ResponseEntity<?> delete(@PathVariable final Integer id) {
        log.info("Input >> {}", id);
        try {
            orderItemService.delete(id);
            return ResponseEntity.ok(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

}
