package com.narvaez.model;

import lombok.Data;

import java.util.Date;

@Data
public class Order {
    int id;
    int orderId;
    int customerId;
    String customerName;

    //Product Data
    int productId;
    String productName;
    String imageFile;
    double quantity;
    String uom;
    double price;
    String status;
    String Address;

    //TRANSACTION DATA
    String transactionId;
    Date transactionDate;
    double totalAmount;
}
