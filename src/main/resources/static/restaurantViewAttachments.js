import {Panel} from "./panel.js";
import {Server} from "./server.js";

let restaurant;
let attachments;
window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message" , (event)=>{
    restaurant = JSON.parse(JSON.parse(event.data));
    attachments = restaurant.attachmentMenu;
    Panel.displayFoodsForRestaurant(attachments);
})

document.getElementById("submit").addEventListener("click", ()=>{
    Server.POST("/restaurant/editAttachmentMenu", {"userName":restaurant.userName,"attachmentMenu":attachments})
        .then(res => res.text())
        .then(msg => {
            Panel.popUp(msg, "green", "white");
            window.top.postMessage("refresh", "*");
        })
        .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور", "red", "white"));
})