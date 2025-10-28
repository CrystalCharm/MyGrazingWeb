package com.matoza.repostory;

import com.matoza.entity.OrderData;
import org.springframework.data.repository.CrudRepository;

public interface OrderDataRepository extends CrudRepository<OrderData, Integer> {

}
