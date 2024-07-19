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
public class Deliverer extends Person{
    /*
        have 2 different statuses:
            0 : idle.
            1 : on mission.
     */
    private Integer status;
    private String accountNo;
    private Integer negativeMark;

    @OneToMany(cascade = CascadeType.ALL)
    private List<FoodOrder> orderBox;
}
