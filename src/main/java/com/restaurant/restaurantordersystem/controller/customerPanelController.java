package com.restaurant.restaurantordersystem.controller;

import com.restaurant.restaurantordersystem.entity.AttachmentMenu;
import com.restaurant.restaurantordersystem.entity.FoodMenu;
import com.restaurant.restaurantordersystem.entity.FoodOrder;
import com.restaurant.restaurantordersystem.entity.Restaurant;
import com.restaurant.restaurantordersystem.interfaces.Customer;
import com.restaurant.restaurantordersystem.repository.CustomerReposit;
import com.restaurant.restaurantordersystem.repository.OrderReposit;
import com.restaurant.restaurantordersystem.repository.RestaurantReposit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class customerPanelController{
    @GetMapping("/customerViewProfile")
    public static String customerViewProfile(){return "./customerViewProfile";}

    @GetMapping("/customerOrders")
    public static String customerOrders(){return "./customerViewOrders";}

    @GetMapping("/restaurants")
    public static String restaurants(){return "./customerViewRestaurants";}

    @GetMapping("/favorites")
    public static String favorites(){return "./customerViewFavorites";}

    @GetMapping("/foods")
    public static String foods(){return "./customerViewFoods";}
}
