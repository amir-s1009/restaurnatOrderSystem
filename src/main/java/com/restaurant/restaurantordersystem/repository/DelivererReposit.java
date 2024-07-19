package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.Deliverer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DelivererReposit extends JpaRepository<Deliverer, String> {
    boolean existsByMobile(String mobile);
    boolean existsByUserName(String userName);
    boolean existsByUserNameAndPassWord(String userName, String passWord);
    Deliverer findByUserName(String userName);
    Deliverer findByUserNameAndPassWord(String userName, String passWord);
}
