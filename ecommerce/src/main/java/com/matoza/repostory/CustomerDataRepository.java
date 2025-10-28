package com.matoza.repostory;

import com.matoza.entity.CustomerData;
import org.springframework.data.repository.CrudRepository;

public interface CustomerDataRepository extends CrudRepository<CustomerData,Integer> {
}
