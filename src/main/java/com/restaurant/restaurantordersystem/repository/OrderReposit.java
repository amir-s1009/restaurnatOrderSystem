package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderReposit extends JpaRepository<FoodOrder, Long> {
    List<FoodOrder> findByStatusAndNeedDeliverer(Integer status, Boolean needDeliverer);
}
