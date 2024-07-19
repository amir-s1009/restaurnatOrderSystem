package com.restaurant.restaurantordersystem.controller;

import com.restaurant.restaurantordersystem.entity.*;
import com.restaurant.restaurantordersystem.entity.Subscription;
import com.restaurant.restaurantordersystem.interfaces.Restaurant;
import com.restaurant.restaurantordersystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
public class RestaurantApi implements Restaurant {
    @Autowired
    private RestaurantReposit restaurantReposit;
    @Autowired
    private OrderReposit orderReposit;
    @Autowired
    private DelivererReposit delivererReposit;
    @Autowired
    private SupportReposit supportReposit;
    @Autowired
    private SubscriptionReposit subscriptionReposit;
    @Autowired
    private SubscriptionMenuReposit subscriptionMenuReposit;
    /*@Autowired
    private TransferQueueReposit transferQueueReposit;*/

    @Override
    @PostMapping("/restaurant/logIn")
    public ResponseEntity<String> logIn(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant){
        if (restaurantReposit.existsByUserName(restaurant.getUserName()) && !restaurantReposit.findByUserNameAndPassWord(restaurant.getUserName(), restaurant.getPassWord()).isSuspended()) {
            String passWord = restaurantReposit.findByUserName(restaurant.getUserName()).getPassWord();
            if (passWord.equals(restaurant.getPassWord()))
                return new ResponseEntity<>("رستوران مورد نظر یافت شد", HttpStatus.OK);
            else return new ResponseEntity<>("رمز عبورتان اشتباه میباشد", HttpStatus.FORBIDDEN);
        }
        else return new ResponseEntity<>("چنین رستورانی در سیستم وجود ندارد یا به حالت تعلیق در آمده است", HttpStatus.NOT_FOUND);
    }
    @Override
    @PostMapping("/restaurant/getProfile")
    public ResponseEntity<com.restaurant.restaurantordersystem.entity.Restaurant> getAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant) {
        try {
            com.restaurant.restaurantordersystem.entity.Restaurant restaurant1 = restaurantReposit.findByUserNameAndPassWord(restaurant.getUserName(), restaurant.getPassWord());
            if(!restaurant1.isSuspended())
                return new ResponseEntity<>(restaurant1, HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @PostMapping("/restaurant/getSecureProfile")
    public ResponseEntity<com.restaurant.restaurantordersystem.entity.Restaurant> getAccountSecurely(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant) {
        try {
            com.restaurant.restaurantordersystem.entity.Restaurant restaurant1 = restaurantReposit.findById(restaurant.getId()).get();
            if(!restaurant1.isSuspended()){
                restaurant1.setPassWord(null);
                restaurant1.setBalance(null);
                restaurant1.setAccountNo(null);
                restaurant1.setOrders(null);
                restaurant1.setSupportRequest(null);
                return new ResponseEntity<>(restaurant1, HttpStatus.OK);
            }
            else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @PostMapping("/restaurant/editProfile")
    public ResponseEntity<String> editAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant) {
        try {
            com.restaurant.restaurantordersystem.entity.Restaurant restaurant1 = restaurantReposit.findByUserNameAndPassWord(restaurant.getUserName(), restaurant.getPassWord());
            if(restaurant1.isSuspended())
                return new ResponseEntity<>("حساب کاربری شما به حالت تعلیق می باشد و امکان ویرایش میسر نمی باشد", HttpStatus.FORBIDDEN);
            else if(!restaurant.getUserName().equals(restaurant.getNewUserName()) && restaurantReposit.existsByUserName(restaurant.getNewUserName()))
                return new ResponseEntity<>("نام کاربری در سیستم موجود است، لطفا نام کربری را تغییر دهید", HttpStatus.FORBIDDEN);
            else{
                restaurant1.setUserName(restaurant.getNewUserName());
                restaurant1.setPassWord(restaurant.getNewPassWord());
                restaurant1.setPhone(restaurant.getPhone());
                restaurant1.setAddress(restaurant.getAddress());
                restaurant1.setManagerName(restaurant.getManagerName());
                restaurant1.setManagerSurName(restaurant.getManagerSurName());
                restaurant1.setLongitude(restaurant.getLongitude());
                restaurant1.setLatitude(restaurant.getLatitude());
                restaurant1.setHrFrom(restaurant.getHrFrom());
                restaurant1.setHrTo(restaurant.getHrTo());
                restaurant1.setAccountNo(restaurant.getAccountNo());
                restaurantReposit.save(restaurant1);
                return new ResponseEntity<>("اطلاعات شما با موفقیت بروزرسانی گردید.", HttpStatus.OK);
            }
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق" , HttpStatus.EXPECTATION_FAILED);
        }
    }
    @Override
    @PostMapping("/restaurant/createProfile")
    public ResponseEntity<String> createAccount(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant) {
        try {
            if (restaurantReposit.existsByUserName(restaurant.getUserName()))
                return new ResponseEntity<>("نام کاربری قبلا ثبت شده است", HttpStatus.FORBIDDEN);
            else {
                restaurant.setBalance("0");
                restaurant.setSuspended(false);
                restaurantReposit.save(restaurant);
                return new ResponseEntity<>("ثبت نام شما با موفقیت انجام گردید.", HttpStatus.CREATED);
            }
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق",HttpStatus.EXPECTATION_FAILED);
        }
    }
    @Override
    @PostMapping("/restaurant/requestForSupport")
    public ResponseEntity<String> sendSupport(@RequestBody Support support) {
        try{
            com.restaurant.restaurantordersystem.entity.Restaurant restaurant = restaurantReposit.findByUserNameAndPassWord(support.getRestaurant().getUserName(), support.getRestaurant().getPassWord());
            List<Support> supports = restaurant.getSupportRequest();
            if(restaurant.getSupportRequest().size() > 0 && supports.get(supports.size()-1).getDate().getDate() == new Date().getDate())
                return new ResponseEntity<>("شما روزانه امکان ارسال یک تیکت را دارید، درخواست شما ارسال نشد", HttpStatus.FORBIDDEN);
            else {
                support.setDate(new Date());
                support.setStatus(0);
                support.setRestaurant(restaurant);
                supports = restaurant.getSupportRequest();
                supports.add(support);
                restaurant.setSupportRequest(supports);
                supportReposit.save(support);
                restaurantReposit.save(restaurant);
                return new ResponseEntity<>("درخواست شما با موفقیت ثبت گردید", HttpStatus.OK);
            }
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @GetMapping("/restaurant/subscriptions")
    public ResponseEntity<List<SubscriptionMenu>> subscriptions(){
        try {
            return new ResponseEntity<>(subscriptionMenuReposit.findAll(), HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @PostMapping("/restaurant/buySubscription/{id}")
    public ResponseEntity<String> buySubscription(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant, @PathVariable Integer id) {
        try{
            com.restaurant.restaurantordersystem.entity.Restaurant restaurant1 = restaurantReposit.findByUserNameAndPassWord(restaurant.getUserName(), restaurant.getPassWord());
            SubscriptionMenu subscriptionMenu = subscriptionMenuReposit.findById(id).get();
            Subscription lastSub;
            if(restaurant.getSubscriptions().size() != 0)
                lastSub = restaurant1.getSubscriptions().get(restaurant1.getSubscriptions().size()-1);
            else {
                lastSub = new Subscription();
                lastSub.setUsed(0);
                lastSub.setCapacity(0);
            }
            if(lastSub.remaining() == 0){
                if(Long.parseLong(restaurant1.getBalance()) >= Long.parseLong(subscriptionMenu.getAmount())){
                    List<Subscription> subscriptions = restaurant1.getSubscriptions();
                    Subscription subscription = new Subscription();
                    subscription.setTitle(subscriptionMenu.getTitle());
                    subscription.setCapacity(subscriptionMenu.getCapacity());
                    subscription.setUsed(0);
                    subscription.setDate(new Date());
                    subscriptions.add(subscription);
                    restaurant1.setSubscriptions(subscriptions);
                    restaurant1.withdrawBalance(subscriptionMenu.getAmount());
                    subscriptionReposit.save(subscription);
                    restaurantReposit.save(restaurant1);
                    return new ResponseEntity<>("اشتراک شما با عنوان "+subscription.getTitle()+" و به تعداد "+ subscription.getCapacity()+" بار انجام سفارش، با موفقیت خریداری شد", HttpStatus.OK);
                }
                else return new ResponseEntity<>("موجودی شما برای خرید اشتراک کافی نمی باشد", HttpStatus.FORBIDDEN);
            }
            else return new ResponseEntity<>("با توجه به اینکه شما اشتراک فعال دارید، امکان خریداری اشتراک جدید رو ندارید", HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }
    @Override
    @PostMapping("/restaurant/acceptOrder")
    public ResponseEntity<String> acceptOrder(@RequestBody FoodOrder order) {
        try {
            com.restaurant.restaurantordersystem.entity.Restaurant restaurant = restaurantReposit.findByUserNameAndPassWord(order.getRestaurant().getUserName(), order.getRestaurant().getPassWord());
            Subscription lastSubscription;
            if(restaurant.getSubscriptions() != null)
                lastSubscription = restaurant.getSubscriptions().get(restaurant.getSubscriptions().size()-1);
            else lastSubscription = new Subscription();
            if(lastSubscription.remaining() > 0){
                lastSubscription.setUsed(lastSubscription.getUsed()+1);
                FoodOrder order1 = orderReposit.findById(order.getId()).get();
                order1.accept();
                order1.setNeedDeliverer(order.isNeedDeliverer());
                orderReposit.save(order1);
                subscriptionReposit.save(lastSubscription);
                return new ResponseEntity<>("سفارش با موفقیت پذیرفته شد", HttpStatus.OK);
            }
            else return new ResponseEntity<>("اشتراک انجام سفارش شما به اتمام رسیده است لطفا ابتدا نسبت به خرید اشتراک جدید اقدام فرمایید", HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }
    @Override
    @PostMapping("/restaurant/rejectOrder")
    public ResponseEntity<String> rejectOrder(@RequestBody FoodOrder order) {
        try {
            if(restaurantReposit.existsByUserNameAndPassWord(order.getRestaurant().getUserName(), order.getRestaurant().getPassWord())){
                FoodOrder order1 = orderReposit.findById(order.getId()).get();
                if(order1.getStatus() == 1)
                    return new ResponseEntity<>("امکان لغو سفارش را ندارید", HttpStatus.FORBIDDEN);
                order1.reject();
                orderReposit.save(order1);
                return new ResponseEntity<>("سفارش با موفقیت لغو شد", HttpStatus.OK);
            }
            else return new ResponseEntity<>("عملیات شما به دلیل مسائل امنیتی متوقف گردید", HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }
    @PostMapping("/restaurant/cancelNeedDeliverer")
    public ResponseEntity<String> cancelNeedDeliverer(@RequestBody FoodOrder order){
        return null;
        /*try {
            if(restaurantReposit.existsByUserNameAndPassWord(order.getRestaurant().getUserName(), order.getRestaurant().getPassWord())){
                FoodOrder order1 = orderReposit.findById(order.getId()).get();
                if(order1.getStatus() != 5){
                    order1.setNeedDeliverer(false);
                    orderReposit.save(order1);
                    return new ResponseEntity<>("درخواست برای پیک بوقلمون لغو گردید", HttpStatus.OK);
                }
                else return new ResponseEntity<>("پیک بوقلمون سفارش را پذیرفته است و امکان لغو میسر نمی باشد", HttpStatus.FORBIDDEN);
            }
            else return new ResponseEntity<>("عملیات شما به دلیل مسائل امنیتی متوقف گردید", HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }*/
    }
    @Override
    @PostMapping("/restaurant/sendOrder")
    public ResponseEntity<String> sendOrder(@RequestBody FoodOrder order) {
        try {
            if(restaurantReposit.existsByUserNameAndPassWord(order.getRestaurant().getUserName(), order.getRestaurant().getPassWord())){
                FoodOrder order1 = orderReposit.findById(order.getId()).get();
                if(order1.getStatus() == 2)
                    return new ResponseEntity<>("سفارش با موفقیت ارسال شد", HttpStatus.OK);
                else if(order1.getStatus() == 1 && !order1.isNeedDeliverer()){
                    order1.send();
                    orderReposit.save(order1);
                    return new ResponseEntity<>("سفارش با موفقیت ارسال شد", HttpStatus.OK);
                }
                else return new ResponseEntity<>("درخواست شما غیر مجاز است، لطفا ترتیب مراحل را بدرستی طی فرمایید", HttpStatus.FORBIDDEN);
            }
            else return new ResponseEntity<>("عملیات شما به دلیل مسائل امنیتی متوقف گردید", HttpStatus.FORBIDDEN);
        }
        catch (Exception exception){
            return new ResponseEntity<>("ملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }
    @Override
    @PostMapping("/restaurant/editAttachmentMenu")
    public ResponseEntity<String> editAttachmentMenu(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant) {
        try{
            com.restaurant.restaurantordersystem.entity.Restaurant restaurant1 = restaurantReposit.findByUserName(restaurant.getUserName());
            restaurant1.setAttachmentMenu(restaurant.getAttachmentMenu());
            restaurantReposit.save(restaurant1);
            return new ResponseEntity<>("منوی مخلفات با موفقیت بروزرسانی شد", HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }
    @Override
    @PutMapping("/restaurant/editFoodMenu")
    public ResponseEntity<String> editFoodMenu(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant){
        try {
            com.restaurant.restaurantordersystem.entity.Restaurant restaurant1 = restaurantReposit.findByUserNameAndPassWord(restaurant.getUserName(), restaurant.getPassWord());
            List<FoodMenu> menus = restaurant.getFoodMenu();
            for(FoodMenu menu : menus)
                menu.setRestaurant(restaurant1);
            restaurant1.setFoodMenu(menus);
            restaurantReposit.save(restaurant1);
            return new ResponseEntity<>("منوی غذا با موفقیت بروزرسانی شد", HttpStatus.OK);
        }
        catch (Exception exception){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PostMapping("/restaurant/requestTransfer")
    public ResponseEntity<String> withdrawWallet(@RequestBody com.restaurant.restaurantordersystem.entity.Restaurant restaurant){
        return null;
        /*try {
            com.restaurant.restaurantordersystem.entity.Restaurant restaurant1 = restaurantReposit.findByUserNameAndPassWord(restaurant.getUserName(), restaurant.getPassWord());
            // fill in the fields...
            List<TransferQueue> line = transferQueueReposit.findAll();
            TransferQueue request = new TransferQueue();
            if(Long.parseLong(restaurant1.getBalance()) > 500000000)
                request.setAmount("500000000");
            else request.setAmount(restaurant1.getBalance());
            request.setDescription("تسویه حساب کیف پول");
            request.setDestinationFirstname(restaurant1.getManagerName());
            request.setDestinationLastname(restaurant1.getManagerSurName());
            request.setDestinationNumber("IR".concat(restaurant1.getAccountNo()));

            line.add(request);
            transferQueueReposit.saveAllAndFlush(line);
            return new ResponseEntity<>("درخواست شما در صف واریز قرار گرفت. نوبت شما در صف، "+line.size()+" می باشد", HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("عملیات ناموفق", HttpStatus.EXPECTATION_FAILED);
        }*/
    }
}
