package com.narvaez.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "orderItem_data")
public class OrderItemData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    //Customer Data
    int id;
    //int orderId;
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
