package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminReposit extends JpaRepository<Admin, String> {
    boolean existsByMobile(String mobile);
    boolean existsByUserNameAndPassWord(String userName, String passWord);
    boolean existsByUserName(String userName);
    Admin findByUserNameAndPassWord(String userName, String passWord);
}
