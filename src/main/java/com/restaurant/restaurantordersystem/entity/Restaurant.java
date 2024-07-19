package com.restaurant.restaurantordersystem.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@Entity
@Table
@JsonIdentityReference
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class , property = "id")
public class Restaurant implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;
    transient public String newUserName;
    private String passWord;
    transient public String newPassWord;
    private String name;
    private String phone;
    private String address;
    private String city;
    private Double longitude;
    private Double latitude;
    private String managerName;
    private String managerSurName;
    private String balance;
    private Integer hrFrom;
    private Integer hrTo;
    private String AccountNo;
    private boolean suspended;

    @OneToMany(cascade = CascadeType.ALL)
    private List<FoodMenu> foodMenu;

    @OneToMany(cascade = CascadeType.ALL)
    private List<AttachmentMenu> attachmentMenu;

    @OneToMany(cascade = CascadeType.ALL)
    private List<FoodOrder> orders;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Support> supportRequest;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Subscription> subscriptions;

    transient private Auth admin;

    public void appendBalance(String amount){
        setBalance(String.valueOf(Long.parseLong(getBalance())+Long.parseLong(amount)));
    }
    public void withdrawBalance(String amount){
        setBalance(String.valueOf(Long.parseLong(getBalance())-Long.parseLong(amount)));
    }

}
