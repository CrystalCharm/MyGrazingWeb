package com.matoza.service;

import com.matoza.model.Order;

import java.util.List;

public interface OrderService {

    List<Order> getOrders();
    Order create(Order order);
    Order update(int id, Order order);
    void delete(Integer id);
    
    
    
    
    /*
    Order create(Order order);
    Order invoice(Order order);
    Order pay(Order order);
    Order pick(Order order);
    Order ship(Order order);
    Order complete(Order order);
    Order cancel(Order order);
    Order suspend(Order order);
    Order update(Order order);
     */
}
