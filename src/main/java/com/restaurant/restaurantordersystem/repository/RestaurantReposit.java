package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantReposit extends JpaRepository<Restaurant, Long> {
    List<Restaurant> getRestaurantsByCity(String city);
    Restaurant findByUserNameAndPassWord(String userName, String passWord);
    Restaurant findByUserName(String userName);
    boolean existsByUserName(String userName);
    boolean existsByUserNameAndPassWord(String userName, String passWord);
}
