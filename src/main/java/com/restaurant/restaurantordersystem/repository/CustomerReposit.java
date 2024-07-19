package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerReposit extends JpaRepository<Customer, String> {
    boolean existsByMobile(String mobile);
    boolean existsByUserName(String userName);
    boolean existsByUserNameAndPassWord(String userName, String passWord);
    Customer findByUserNameAndPassWord(String userName, String passWord);
    Customer findByUserName(String userName);
}
