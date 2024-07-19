package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.TransferQueue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransferQueueReposit extends JpaRepository<TransferQueue, Long> {
}
