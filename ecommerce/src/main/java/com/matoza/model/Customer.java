package com.matoza.model;

import lombok.Data;

import java.util.Date;
@Data
public class Customer {
    //id
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
