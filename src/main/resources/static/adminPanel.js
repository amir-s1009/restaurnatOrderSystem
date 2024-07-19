import {Panel} from "./panel.js";
import {Server} from "./server.js";
import {Data} from "./data.js";

let data;
let admin;

Panel.setToggleMenu();

Data.setOnLoad(()=>Data.sendData("ok", window.opener, "*"));
window.addEventListener("message", (event)=>{
    if(event.source.location.pathname === "/logIn"){
        data = JSON.parse(JSON.parse(event.data));
        Server.POST("/admin/getProfile",{
            "userName":data.userName,
            "passWord":data.passWord
        })
            .then(res => res.json())
            .then(obj => {
                admin = obj;
                document.getElementById("name").innerHTML = admin.name;
                document.getElementById("surName").innerHTML = admin.surName;
            })
            .catch(err => Panel.popUp("خطا در دریافت اطلاعات از سرور", "red", "white"));
    }
    if(event.data === "iframe")
        Data.sendData(admin, document.getElementById("iframe").contentWindow)
})

const targetIds = ["viewProfile", "viewRestaurants", "viewCustomers", "viewDeliverers", "viewReceipts", "viewIncomes", "viewOrders", "viewSubscriptions", "viewSupportRequests"];
const iframeSources = ["/adminViewProfile", "/adminViewRestaurants", "/adminViewCustomers", "/adminViewDeliverers", "/adminViewReceipts", "/adminIncomeStats", "/adminOrderStats", "/adminViewSubscriptions", "/adminViewSupportRequests"];

for (let i = 0 ; i < targetIds.length ; i++)
    document.getElementById(targetIds[i]).addEventListener("click", ()=>{
        Panel.selectMenu(targetIds, targetIds[i], Server.url.concat(iframeSources[i]));
    })

document.getElementById('exit').addEventListener("click", ()=> Panel.logOut());


