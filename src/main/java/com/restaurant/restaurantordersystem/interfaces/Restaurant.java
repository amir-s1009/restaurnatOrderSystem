package com.restaurant.restaurantordersystem.interfaces;

import com.restaurant.restaurantordersystem.entity.*;
import com.restaurant.restaurantordersystem.entity.Deliverer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface Restaurant extends Account<com.restaurant.restaurantordersystem.entity.Restaurant>{
    public abstract ResponseEntity<String> acceptOrder(@RequestBody FoodOrder order);
    public abstract ResponseEntity<String> rejectOrder(@RequestBody FoodOrder order);
    public abstract ResponseEntity<String> sendOrder(@RequestBody FoodOrder order);
    public abstract ResponseEntity<String> editFoodMenu(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant);
    public abstract ResponseEntity<String> editAttachmentMenu(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant);
    public abstract ResponseEntity<String> sendSupport(@RequestBody Support support);
    public abstract ResponseEntity<String> buySubscription(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant, @PathVariable Integer id);
    public abstract ResponseEntity<List<SubscriptionMenu>> subscriptions();
}

