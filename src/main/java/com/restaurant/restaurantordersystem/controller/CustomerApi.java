package com.restaurant.restaurantordersystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.restaurantordersystem.entity.*;
import com.restaurant.restaurantordersystem.interfaces.Customer;
import com.restaurant.restaurantordersystem.repository.*;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@RestController
public class CustomerApi implements Customer {
    @Autowired
    private  CustomerReposit customerReposit;
    @Autowired
    private  RestaurantReposit restaurantReposit;
    @Autowired
    private  OrderReposit orderReposit;
    @Autowired
    private DelivererReposit delivererReposit;
    @Autowired
    private GiftCodeReposit giftCodeReposit;

    @Override
    @PostMapping("/customer/logIn")
    public ResponseEntity<String> logIn(@RequestBody com.restaurant.restaurantordersystem.entity.Customer customer){
        try {
            if (customerReposit.existsByUserName(customer.getUserName()) && !customerReposit.findByUserNameAndPassWord(customer.getUserName(), customer.getPassWord()).isSuspended()) {
                String passWord = customerReposit.findByUserNameAndPassWord(customer.getUserName(), customer.getPassWord()).getPassWord();
                if (passWord.equals(customer.getPassWord()))
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
    @PostMapping("/customer/profile")
    public ResponseEntity<com.restaurant.restaurantordersystem.entity.Customer> getAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Customer customer) {
        try{
            com.restaurant.restaurantordersystem.entity.Customer customer1 = customerReposit.findByUserNameAndPassWord(customer.getUserName(), customer.getPassWord());
            if(!customer1.isSuspended())
                return new ResponseEntity<>(customer1, HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @PostMapping("/customer/secureProfile")
    public ResponseEntity<com.restaurant.restaurantordersystem.entity.Customer> getAccountSecurely(@RequestBody com.restaurant.restaurantordersystem.entity.Customer customer) {
        try {
            com.restaurant.restaurantordersystem.entity.Customer customer1 = customerReposit.findByUserName(customer.getUserName());
            customer1.setPassWord(null);
            customer1.setBalance(null);
            return new ResponseEntity<>(customer1, HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @PostMapping("/customer/editProfile")
    public ResponseEntity<String> editAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Customer customer) {
        try {
            com.restaurant.restaurantordersystem.entity.Customer customer1 = customerReposit.findByUserNameAndPassWord(customer.getUserName(), customer.getPassWord());
            if(customer1.isSuspended())
                return new ResponseEntity<>("حساب کاربری شما به حالت تعلیق می باشد و امکان تغییر اطلاعات را ندارید", HttpStatus.FORBIDDEN);
            else if(!customer.getUserName().equals(customer.getNewUserName()) && customerReposit.existsByUserName(customer.getNewUserName()))
                return new ResponseEntity<>("نام کاربری در سیستم موجود است، لطفا نام کربری را تغییر دهید", HttpStatus.FORBIDDEN);
            else{
                customer1.setUserName(customer.getNewUserName());
                customer1.setPassWord(customer.getNewPassWord());
                customer1.setMobile(customer.getMobile());
                customer1.setCity(customer.getCity());
                customerReposit.save(customer1);
                return new ResponseEntity<>("اطلاعات شما با موفقیت بروزرسانی گردید", HttpStatus.OK);
            }
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق" , HttpStatus.EXPECTATION_FAILED);
        }
    }
    @Override
    @PostMapping("/customer/createAccount")
    public ResponseEntity<String> createAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Customer customer) {
        try {
            if (customerReposit.existsByUserName(customer.getUserName()))
                return new ResponseEntity<>("نام کاربری قبلا ثبت شده است", HttpStatus.FORBIDDEN);
            else if (customerReposit.existsByMobile(customer.getMobile()))
                return new ResponseEntity<>("شماره موبایل شما در سیستم موجود میباشد و امکان ایجاد اکانت جدید وجود ندارد", HttpStatus.FORBIDDEN);
            else {
                customer.setId(String.valueOf(customerReposit.findAll().size()+1));
                customer.setBalance("0");
                customer.setSuspended(false);
                customerReposit.save(customer);
                return new ResponseEntity<>("ثبت نام شما با موفقیت انجام گردید", HttpStatus.CREATED);
            }
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }
    @Override
    @PostMapping("/customer/restaurants")
    public ResponseEntity<List<Restaurant>> getRestaurants(@RequestBody Restaurant restaurant) {
        try {
            List<Restaurant> restaurants = restaurantReposit.getRestaurantsByCity(restaurant.getCity());
            for(Restaurant rest: restaurants){
                rest.setPassWord(null);
                rest.setBalance(null);
                rest.setAccountNo(null);
                rest.setOrders(null);
                rest.setSupportRequest(null);
            }
            return new ResponseEntity<>(restaurants, HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @Override
    @PostMapping("/customer/foods")
    public ResponseEntity<List<FoodMenu>> getFoods(@RequestBody Restaurant restaurant) {
        try {
            return new ResponseEntity<>(restaurantReposit.findByUserName(restaurant.getUserName()).getFoodMenu(), HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @Override
    @PostMapping("/customer/attachments")
    public ResponseEntity<List<AttachmentMenu>> getAttachments(@RequestBody Restaurant restaurant) {
        try {
            return new ResponseEntity<>(restaurantReposit.findByUserName(restaurant.getUserName()).getAttachmentMenu(), HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @Override
    @PostMapping("/customer/submitOrder")
    public ResponseEntity<String> submitOrder(@RequestBody FoodOrder order) {
        try{
            if (Calendar.HOUR_OF_DAY == 23 && Calendar.MINUTE >= 30)
                return new ResponseEntity<>("کاربر گرانقدر، با توجه به اینکه به ساعات پایانی سرویس دهی بوقلمون نزدیک می شویم، جهت جلوگیری از معلق ماندن سفارش شما، از ادامه عملیات شما جلوگیری میشود، با تشکر از همراهی شما.", HttpStatus.FORBIDDEN);
            else if(Calendar.HOUR_OF_DAY >= 0 && Calendar.HOUR_OF_DAY < 6)
                return new ResponseEntity<>("اتمام ساعت سرویس دهی", HttpStatus.BAD_GATEWAY);
            else{
                com.restaurant.restaurantordersystem.entity.Customer customer = customerReposit.findByUserNameAndPassWord(order.getCustomer().getUserName(), order.getCustomer().getPassWord());
                Restaurant restaurant = restaurantReposit.findByUserName(order.getRestaurant().getUserName());
                FoodOrder lastOrder = null;
                if(customer.getOrders().size() > 0)
                    lastOrder = customer.getOrders().get(customer.getOrders().size()-1);

                if(customer.isSuspended())
                    return new ResponseEntity<>("حساب کاربری شما به حالت تعلیق در آمده است و امکان ثبت سفارش را ندارید", HttpStatus.FORBIDDEN);
                else if(restaurant.isSuspended())
                    return new ResponseEntity<>("متاسفانه رستوران مورد نظر در حال حاضر امکان دریافت سفارش را ندارد", HttpStatus.FORBIDDEN);
                else if(lastOrder != null && (!(lastOrder.getStatus() == 3 || lastOrder.getStatus() == 4)))
                    return new ResponseEntity<>("شما یک سفارش در حال انجام دارید، لطفا بعد از تحویل گرفتن سفارش، اقدام فرمایید", HttpStatus.FORBIDDEN);
                /*else if(Long.parseLong(customer.getBalance()) < Long.parseLong(order.getPrice()))
                    return new ResponseEntity<>("موجودی کیف پول شما برای انجام این سفارش کافی نمی باشد", HttpStatus.FORBIDDEN);*/
                else {
                    List<FoodOrder> orders = customer.getOrders();
                    orders.add(order);
                    customer.setOrders(orders);

                    orders = restaurant.getOrders();
                    orders.add(order);
                    restaurant.setOrders(orders);

                    order.setCustomer(customer);
                    order.setRestaurant(restaurant);
                    order.setStatus(0);
                    order.setDateCreated(new Date());

                    orderReposit.save(order);
                    customerReposit.save(customer);
                    restaurantReposit.save(restaurant);

                    return new ResponseEntity<>("سفارش مورد نظر با موفقیت ثبت گردید", HttpStatus.OK);
                }
            }
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/customer/getOrder")
    public ResponseEntity<String> getOrder(@RequestBody FoodOrder order) {
        try {
            FoodOrder order1 = orderReposit.findById(order.getId()).get();
            com.restaurant.restaurantordersystem.entity.Customer customer = customerReposit.findByUserNameAndPassWord(order1.getCustomer().getUserName(), order1.getCustomer().getPassWord());
            if(order1.getStatus() == 2){
                order1.deliver();
                order1.setDateDelivered(new Date());
                orderReposit.save(order1);
                return new ResponseEntity<>("سفارش را با موفقیت تحویل گرفتید", HttpStatus.OK);
                /*if(Long.parseLong(customer.getBalance()) > Long.parseLong(order1.getPrice())+Long.parseLong(order1.getTransferPayment())){
                    Restaurant restaurant = restaurantReposit.findByUserName(order1.getRestaurant().getUserName());
                    order1.deliver();
                    order1.setDateDelivered(new Date());
                    customer.withdrawBalance(order1.getPrice());
                    restaurant.appendBalance(order1.getPrice());
                    orderReposit.save(order1);
                    restaurantReposit.save(restaurant);
                    customerReposit.save(customer);
                    if(order1.getDeliverer() != null) {
                        Deliverer deliverer = delivererReposit.findByUserName(order1.getDeliverer().getUserName());
                        customer.withdrawBalance(order1.getTransferPayment());
                        deliverer.appendBalance(order1.getTransferPayment());
                        customerReposit.save(customer);
                        delivererReposit.save(deliverer);
                    }
                    return new ResponseEntity<>("سفارش را با موفقیت تحویل گرفتید", HttpStatus.OK);
                }
                else return new ResponseEntity<>("موجودی شما برای ادامه عملیات کافی نمی باشد، لطفا موجودی خود را شارژ نمایید", HttpStatus.FORBIDDEN);*/
            }
            else return new ResponseEntity<>("درخواست شما غیر مجاز است، لطفا ترتیب مراحل را بدرستی طی فرمایید", HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/customer/giveNegativeScore")
    public ResponseEntity<String> giveNegativeScore(@RequestBody FoodOrder order) {
        return null;
        /*try {
            if(customerReposit.existsByUserNameAndPassWord(order.getCustomer().getUserName(), order.getCustomer().getPassWord())){
                Deliverer deliverer = delivererReposit.findById(order.getDeliverer().getId()).get();
                if(deliverer.getNegativeMark() < 9)
                    deliverer.setNegativeMark(deliverer.getNegativeMark()+1);
                else
                    deliverer.setSuspended(true);
                delivererReposit.save(deliverer);
                return new ResponseEntity<>("تشکر از همراهی شما", HttpStatus.OK);
            }
            else return new ResponseEntity<>("شما به عنوان هکر شناسایی شدید", HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }*/
    }

    @PostMapping("/customer/submitGiftCode")
    public ResponseEntity<String> submitGiftCode(@RequestBody com.restaurant.restaurantordersystem.entity.Customer customer){
        return null;
        /*try {
            com.restaurant.restaurantordersystem.entity.Customer customer1 = customerReposit.findByUserNameAndPassWord(customer.getUserName(), customer.getPassWord());
            if(giftCodeReposit.existsByCode(customer.getGiftCode())){
                GiftCode giftCode = giftCodeReposit.findByCode(customer.getGiftCode());
                customer1.appendBalance(giftCode.getAmount());
                giftCodeReposit.deleteById(giftCode.getId());
                customerReposit.save(customer1);
                return new ResponseEntity<>("کیف پول شما به میزان "+giftCode.getAmount()+" ریال شارژ گردید.", HttpStatus.OK);
            }
            else return new ResponseEntity<>("کد هدیه در سیستم موجود نمی باشد", HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }*/
    }

    @Override
    @PostMapping("/customer/increaseWallet")
    public ResponseEntity<String> increaseWallet(@RequestBody com.restaurant.restaurantordersystem.entity.Customer customer) {
        return null;
        /*try {
            com.restaurant.restaurantordersystem.entity.Customer customer1 = customerReposit.findByUserNameAndPassWord(customer.getUserName(), customer.getPassWord());
            customer1.appendBalance(customer.getIncreaseAmount());
            customerReposit.save(customer1);

            return new ResponseEntity<>("موجودی کیف پول شما به مبلغ "+customer.getIncreaseAmount()+" ریال شارژ گردید", HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }*/
    }
}
