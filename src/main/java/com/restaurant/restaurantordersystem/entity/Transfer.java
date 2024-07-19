package com.restaurant.restaurantordersystem.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table
@JsonIdentityReference
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class , property = "id")
public class Transfer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private String trackId;
    private String amount;
    private String description;
    private String destinationFirstname;
    private String destinationLastname;
    private String destinationNumber;
    private String inquiryDate;
    private String inquirySequence;
    private String inquiryTime;
    private String message;
    private String refCode;
    private String sourceFirstname;
    private String sourceLastname;
    private String sourceNumber;
    private String type;
    private String transactionId;
    private String endToEndId;


}
