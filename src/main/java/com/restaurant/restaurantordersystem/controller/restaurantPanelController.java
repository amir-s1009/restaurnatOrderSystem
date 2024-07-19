package com.restaurant.restaurantordersystem.controller;

import com.restaurant.restaurantordersystem.entity.*;
import com.restaurant.restaurantordersystem.repository.DelivererReposit;
import com.restaurant.restaurantordersystem.repository.OrderReposit;
import com.restaurant.restaurantordersystem.repository.RestaurantReposit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


@Controller
public class restaurantPanelController{
    @GetMapping("restaurantNewOrders")
    public static String restaurantNewOrders(){return "./restaurantViewNewOrders";}

    @GetMapping("restaurantProfile")
    public static String restaurantProfile(){return "./restaurantViewProfile";}

    @GetMapping("restaurantManageFoodMenu")
    public static String restaurantManageFoodMenu(){return "./restaurantViewFoodMenu";}

    @GetMapping("restaurantManageAttachments")
    public static String restaurantManageAttachments(){return "./restaurantViewAttachments";}

    @GetMapping("restaurantViewStatistics")
    public static String restaurantViewStatistics(){return "./restaurantViewStatistics";}

    @GetMapping("restaurantViewSubscriptions")
    public static String restaurantViewSubscriptions(){return "./restaurantViewSubscriptions";}

    @GetMapping("restaurantRequestForSupport")
    public static String restaurantRequestForSupport(){return "./restaurantRequestForSupport";}
}
