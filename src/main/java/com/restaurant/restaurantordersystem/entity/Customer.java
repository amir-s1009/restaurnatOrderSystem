package com.restaurant.restaurantordersystem.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table
@JsonIdentityReference
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class , property = "id")
public class Customer extends Person{

    transient private String increaseAmount;
    transient private String giftCode;

    @OneToMany(cascade = CascadeType.ALL)
    private List<FoodOrder> orders;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<Restaurant> favoriteRestaurants;
}
