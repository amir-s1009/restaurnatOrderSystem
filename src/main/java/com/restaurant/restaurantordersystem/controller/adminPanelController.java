package com.restaurant.restaurantordersystem.controller;

import com.restaurant.restaurantordersystem.entity.*;
import com.restaurant.restaurantordersystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class adminPanelController{
    @GetMapping("/adminViewProfile")
    public static String adminViewProfile(){return "./customerViewProfile";}

    @GetMapping("/adminViewRestaurants")
    public static String adminViewRestaurants(){return "./adminViewRestaurants";}

    @GetMapping("/adminViewCustomers")
    public static String adminViewUsers(){return "./adminViewCustomers";}

    @GetMapping("/adminViewDeliverers")
    public static String adminViewPlans(){return "./adminViewDeliverers";}

    @GetMapping("/adminViewSupportRequests")
    public static String adminViewSupportRequests(){return "./adminViewSupportRequests";}

    @GetMapping("/adminViewSubscriptions")
    public static String adminViewSubscriptions(){return "./adminViewSubscriptions";}

    @GetMapping("/adminViewReceipts")
    public static String adminViewReceipts(){return "./adminViewReceipts";}

    @GetMapping("/adminIncomeStats")
    public static String adminIncomeStats(){return "./adminIncomeStats";}

    @GetMapping("/adminOrderStats")
    public static String adminOrderStats(){return "./adminOrderStats";}
}
