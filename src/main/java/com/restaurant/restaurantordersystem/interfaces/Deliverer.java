package com.restaurant.restaurantordersystem.interfaces;

import com.restaurant.restaurantordersystem.entity.FoodOrder;
import com.restaurant.restaurantordersystem.entity.Restaurant;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface Deliverer extends Account<com.restaurant.restaurantordersystem.entity.Deliverer>{
    ResponseEntity<List<FoodOrder>> getOrders();
    ResponseEntity<String> acceptOrder(FoodOrder order);
    ResponseEntity<String> deliverOrder(FoodOrder order);
}
