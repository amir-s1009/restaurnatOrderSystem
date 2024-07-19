package com.restaurant.restaurantordersystem.interfaces;

import org.springframework.http.ResponseEntity;

public interface Account<T> {
    ResponseEntity<T> getAccount(T t);
    ResponseEntity<T> getAccountSecurely(T t);
    ResponseEntity<String> editAccount(T t);
    ResponseEntity<String> createAccount(T t);
    ResponseEntity<String> logIn(T t);
}
