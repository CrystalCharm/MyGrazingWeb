package com.narvaez.repostory;

import com.narvaez.entity.OrderData;
import org.springframework.data.repository.CrudRepository;

public interface OrderDataRepository extends CrudRepository<OrderData, Integer> {

}
