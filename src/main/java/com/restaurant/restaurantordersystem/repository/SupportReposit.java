package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.Support;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportReposit extends JpaRepository<Support, Long> {
    List<Support> findSupportsByStatus(Integer status);
}
