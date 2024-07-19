package com.restaurant.restaurantordersystem.interfaces;

import com.restaurant.restaurantordersystem.entity.AttachmentMenu;
import com.restaurant.restaurantordersystem.entity.FoodMenu;
import com.restaurant.restaurantordersystem.entity.FoodOrder;
import com.restaurant.restaurantordersystem.entity.Restaurant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface Customer extends Account<com.restaurant.restaurantordersystem.entity.Customer>{
    //fetching info...
    public abstract ResponseEntity<List<Restaurant>> getRestaurants(@RequestBody Restaurant restaurant);
    public abstract ResponseEntity<List<FoodMenu>>  getFoods(@RequestBody Restaurant restaurant);
    public abstract ResponseEntity<List<AttachmentMenu>> getAttachments(@RequestBody Restaurant restaurant);
    //inserting info...
    public abstract ResponseEntity<String> submitOrder(@RequestBody FoodOrder order);
    public abstract ResponseEntity<String> getOrder(@RequestBody FoodOrder order);
    public abstract ResponseEntity<String> giveNegativeScore(@RequestBody FoodOrder order);
     public abstract ResponseEntity<String> increaseWallet(@RequestBody com.restaurant.restaurantordersystem.entity.Customer customer);
}
