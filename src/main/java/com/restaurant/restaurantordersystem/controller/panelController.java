package com.restaurant.restaurantordersystem.controller;

import com.restaurant.restaurantordersystem.repository.AdminReposit;
import com.restaurant.restaurantordersystem.repository.CustomerReposit;
import com.restaurant.restaurantordersystem.repository.DelivererReposit;
import com.restaurant.restaurantordersystem.repository.RestaurantReposit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class panelController {

    @Autowired
    private CustomerReposit customerReposit;
    @Autowired
    private RestaurantReposit restaurantReposit;
    @Autowired
    private DelivererReposit delivererReposit;
    @Autowired
    private AdminReposit adminReposit;

    @GetMapping("/customerPanel-{userName}-{passWord}")
    public String customerPanel(@PathVariable String userName, @PathVariable String passWord){
        if(customerReposit.existsByUserNameAndPassWord(userName, passWord))
            return "./customerPanelPage";
        else return "./lock";
    }
    @GetMapping("/restaurantPanel-{userName}-{passWord}")
    public String restaurantPanel(@PathVariable String userName, @PathVariable String passWord){
        if(restaurantReposit.existsByUserNameAndPassWord(userName, passWord))
            return "./restaurantPanelPage";
        else return "./lock";
    }
    @GetMapping("/delivererPanel-{userName}-{passWord}")
    public String delivererPanel(@PathVariable String userName, @PathVariable String passWord){
        if(delivererReposit.existsByUserNameAndPassWord(userName, passWord))
            return "./delivererPanelPage";
        else return "./lock";
    }
    @GetMapping("/adminPanel-{userName}-{passWord}")
    public String adminPanel(@PathVariable String userName, @PathVariable String passWord){
        if(adminReposit.existsByUserNameAndPassWord(userName, passWord))
            return "./adminPanelPage";
        else return "./lock";
    }
}
