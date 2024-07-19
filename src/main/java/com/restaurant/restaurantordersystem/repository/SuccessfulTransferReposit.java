package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuccessfulTransferReposit extends JpaRepository<Transfer, Long> {
}
