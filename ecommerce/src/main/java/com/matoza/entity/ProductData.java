package com.matoza.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "product_data")
public class    ProductData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;
    String name;
    String description;
    String categoryName;
    String unitOfMeasure;
    String price;
    String imageFile;
    String quantityInStock;
}
