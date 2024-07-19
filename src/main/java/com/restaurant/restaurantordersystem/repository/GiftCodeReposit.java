package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.GiftCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GiftCodeReposit extends JpaRepository<GiftCode, Long> {
    boolean existsByCode(String code);
    GiftCode findByCode(String code);
}
