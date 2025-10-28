package com.matoza.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Data
@Entity
public class OrderData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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
    String address;

    //TRANSACTION DATA
    String transactionId;
    Date transactionDate;
    double totalAmount;
}