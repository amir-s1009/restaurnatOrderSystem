package com.restaurant.restaurantordersystem.schedule;

import com.restaurant.restaurantordersystem.entity.Deliverer;
import com.restaurant.restaurantordersystem.repository.DelivererReposit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;

//@EnableScheduling
//@Configuration
//public class ResetDeliverers {
//    @Autowired
//    private DelivererReposit repo;
//
//    @Scheduled(cron = "0 0 0 1 * *")
//    void resetNegativeMarks(){
//        List<Deliverer> deliverers = repo.findAll();
//        for(Deliverer deliverer : deliverers)
//            deliverer.setNegativeMark(0);
//        repo.saveAll(deliverers);
//    }
//}
