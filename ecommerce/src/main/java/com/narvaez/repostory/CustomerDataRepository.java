package com.narvaez.repostory;

import com.narvaez.entity.CustomerData;
import org.springframework.data.repository.CrudRepository;

public interface CustomerDataRepository extends CrudRepository<CustomerData,Integer> {
}
