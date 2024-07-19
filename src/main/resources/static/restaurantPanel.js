import {Panel} from "./panel.js";
import {Server} from "./server.js";
import {Data} from "./data.js";

let data;
let restaurant;

Panel.setToggleMenu();

Data.setOnLoad(()=> Data.sendData("ok", window.opener));

window.addEventListener("message", (event)=>{
    if(event.data === "iframe")
        Data.sendData(restaurant, document.getElementById("iframe").contentWindow);
})
window.addEventListener("message", (event)=>{
    if(event.data === "refresh")
        window.location.reload();
})

window.addEventListener("message", (event)=> {
    data = JSON.parse(JSON.parse(event.data));
    Server.POST("/restaurant/getProfile",{
        "userName":data.userName,
        "passWord":data.passWord
    })
        .then(res => res.json())
        .then(obj => {
            restaurant = obj;
            document.getElementById("name").innerHTML = restaurant.name;
            let balance = document.createElement("span");
            balance.innerHTML = Panel.deliminateNumber(restaurant.balance);
            document.getElementById("balance").appendChild(balance);
            document.getElementById("sub-title").innerHTML = restaurant.subscriptions[restaurant.subscriptions.length-1].title;
            document.getElementById("sub-remaining").innerHTML = restaurant.subscriptions[restaurant.subscriptions.length-1].capacity-restaurant.subscriptions[restaurant.subscriptions.length-1].used;
            let newOrders = restaurant.orders.filter(order => order.status === 0);
            if(newOrders.length > 0)
                Panel.popUp("شما "+newOrders.length+" عدد سفارش جدید دارید", "orange", "white");
        })
        .then(()=>{
            restaurant.orders.forEach((order)=>{
                if(order.deliverer !== null){
                    if(typeof order.deliverer === "string")
                        Server.POST("/deliverer/getSecureProfile", {"id":order.deliverer})
                            .then(res => res.json())
                            .then(deliv => order.deliverer = deliv)
                            .catch(err => {});
                    else if(typeof order.deliverer === "object")
                        Server.POST("/deliverer/getSecureProfile", {"id":order.deliverer.id})
                            .then(res => res.json())
                            .then(deliv => order.deliverer = deliv)
                            .catch(err => {});
                }
                else order.deliverer = {};
            })
        })
        .catch(err => Panel.popUp("خطا در دریافت اطلاعات از سرور", "red", "white"));
});

const targetIds = ["viewProfile", "viewNewOrders", "viewFoodMenu", "viewAttachments", "viewStatistics", "buySubscription", "requestForSupport"];
const iframeSources = ["/restaurantProfile", "/restaurantNewOrders", "/restaurantManageFoodMenu", "/restaurantManageAttachments", "/restaurantViewStatistics", "/restaurantViewSubscriptions", "/restaurantRequestForSupport"];

for (let i = 0 ; i < targetIds.length ; i++)
    document.getElementById(targetIds[i]).addEventListener("click", ()=>{
        Panel.selectMenu(targetIds, targetIds[i], Server.url.concat(iframeSources[i]));
    })

document.getElementById("exit").addEventListener("click", ()=> Panel.logOut());