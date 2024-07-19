package com.restaurant.restaurantordersystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class delivererPanelController {
    @GetMapping("/delivererViewProfile")
    public String delivererViewProfile(){return "./delivererViewProfile";}

    @GetMapping("/delivererViewOrders")
    public String delivererViewOrders(){return "./delivererViewOrders";}

    @GetMapping("/delivererViewNewOrders")
    public String delivererViewNewOrders(){return "./delivererViewNewOrders";}
}
