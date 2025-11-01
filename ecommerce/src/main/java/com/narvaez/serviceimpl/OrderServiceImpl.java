package com.narvaez.serviceimpl;

import com.narvaez.entity.OrderData;
import com.narvaez.model.Order;
import com.narvaez.repostory.OrderDataRepository;
import com.narvaez.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;


@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderDataRepository orderDataRepository;

    @Override
    public List<Order> getOrders() {
        List<OrderData> ordersData = new ArrayList<>();
        List<Order> orders = new ArrayList<>();
        orderDataRepository.findAll().forEach(ordersData::add);
        Iterator<OrderData> it = ordersData.iterator();
        while (it.hasNext()) {
            OrderData orderData = it.next();
            Order order = new Order();
            order.setId(orderData.getId());

            //Customer Data
           // order.setOrderId(orderData.getOrderId());
            order.setCustomerId(orderData.getCustomerId());
            order.setCustomerName(orderData.getCustomerName());

            //Product Data
            order.setProductId(orderData.getProductId());
            order.setProductName(orderData.getProductName());
            order.setImageFile(orderData.getImageFile());
            order.setQuantity(orderData.getQuantity());
            order.setUom(orderData.getUom());
            order.setPrice(orderData.getPrice());
            order.setStatus(orderData.getStatus());
            order.setAddress(orderData.getAddress());

            //transaction data
            order.setTransactionId(orderData.getTransactionId());
            order.setTransactionDate(orderData.getTransactionDate());
            order.setTotalAmount(orderData.getTotalAmount());
            order.setOrderId(orderData.getOrderId());



            orders.add(order);
        }
        return orders;
    }

    @Override
    public Order create(Order order) {
        log.info(" add:Input " + order.toString());
        OrderData orderData = new OrderData();

        //Customer Data
      //  orderData.setOrderId(order.getOrderId());
        orderData.setCustomerId(order.getCustomerId());
        orderData.setCustomerName(order.getCustomerName());
        //Product Data
        orderData.setProductId(order.getProductId());
        orderData.setProductName(order.getProductName());
        orderData.setImageFile(order.getImageFile());
        orderData.setQuantity(order.getQuantity());
        orderData.setUom(order.getUom());
        orderData.setPrice(order.getPrice());
        orderData.setStatus(order.getStatus());
        orderData.setAddress(order.getAddress());
        //transaction data
        orderData.setTransactionId(order.getTransactionId());
        orderData.setTransactionDate(order.getTransactionDate());
        orderData.setTotalAmount(order.getTotalAmount());
        orderData.setOrderId(order.getOrderId());


        orderData = orderDataRepository.save(orderData);
        log.info(" add:Input " + orderData.toString());
        Order newOrder = new Order();
        newOrder.setId(orderData.getId());

        //Customer Data
        //newOrder.setOrderId(orderData.getOrderId());
        newOrder.setCustomerId(orderData.getCustomerId());
        newOrder.setCustomerName(orderData.getCustomerName());
        //Product Data
        newOrder.setProductId(orderData.getProductId());
        newOrder.setProductName(orderData.getProductName());
        newOrder.setImageFile(orderData.getImageFile());
        newOrder.setQuantity(orderData.getQuantity());
        newOrder.setUom(orderData.getUom());
        newOrder.setPrice(orderData.getPrice());
        newOrder.setStatus(orderData.getStatus());
        newOrder.setAddress(orderData.getAddress());
        //transaction data
        newOrder.setTransactionId(orderData.getTransactionId());
        newOrder.setTransactionDate(orderData.getTransactionDate());
        newOrder.setTotalAmount(orderData.getTotalAmount());
        newOrder.setOrderId(orderData.getOrderId());


        return newOrder;
    }

    @Override
    public Order update(int id, Order order) {
        Optional<OrderData> optional = orderDataRepository.findById(id);

        if (optional.isPresent()) {
            OrderData originalOrderData = optional.get();

            // Updating fields with new values
          //  originalOrderData.setOrderId(order.getOrderId());
            originalOrderData.setCustomerId(order.getCustomerId());
            originalOrderData.setCustomerName(order.getCustomerName());
            originalOrderData.setProductId(order.getProductId());
            originalOrderData.setProductName(order.getProductName());
            originalOrderData.setImageFile(order.getImageFile());
            originalOrderData.setQuantity(order.getQuantity());
            originalOrderData.setUom(order.getUom());
            originalOrderData.setPrice(order.getPrice());
            originalOrderData.setStatus(order.getStatus());
            originalOrderData.setAddress(order.getAddress());

            //transaction data
            originalOrderData.setTransactionId(order.getTransactionId());
            originalOrderData.setTransactionDate(order.getTransactionDate());
            originalOrderData.setTotalAmount(order.getTotalAmount());
            originalOrderData.setOrderId(order.getOrderId());


            // Save the updated entity
            originalOrderData = orderDataRepository.save(originalOrderData);

            // Convert the updated OrderData back to Order, if necessary
            Order updatedOrder = new Order();
            updatedOrder.setId(originalOrderData.getId());
          //  updatedOrder.setOrderId(originalOrderData.getOrderId());
            updatedOrder.setCustomerId(originalOrderData.getCustomerId());
            updatedOrder.setCustomerName(originalOrderData.getCustomerName());
            updatedOrder.setProductId(originalOrderData.getProductId());
            updatedOrder.setProductName(originalOrderData.getProductName());
            updatedOrder.setImageFile(originalOrderData.getImageFile());
            updatedOrder.setQuantity(originalOrderData.getQuantity());
            updatedOrder.setUom(originalOrderData.getUom());
            updatedOrder.setPrice(originalOrderData.getPrice());
            updatedOrder.setStatus(originalOrderData.getStatus());
            updatedOrder.setAddress(originalOrderData.getAddress());

            //transaction data
            updatedOrder.setTransactionId(originalOrderData.getTransactionId());
            updatedOrder.setTransactionDate(originalOrderData.getTransactionDate());
            updatedOrder.setTotalAmount(originalOrderData.getTotalAmount());
            updatedOrder.setOrderId(originalOrderData.getOrderId());

            return updatedOrder;

        } else {
            log.error("Order record with id: " + id + " does not exist");
            throw new EntityNotFoundException("Order with id " + id + " not found");
        }
    }



    @Override
    public void delete(Integer id) {
        Order order = null;
        log.info(" Input >> " + Integer.toString(id));
        Optional<OrderData> optional = orderDataRepository.findById(id);
        if (optional.isPresent()) {
            OrderData orderDatum = optional.get();
            orderDataRepository.delete(optional.get());
            log.info(" Successfully deleted Order record with id: " + Integer.toString(id));
        } else {
            log.error(" Unable to locate order with id:" + Integer.toString(id));
        }
    }
    private Order convertToOrder(OrderData orderData) {
        Order order = new Order();
        order.setId(orderData.getId());
       // order.setOrderId(orderData.getOrderId());
        order.setCustomerId(orderData.getCustomerId());
        order.setCustomerName(orderData.getCustomerName());
        order.setProductId(orderData.getProductId());
        order.setProductName(orderData.getProductName());
        order.setImageFile(orderData.getImageFile());
        order.setQuantity(orderData.getQuantity());
        order.setUom(orderData.getUom());
        order.setPrice(orderData.getPrice());
        order.setStatus(orderData.getStatus());
        order.setAddress(orderData.getAddress());

        //transaction data
        order.setTransactionId(orderData.getTransactionId());
        order.setTransactionDate(orderData.getTransactionDate());
        order.setTotalAmount(orderData.getTotalAmount());
        order.setOrderId(orderData.getOrderId());

        return order;
    }

}




