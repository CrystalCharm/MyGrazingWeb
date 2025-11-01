package com.narvaez.service;

import com.narvaez.model.Customer;

import java.util.List;

public interface CustomerService {
    List<Customer> getCustomers();
    Customer create(Customer customer);
    Customer update(int id, Customer customer);
    void delete(Integer id);
    Customer findById(int id); // Add this line

}
