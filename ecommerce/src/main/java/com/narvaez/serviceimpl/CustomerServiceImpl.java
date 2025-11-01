package com.narvaez.serviceimpl;

import com.narvaez.entity.CustomerData;
import com.narvaez.model.Customer;
import com.narvaez.repostory.CustomerDataRepository;
import com.narvaez.service.CustomerService;
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
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    CustomerDataRepository customerDataRepository;
    
    @Override
    public List<Customer> getCustomers() {
        List<CustomerData> customersData = new ArrayList<>();
        List<Customer> customers = new ArrayList<>();
        customerDataRepository.findAll().forEach(customersData::add);
        Iterator<CustomerData> it = customersData.iterator();
        while(it.hasNext()) {
            CustomerData customerData = it.next();
            Customer customer = new Customer();

            //Credentials
            customer.setId(customerData.getId());
            customer.setCustomerId(customerData.getCustomerId());
            customer.setCustomerEmail(customerData.getCustomerEmail());
            customer.setCustomerUsername(customerData.getCustomerUsername());
            customer.setCustomerPassword(customerData.getCustomerPassword());

            //Personal Information
            customer.setFirstname(customerData.getFirstname());
            customer.setLastname(customerData.getLastname());
            customer.setGender(customerData.getGender());
            customer.setDateOfBirth(customerData.getDateOfBirth());
            customer.setPhoneNumber(customerData.getPhoneNumber());
            customer.setAddress(customerData.getAddress());

            customers.add(customer);
        }
        return customers;
    }

    @Override
    public Customer create(Customer customer) {
        log.info(" add:Input " + customer.toString());
        CustomerData customerData = new CustomerData();


        //Credentials
        customerData.setCustomerId(customer.getCustomerId());
        customerData.setCustomerEmail(customer.getCustomerEmail());
        customerData.setCustomerUsername(customer.getCustomerUsername());
        customerData.setCustomerPassword(customer.getCustomerPassword());

        //Personal Information
        customerData.setFirstname(customer.getFirstname());
        customerData.setLastname(customer.getLastname());
        customerData.setGender(customer.getGender());
        customerData.setDateOfBirth(customer.getDateOfBirth());
        customerData.setPhoneNumber(customer.getPhoneNumber());
        customerData.setAddress(customer.getAddress());



        customerData = customerDataRepository.save(customerData);
        log.info(" add:Input " + customerData.toString());
        Customer newCustomer = new Customer();

        //Credentials
        newCustomer.setId(customerData.getId());
        newCustomer.setCustomerId(customerData.getId()); //so that cusid = id
        newCustomer.setCustomerEmail(customerData.getCustomerEmail());
        newCustomer.setCustomerUsername(customerData.getCustomerUsername());
        newCustomer.setCustomerPassword(customerData.getCustomerPassword());

        //Personal Information
        newCustomer.setFirstname(customerData.getFirstname());
        newCustomer.setLastname(customerData.getLastname());
        newCustomer.setGender(customerData.getGender());
        newCustomer.setDateOfBirth(customerData.getDateOfBirth());
        newCustomer.setPhoneNumber(customerData.getPhoneNumber());
        newCustomer.setAddress(customerData.getAddress());


        return newCustomer;
    }




    @Override
    public Customer update(int id, Customer customer) {
        Optional<CustomerData> optional = customerDataRepository.findById(id);

        if (optional.isPresent()) {
            CustomerData originalCustomerData = optional.get();

            // Updating fields with new values
            
            //Credentials
            originalCustomerData.setCustomerId(customer.getCustomerId());
            originalCustomerData.setCustomerEmail(customer.getCustomerEmail());
            originalCustomerData.setCustomerUsername(customer.getCustomerUsername());
            originalCustomerData.setCustomerPassword(customer.getCustomerPassword());
                
            //Personal Information
            originalCustomerData.setFirstname(customer.getFirstname());
            originalCustomerData.setLastname(customer.getLastname());
            originalCustomerData.setGender(customer.getGender());
            originalCustomerData.setDateOfBirth(customer.getDateOfBirth());
            originalCustomerData.setPhoneNumber(customer.getPhoneNumber());
            originalCustomerData.setAddress(customer.getAddress());

            // Save the updated entity
            originalCustomerData = customerDataRepository.save(originalCustomerData);

            // Convert the updated CustomerData back to Customer, if necessary
            Customer updatedCustomer = new Customer();
            updatedCustomer.setId(originalCustomerData.getId());
            
            //Credentials
            updatedCustomer.setCustomerId(originalCustomerData.getCustomerId());
            updatedCustomer.setCustomerEmail(originalCustomerData.getCustomerEmail());
            updatedCustomer.setCustomerUsername(originalCustomerData.getCustomerUsername());
            updatedCustomer.setCustomerPassword(originalCustomerData.getCustomerPassword());
            
            //Personal Information
            updatedCustomer.setFirstname(originalCustomerData.getFirstname());
            updatedCustomer.setLastname(originalCustomerData.getLastname());
            updatedCustomer.setGender(originalCustomerData.getGender());
            updatedCustomer.setDateOfBirth(originalCustomerData.getDateOfBirth());
            updatedCustomer.setPhoneNumber(originalCustomerData.getPhoneNumber());
            updatedCustomer.setAddress(originalCustomerData.getAddress());
            

            return updatedCustomer;

        } else {
            log.error("Customer record with id: " + id + " does not exist");
            throw new EntityNotFoundException("Customer with id " + id + " not found");
        }
    }




    @Override
    public void delete(Integer id) {
        Customer customer = null;
        log.info(" Input >> " + Integer.toString(id));
        Optional<CustomerData> optional = customerDataRepository.findById(id);
        if (optional.isPresent()) {
            CustomerData customerDatum = optional.get();
            customerDataRepository.delete(optional.get());
            log.info(" Successfully deleted Customer record with id: " + Integer.toString(id));
        } else {
            log.error(" Unable to locate customer with id:" + Integer.toString(id));
        }
    }

    @Override
    public Customer findById(int id) {
        Optional<CustomerData> optionalCustomerData = customerDataRepository.findById(id);
        if (optionalCustomerData.isPresent()) {
            CustomerData customerData = optionalCustomerData.get();
            Customer customer = new Customer();
            // Map fields from CustomerData to Customer...
            return customer;
        } else {
            log.error("Customer with id {} not found", id);
            throw new EntityNotFoundException("Customer with id " + id + " not found");
        }
    }

    
    
}

