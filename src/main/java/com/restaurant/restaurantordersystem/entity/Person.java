package com.restaurant.restaurantordersystem.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Data
@Entity
@Table
@JsonIdentityReference
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class , property = "id")
public class Person implements Serializable {
    @Id
    private String id;

    private String userName;
    transient public String newUserName;
    public String passWord;
    transient public String newPassWord;
    public String name;
    public String surName;
    public String mobile;
    public String gender;
    public String city;
    public String balance;
    public boolean suspended;
    transient public Auth admin;

    public void appendBalance(String amount){
        setBalance(String.valueOf(Long.parseLong(getBalance())+Long.parseLong(amount)));
    }
    public void withdrawBalance(String amount){
        setBalance(String.valueOf(Long.parseLong(getBalance())-Long.parseLong(amount)));
    }

    public String getUserName() {
        return userName;
    }
    public String getNewUserName() {
        return newUserName;
    }

    public String getPassWord() {
        return passWord;
    }
    public String getNewPassWord() {
        return newPassWord;
    }

    public String getName() {
        return name;
    }

    public String getSurName() {
        return surName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
    public void setNewUserName(String newUserName) {
        this.newUserName = newUserName;
    }
    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }
    public void setNewPassWord(String newPassWord) {
        this.newPassWord = newPassWord;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSurName(String surName) {
        this.surName = surName;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
