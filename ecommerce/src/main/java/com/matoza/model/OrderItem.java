package com.matoza.model;
import lombok.Data;

@Data
public class OrderItem {

    //Customer Data
    int id;
   // int orderId;
   int customerId;
    String customerName;
    int orderId;

    //Product Data
    int productId;
    String productName;
    String imageFile;
    double quantity;
    String uom;
    double price;
    String status;

}

