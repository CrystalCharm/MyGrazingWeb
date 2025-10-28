package com.matoza.service;

import com.matoza.model.OrderItem;

import java.util.List;

public interface OrderItemService {
    List<OrderItem> getOrderItems();
    OrderItem create(OrderItem orderItem);
    OrderItem update(int id, OrderItem orderItem);
    void delete(Integer id);

}
