import {Server} from "./server.js";
import {Panel} from "./panel.js";

let admin;
let orders;

window.addEventListener("load", ()=> window.top.postMessage("iframe", "*"))
window.addEventListener("message", (event)=>{
    if(event.source.location.pathname.includes("/adminPanel")) {
        admin = JSON.parse(JSON.parse(event.data));
        Server.AuthorizedGET("/admin/orders", admin.userName, admin.passWord)
            .then(res => res.json())
            .then(list => orders = list)
            .then(()=>{
                let filtered = orders.filter(order => new Date(order.dateDelivered).getMonth() === new Date().getMonth());
                let sum = 0;
                filtered.forEach(order => sum += Number(order.price));
                document.getElementById("restTotal").innerHTML = Panel.deliminateNumber(String(sum))+" ریال";
                document.getElementById("interestFromRest").innerHTML = Panel.deliminateNumber(String(Math.round(sum/50)))+" ریال";

                sum = 0;
                filtered.forEach(order => sum += Number(order.transferPayment));
                document.getElementById("delivTotal").innerHTML = Panel.deliminateNumber(String(sum))+" ریال";
                document.getElementById("interestFromDeliv").innerHTML = Panel.deliminateNumber(String(Math.round(sum*15/100)))+" ریال";
            })
            .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red","white"));
    }
})

document.getElementById("monthNumber").addEventListener("change", ()=>{
    Server.AuthorizedGET("/admin/orders", admin.userName, admin.passWord)
        .then(res => res.json())
        .then(list => orders = list)
        .then(()=>{
            let filtered = orders.filter(order => new Date(order.dateDelivered).getMonth() === Number(document.getElementById("monthNumber").value)-1);
            let sum = 0;
            filtered.forEach(order => sum += Number(order.price));
            document.getElementById("restTotal").innerHTML = Panel.deliminateNumber(String(sum))+" ریال";

            sum = 0;
            filtered.forEach(order => sum += Number(order.transferPayment));
            document.getElementById("delivTotal").innerHTML = Panel.deliminateNumber(String(sum))+" ریال";
        })
        .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red","white"));
})