package com.restaurant.restaurantordersystem.interfaces;

import com.restaurant.restaurantordersystem.entity.*;
import com.restaurant.restaurantordersystem.entity.Deliverer;
import com.restaurant.restaurantordersystem.entity.Restaurant;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface Admin extends Account<com.restaurant.restaurantordersystem.entity.Admin> {
    ResponseEntity<List<Restaurant>> getRestaurants(@PathVariable String username, @PathVariable String password);
    ResponseEntity<String> blockRestaurant(Restaurant restaurant);
    ResponseEntity<String> unBlockRestaurant(Restaurant restaurant);
    ResponseEntity<List<com.restaurant.restaurantordersystem.entity.Deliverer>> getDeliverers(@PathVariable String username, @PathVariable String password);
    ResponseEntity<String> blockDeliverer(Deliverer deliverer);
    ResponseEntity<String> unBlockDeliverer(Deliverer deliverer);
    ResponseEntity<List<com.restaurant.restaurantordersystem.entity.Customer>> getCustomers(@PathVariable String username, @PathVariable String password);
    ResponseEntity<List<com.restaurant.restaurantordersystem.entity.Support>> getSupportRequests(@PathVariable String username, @PathVariable String password);
    ResponseEntity<String> respondSupportRequests(Support supportRequests);
    ResponseEntity<List<Receipt>> getReceipts(@PathVariable String username, @PathVariable String password);
    ResponseEntity<List<FoodOrder>> getOrders(@PathVariable String username, @PathVariable String password);
    ResponseEntity<List<SubscriptionMenu>> getSubscriptions(@PathVariable String username, @PathVariable String password);
    ResponseEntity<String> deleteSub(@PathVariable Integer id, @PathVariable String username, @PathVariable String password);
    ResponseEntity<String> addSub(@RequestBody SubscriptionMenu subscriptionMenu);

}
