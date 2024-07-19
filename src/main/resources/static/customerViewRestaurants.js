import {Panel} from "./panel.js";
import {Server} from "./server.js";

window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
let customer;
window.addEventListener("message", (event) =>{
    customer = JSON.parse(JSON.parse(event.data));
    Server.POST("/customer/restaurants", {"city":customer.city})
        .then(res => res.json())
        .then(list => Panel.displayRestaurants(list))
        .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور"));
})
document.getElementById("search").addEventListener("click", ()=>{
    if(!document.getElementById("city").value)
        Panel.popUp("شهر را وارد کنید", "red", "white");
    else {
        Server.POST("/customer/restaurants", {"city":document.getElementById("city").value})
            .then(res => res.json())
            .then(list => Panel.displayRestaurants(list))
            .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور"));
    }
})