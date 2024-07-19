package com.restaurant.restaurantordersystem.repository;

import com.restaurant.restaurantordersystem.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptReposit extends JpaRepository<Receipt, Long> {
}
