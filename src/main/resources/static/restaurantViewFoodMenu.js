import {Panel} from "./panel.js";
import {Server} from "./server.js";

let restaurant;
let foods;
window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message" , (event)=>{
    restaurant = JSON.parse(JSON.parse(event.data));
    foods = restaurant.foodMenu;
    Panel.displayFoodsForRestaurant(foods);
})

document.getElementById("submit").addEventListener("click", ()=>{
    Server.PUT("/restaurant/editFoodMenu", {"userName":restaurant.userName, "passWord":restaurant.passWord, "foodMenu":foods})
        .then(res => res.text())
        .then(msg => {
            Panel.popUp(msg, "green", "white");
        })
        .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور", "red", "white"));
})