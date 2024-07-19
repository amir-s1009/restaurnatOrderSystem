import {Panel} from "./panel.js";
import {Server} from "./server.js";
import {Data} from "./data.js";

let data;
let deliverer;

Panel.setToggleMenu();

Data.setOnLoad(()=> Data.sendData("ok", window.opener));

window.addEventListener("message", (event)=>{
    if (event.source.location.pathname === "/logIn"){
        data = JSON.parse(JSON.parse(event.data));
        Panel.popUp("کاربر عزیز به پنل خود خوش آمدید", "purple", "white");
        Server.POST("/deliverer/getProfile",{
            "userName":data.userName,
            "passWord":data.passWord
        })
            .then(res => res.json())
            .then(obj => {
                deliverer = obj;
                document.getElementById("name").innerHTML = deliverer.name;
                document.getElementById("surName").innerHTML = deliverer.surName;
                let balance = document.createElement("span");
                balance.innerHTML = Panel.deliminateNumber(deliverer.balance);
                document.getElementById("balance").appendChild(balance);
            })
            .then(()=>{
                deliverer.orderBox.forEach(order =>{
                    if(typeof order.restaurant === "number")
                        Server.POST("/restaurant/getSecureProfile", {"id":order.restaurant})
                            .then(res => res.json())
                            .then(rest => order.restaurant = rest)
                            .catch(err => Panel.popUp("خطا در دریافت اطلاعات", "red", "white"));
                    else if(typeof order.restaurant === "object")
                        Server.POST("/restaurant/getSecureProfile", {"id":order.restaurant.id})
                            .then(res => res.json())
                            .then(rest => order.restaurant = rest)
                            .catch(err => Panel.popUp("خطا در دریافت اطلاعات", "red", "white"));
                })
            })
            .catch(err => Panel.popUp("خطا در دریافت اطلاعات از سرور", "red", "white"));
    }
    else if(event.data === "iframe")
        Data.sendData(deliverer, document.getElementById("iframe").contentWindow);
})

const targetIds = ["viewProfile", "viewOrders", "viewNewOrders"];
const iframeSources = ["/delivererViewProfile", "/delivererViewOrders", "/delivererViewNewOrders"];

for (let i = 0 ; i < targetIds.length ; i++)
    document.getElementById(targetIds[i]).addEventListener("click", ()=>{
        Panel.selectMenu(targetIds, targetIds[i], Server.getFetchUrl(iframeSources[i]));
    })

document.getElementById("exit").addEventListener("click", Panel.logOut);


