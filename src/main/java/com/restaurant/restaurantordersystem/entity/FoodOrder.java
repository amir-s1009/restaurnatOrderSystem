package com.restaurant.restaurantordersystem.entity;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table
@JsonIdentityReference
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class , property = "id")
public class FoodOrder implements Serializable {
    /*
            0 : is just ordered.
            1 & !needDeliverer : is expected to be sent by restaurant deliverer.
            1 & needDeliverer : is searching for deliverer.
                2 : is sent.
                3 : is delivered.
            4 : is rejected.
            5 : is expected to be sent by booghalamoon deliverer.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer status;
    private String address;
    private Double longitude;
    private Double latitude;
    private Date dateCreated;
    private Date dateDelivered;
    private String price;
    private String transferPayment;
    private boolean needDeliverer;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Food> foods;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Attachment> attachments;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Restaurant restaurant;

    @ManyToOne
    private Deliverer deliverer;


    public void accept(){
        setStatus(1);
    }
    public void send(){
        setStatus(2);
    }
    public void deliver(){
        setStatus(3);
    }
    public void reject(){
        setStatus(4);
    }
}
