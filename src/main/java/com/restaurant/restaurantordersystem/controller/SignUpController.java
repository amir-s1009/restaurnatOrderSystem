package com.restaurant.restaurantordersystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SignUpController {
    @GetMapping("/customerSignUp")
    public static String customerSignUp(){return "./customerSignUpPage";}

    @GetMapping("/restaurantSignUp")
    public static String restaurantSignUp(){return "./restaurantSignUpPage";}

    @GetMapping("/delivererSignUp")
    public static String delivererSignUp(){return "./delivererSignUpPage";}
}
