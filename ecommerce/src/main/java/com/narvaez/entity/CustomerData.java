package com.narvaez.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;


@Data
@Entity
@Table(name = "Customer_Data")
public class CustomerData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;
    int customerId;

    //credentials
    String customerEmail;
    String customerUsername;
    String customerPassword;

    //personal details
    String firstname;
    String middlename;
    String lastname;
    Date dateOfBirth;
    String gender;
    String phoneNumber;
    String address;

}

