package com.restaurant.restaurantordersystem.controller;

import com.restaurant.restaurantordersystem.entity.*;
import com.restaurant.restaurantordersystem.interfaces.Admin;
import com.restaurant.restaurantordersystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AdminApi implements Admin {
    @Autowired
    public AdminReposit adminReposit;
    @Autowired
    public RestaurantReposit restaurantReposit;
    @Autowired
    public CustomerReposit customerReposit;
    @Autowired
    public SupportReposit supportReposit;
    @Autowired
    public DelivererReposit delivererReposit;
    @Autowired
    public ReceiptReposit receiptReposit;
    @Autowired
    public OrderReposit orderReposit;
    @Autowired
    public SubscriptionMenuReposit subscriptionMenuReposit;

    @Override
    @PostMapping("/admin/getProfile")
    public ResponseEntity<com.restaurant.restaurantordersystem.entity.Admin> getAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Admin admin) {
        try {
            return new ResponseEntity<>(adminReposit.findByUserNameAndPassWord(admin.getUserName(), admin.getPassWord()), HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<com.restaurant.restaurantordersystem.entity.Admin> getAccountSecurely(@RequestBody com.restaurant.restaurantordersystem.entity.Admin admin) {
        return null;
    }

    @Override
    @PostMapping("/admin/editProfile")
    public ResponseEntity<String> editAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Admin admin) {
        try {
            com.restaurant.restaurantordersystem.entity.Admin admin1 = adminReposit.findByUserNameAndPassWord(admin.getUserName(), admin.getPassWord());
            if(!admin.getUserName().equals(admin.getNewUserName()) && adminReposit.existsByUserName(admin.getNewUserName()))
                return new ResponseEntity<>("نام کاربری در سیستم موجود است، لطفا نام کربری را تغییر دهید", HttpStatus.FORBIDDEN);
            else{
                admin1.setUserName(admin.getNewUserName());
                admin1.setPassWord(admin.getNewPassWord());
                admin1.setMobile(admin.getMobile());
                admin1.setCity(admin.getCity());
                adminReposit.save(admin1);
                return new ResponseEntity<>("اطلاعات شما با موفقیت بروزرسانی گردید", HttpStatus.OK);
            }
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق" , HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/admin/createProfile")
    public ResponseEntity<String> createAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Admin admin) {
        try {
            if(adminReposit.findAll().size() == 0){
                admin.setId("1");
                adminReposit.save(admin);
                return new ResponseEntity<>("مالک سایت با موفقیت ثبت نام شد", HttpStatus.OK);
            }
            else {
                com.restaurant.restaurantordersystem.entity.Admin owner = adminReposit.findAll().get(0);
                if(admin.getAdmin().getUsername().equals(owner.getUserName()) && admin.getAdmin().getPassword().equals(owner.getPassWord())){
                    if (adminReposit.existsByUserName(admin.getUserName()))
                        return new ResponseEntity<>("نام کاربری قبلا ثبت شده است", HttpStatus.FORBIDDEN);
                    else {
                        admin.setId(String.valueOf(adminReposit.findAll().size()+1));
                        admin.setSuspended(false);
                        adminReposit.save(admin);
                        return new ResponseEntity<>("ثبت نام ادمین با موفقیت انجام گردید.", HttpStatus.CREATED);
                    }
                }
                else return new ResponseEntity<>("شما اجازه این عملیات را ندارید", HttpStatus.LOCKED);
            }
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/admin/logIn")
    public ResponseEntity<String> logIn(@RequestBody com.restaurant.restaurantordersystem.entity.Admin admin){
        if (adminReposit.existsByUserName(admin.getUserName())) {
            String passWord = adminReposit.findByUserNameAndPassWord(admin.getUserName(), admin.getPassWord()).getPassWord();
            if (passWord.equals(admin.getPassWord()))
                return new ResponseEntity<>("ادمین مورد نظر یافت شد", HttpStatus.OK);
            else return new ResponseEntity<>("رمز عبورتان اشتباه میباشد", HttpStatus.FORBIDDEN);
        }
        else return new ResponseEntity<>("چنین ادمینی در سیستم وجود ندارد", HttpStatus.NOT_FOUND);
    }

    @Override
    @GetMapping("/admin/restaurants/{username}/{password}")
    public ResponseEntity<List<Restaurant>> getRestaurants(@PathVariable String username, @PathVariable String password) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(username, password))
                return new ResponseEntity<>(restaurantReposit.findAll(), HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/admin/blockRestaurant")
    public ResponseEntity<String> blockRestaurant(@RequestBody Restaurant restaurant) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(restaurant.getAdmin().getUsername(), restaurant.getAdmin().getPassword())){
                Restaurant restaurant1 = restaurantReposit.findByUserNameAndPassWord(restaurant.getUserName(), restaurant.getPassWord());
                restaurant1.setSuspended(true);
                restaurantReposit.save(restaurant1);
                return new ResponseEntity<>("مسدود شد", HttpStatus.OK);
            }
            else return new ResponseEntity<>("اجازه این عملیات را ندارید", HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/admin/unBlockRestaurant")
    public ResponseEntity<String> unBlockRestaurant(@RequestBody Restaurant restaurant) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(restaurant.getAdmin().getUsername(), restaurant.getAdmin().getPassword())){
                Restaurant restaurant1 = restaurantReposit.findByUserNameAndPassWord(restaurant.getUserName(), restaurant.getPassWord());
                restaurant1.setSuspended(false);
                restaurantReposit.save(restaurant1);
                return new ResponseEntity<>("آزاد شد", HttpStatus.OK);
            }
            else return new ResponseEntity<>("اجازه این عملیات را ندارید", HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @GetMapping("/admin/deliverers/{username}/{password}")
    public ResponseEntity<List<Deliverer>> getDeliverers(@PathVariable String username, @PathVariable String password) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(username, password))
                return new ResponseEntity<>(delivererReposit.findAll(), HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/admin/blockDeliverer")
    public ResponseEntity<String> blockDeliverer(@RequestBody Deliverer deliverer) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(deliverer.getAdmin().getUsername(), deliverer.getAdmin().getPassword())){
                Deliverer deliverer1 = delivererReposit.findByUserNameAndPassWord(deliverer.getUserName(), deliverer.getPassWord());
                deliverer1.setSuspended(true);
                delivererReposit.save(deliverer1);
                return new ResponseEntity<>("مسدود شد", HttpStatus.OK);
            }
            else return new ResponseEntity<>("شما اجازه این عملیات را ندارید", HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/admin/unBlockDeliverer")
    public ResponseEntity<String> unBlockDeliverer(@RequestBody Deliverer deliverer) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(deliverer.getAdmin().getUsername(), deliverer.getAdmin().getPassword())){
                Deliverer deliverer1 = delivererReposit.findByUserNameAndPassWord(deliverer.getUserName(), deliverer.getPassWord());
                deliverer1.setSuspended(false);
                delivererReposit.save(deliverer1);
                return new ResponseEntity<>("آزاد شد", HttpStatus.OK);
            }
            else return new ResponseEntity<>("شما اجازه این عملیات را ندارید", HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @GetMapping("/admin/customers/{username}/{password}")
    public ResponseEntity<List<Customer>> getCustomers(@PathVariable String username, @PathVariable String password) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(username,password))
                return new ResponseEntity<>(customerReposit.findAll(), HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @GetMapping("/admin/supports/{username}/{password}")
    public ResponseEntity<List<Support>> getSupportRequests(@PathVariable String username, @PathVariable String password) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(username, password))
                return new ResponseEntity<>(supportReposit.findSupportsByStatus(0), HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/admin/respondSupport")
    public ResponseEntity<String> respondSupportRequests(@RequestBody Support supportRequest) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(supportRequest.getAdmin().getUsername(), supportRequest.getAdmin().getPassword())){
                Support support = supportReposit.findById(supportRequest.getId()).get();
                support.seen();
                support.setResponse(supportRequest.getResponse());
                supportReposit.save(support);
                return new ResponseEntity<>("پاسخ ثبت شد", HttpStatus.OK);
            }
            else return new ResponseEntity<>("شما اجازه این عملیات را ندارید", HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @GetMapping("/admin/receipts/{username}/{password}")
    public ResponseEntity<List<Receipt>> getReceipts(@PathVariable String username, @PathVariable String password) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(username, password))
                return new ResponseEntity<>(receiptReposit.findAll(), HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @GetMapping("/admin/orders/{username}/{password}")
    public ResponseEntity<List<FoodOrder>> getOrders(@PathVariable String username, @PathVariable String password) {
        try {
            if(adminReposit.existsByUserNameAndPassWord(username, password))
                return new ResponseEntity<>(orderReposit.findAll(), HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.LOCKED);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @GetMapping("/admin/subscriptions/{username}/{password}")
    public ResponseEntity<List<SubscriptionMenu>> getSubscriptions(@PathVariable String username, @PathVariable String password){
        try {
            if(adminReposit.existsByUserNameAndPassWord(username, password))
                return new ResponseEntity<>(subscriptionMenuReposit.findAll(), HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.LOCKED);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @GetMapping("/admin/deleteSub/{id}/{username}/{password}")
    public ResponseEntity<String> deleteSub(@PathVariable Integer id, @PathVariable String username, @PathVariable String password) {
        try {
            subscriptionMenuReposit.deleteById(id);
            return new ResponseEntity<>("اشتراک از لیست حذف شد", HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @PostMapping("/admin/addSub")
    public ResponseEntity<String> addSub(@RequestBody SubscriptionMenu subscriptionMenu) {
        try {
            subscriptionMenuReposit.save(subscriptionMenu);
            return new ResponseEntity<>("اشتراک به لیست افزوده شد", HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }
}
