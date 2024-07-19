package com.restaurant.restaurantordersystem.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Calendar;

@Controller
public class homePageController {
    @GetMapping("/")
    public static String homePage(){
        if(Calendar.HOUR_OF_DAY >= 0 && Calendar.HOUR_OF_DAY < 6)
            return "./gateAway";
        else return "./homePage";
    }

    @GetMapping("/logIn")
    public static String logIn(){
        if(Calendar.HOUR_OF_DAY >= 0 && Calendar.HOUR_OF_DAY < 6)
            return "./gateAway";
        else return "./logInPage";

    }

    @GetMapping("/agreement")
    public static String agreement(){return "./agreement";}
}
