package com.restaurant.restaurantordersystem.controller;

import com.restaurant.restaurantordersystem.entity.FoodOrder;
import com.restaurant.restaurantordersystem.entity.TransferQueue;
import com.restaurant.restaurantordersystem.interfaces.Deliverer;
import com.restaurant.restaurantordersystem.repository.DelivererReposit;
import com.restaurant.restaurantordersystem.repository.OrderReposit;
import com.restaurant.restaurantordersystem.repository.TransferQueueReposit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class DelivererApi{

    /*@Autowired
    private DelivererReposit delivererReposit;
    @Autowired
    private OrderReposit orderReposit;
    @Autowired
    private TransferQueueReposit transferQueueReposit;

    @Override
    @PostMapping("/deliverer/getProfile")
    public ResponseEntity<com.restaurant.restaurantordersystem.entity.Deliverer> getAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Deliverer deliverer) {
        try {
            return new ResponseEntity<>(delivererReposit.findByUserNameAndPassWord(deliverer.getUserName(), deliverer.getPassWord()), HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/deliverer/getSecureProfile")
    public ResponseEntity<com.restaurant.restaurantordersystem.entity.Deliverer> getAccountSecurely(@RequestBody com.restaurant.restaurantordersystem.entity.Deliverer deliverer) {
        try {
            com.restaurant.restaurantordersystem.entity.Deliverer deliverer1 = delivererReposit.findById(deliverer.getId()).get();
            deliverer1.setPassWord(null);
            deliverer1.setBalance(null);
            deliverer1.setAccountNo(null);
            deliverer1.setOrderBox(null);
            return new ResponseEntity<>(deliverer1, HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @PostMapping("/deliverer/editProfile")
    public ResponseEntity<String> editAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Deliverer deliverer) {
        try {
            com.restaurant.restaurantordersystem.entity.Deliverer deliverer1 = delivererReposit.findByUserNameAndPassWord(deliverer.getUserName(), deliverer.getPassWord());
            if(!deliverer.getUserName().equals(deliverer.getNewUserName()) && delivererReposit.existsByUserName(deliverer.getNewUserName()))
                return new ResponseEntity<>("نام کاربری در سیستم موجود است، لطفا نام کربری را تغییر دهید", HttpStatus.FORBIDDEN);
            else{
                deliverer1.setUserName(deliverer.getNewUserName());
                deliverer1.setPassWord(deliverer.getNewPassWord());
                deliverer1.setAccountNo(deliverer.getAccountNo());
                deliverer1.setMobile(deliverer.getMobile());
                deliverer1.setCity(deliverer.getCity());
                delivererReposit.save(deliverer1);
                return new ResponseEntity<>("اطلاعات شما با موفقیت بروزرسانی گردید", HttpStatus.OK);
            }
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
            exception.getCause();
            return new ResponseEntity<>("عملیات ناموفق" , HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/deliverer/createAccount")
    public ResponseEntity<String> createAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Deliverer deliverer) {
        try {
            if (delivererReposit.existsByUserName(deliverer.getUserName()))
                return new ResponseEntity<>("نام کاربری قبلا ثبت شده است", HttpStatus.FORBIDDEN);
            else if (delivererReposit.existsByMobile(deliverer.getMobile()))
                return new ResponseEntity<>("شماره موبایل شما در سیستم موجود میباشد و امکان ایجاد اکانت جدید وجود ندارد", HttpStatus.FORBIDDEN);
            else {
                deliverer.setStatus(0);
                deliverer.setSuspended(false);
                deliverer.setBalance("100000");
                deliverer.setId(String.valueOf(delivererReposit.findAll().size()+1));
                delivererReposit.save(deliverer);
                return new ResponseEntity<>("ثبت نام شما با موفقیت انجام گردید", HttpStatus.CREATED);
            }
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/deliverer/logIn")
    public ResponseEntity<String> logIn(@RequestBody com.restaurant.restaurantordersystem.entity.Deliverer deliverer) {
        try {
            if (delivererReposit.existsByUserName(deliverer.getUserName()) && !delivererReposit.findByUserNameAndPassWord(deliverer.getUserName(), deliverer.getPassWord()).isSuspended()) {
                String passWord = delivererReposit.findByUserNameAndPassWord(deliverer.getUserName(), deliverer.getPassWord()).getPassWord();
                if (passWord.equals(deliverer.getPassWord()))
                    return new ResponseEntity<>("کاربر مورد نظر یافت شد", HttpStatus.OK);
                else return new ResponseEntity<>("رمز عبورتان اشتباه میباشد", HttpStatus.FORBIDDEN);
            }
            else return new ResponseEntity<>("چنین کاربری در سیستم وجود ندارد یا به حالت تعلیق در آمده است", HttpStatus.NOT_FOUND);
        }
        catch (Exception exception){
            return new ResponseEntity<>("خطا در احراز هویت", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @GetMapping("/deliverer/getNewOrders")
    public ResponseEntity<List<FoodOrder>> getOrders() {
        try {
            return new ResponseEntity<>(orderReposit.findByStatusAndNeedDeliverer(1, true), HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/deliverer/acceptOrder")
    public ResponseEntity<String> acceptOrder(@RequestBody FoodOrder order) {
        try {
            FoodOrder order1 = orderReposit.findById(order.getId()).get();
            com.restaurant.restaurantordersystem.entity.Deliverer deliverer = delivererReposit.findByUserNameAndPassWord(order.getDeliverer().getUserName(), order.getDeliverer().getPassWord());
            if(!deliverer.isSuspended()){
                FoodOrder last = null;
                if(deliverer.getOrderBox().size() > 0)
                    last = deliverer.getOrderBox().get(deliverer.getOrderBox().size()-1);
                if(order1.getStatus() != 5){
                    if(last == null || last.getStatus() == 3){
                        order1.setStatus(5);
                        order1.setDeliverer(deliverer);
                        List<FoodOrder> orders = deliverer.getOrderBox();
                        orders.add(order1);
                        deliverer.setOrderBox(orders);
                        deliverer.setStatus(1);
                        orderReposit.save(order1);
                        delivererReposit.save(deliverer);
                        return new ResponseEntity<>("شما سفارش را قبول کردید ", HttpStatus.OK);
                    }
                    else return new ResponseEntity<>("شما یک سفارش در حال انجام دارید", HttpStatus.FORBIDDEN);
                }
                else return new ResponseEntity<>("سفارش مورد نظر توسط پیک دیگر پذیرفته شده است", HttpStatus.FORBIDDEN);
            }
            else return new ResponseEntity<>("حساب شما معلق بوده و امکان انجام سفارش ندارید", HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }
    @PostMapping("/deliverer/takeFromRestaurant")
    public ResponseEntity<String> takeFromRestaurant(@RequestBody FoodOrder order) {
        try {
            FoodOrder order1 = orderReposit.findById(order.getId()).get();
            if(delivererReposit.existsByUserNameAndPassWord(order.getDeliverer().getUserName(), order.getDeliverer().getPassWord())){
                if(order1.getStatus() == 5){
                    com.restaurant.restaurantordersystem.entity.Deliverer deliverer = delivererReposit.findByUserNameAndPassWord(order.getDeliverer().getUserName(), order.getDeliverer().getPassWord());
                    deliverer.setStatus(2);
                    order1.setStatus(2);
                    orderReposit.save(order1);
                    delivererReposit.save(deliverer);
                    return new ResponseEntity<>("شما سفارش را تحویل گرفتید", HttpStatus.OK);
                }
                else return new ResponseEntity<>("درخواست غیرمجاز، لطفا مراحل را به درستی طی فرمایید", HttpStatus.FORBIDDEN);
            }
            else return new ResponseEntity<>("شما به عنوان هکر شناسایی شدید", HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }
    @Override
    @PostMapping("/deliverer/deliverOrder")
    public ResponseEntity<String> deliverOrder(@RequestBody FoodOrder order) {
        try {
            FoodOrder order1 = orderReposit.findById(order.getId()).get();
            if(order1.getStatus() == 3) {
                com.restaurant.restaurantordersystem.entity.Deliverer deliverer = delivererReposit.findByUserNameAndPassWord(order1.getDeliverer().getUserName(), order.getDeliverer().getPassWord());
                deliverer.setStatus(0);
                delivererReposit.save(deliverer);
                return new ResponseEntity<>("سفارش با موفقیت تحویل مشتری گردید", HttpStatus.OK);
            }
            else return new ResponseEntity<>("مشتری هنوز سفارش را تحویل نگرفته است", HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PostMapping("/deliverer/requestTransfer")
    public ResponseEntity<String> withdrawWallet(@RequestBody com.restaurant.restaurantordersystem.entity.Deliverer deliverer){
        try {
            com.restaurant.restaurantordersystem.entity.Deliverer deliverer1 = delivererReposit.findByUserNameAndPassWord(deliverer.getUserName(), deliverer.getPassWord());
            // fill in the fields...
            List<TransferQueue> line = transferQueueReposit.findAll();
            TransferQueue request = new TransferQueue();
            if(Long.parseLong(deliverer1.getBalance()) > 500000000)
                request.setAmount("500000000");
            else request.setAmount(deliverer1.getBalance());
            request.setDescription("تسویه حساب کیف پول");
            request.setDestinationFirstname(deliverer1.getName());
            request.setDestinationLastname(deliverer1.getSurName());
            request.setDestinationNumber("IR".concat(deliverer1.getAccountNo()));

            line.add(request);
            transferQueueReposit.saveAllAndFlush(line);
            return new ResponseEntity<>("درخواست شما در صف واریز قرار گرفت. نوبت شما در صف، "+line.size()+" می باشد", HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }*/
}
