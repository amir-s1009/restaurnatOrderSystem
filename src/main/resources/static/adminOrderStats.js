import {Server} from "./server.js";
import {Panel} from "./panel.js";

let orders;
let admin;

window.addEventListener("load", ()=> window.top.postMessage("iframe", "*"))
window.addEventListener("message", (event)=>{
    if(event.source.location.pathname.includes("/adminPanel")) {
        admin = JSON.parse(JSON.parse(event.data));
        Server.AuthorizedGET("/admin/orders", admin.userName, admin.passWord)
            .then(res => res.json())
            .then(list => orders = list)
            .then(()=>{
                let table = document.getElementById("table");
                orders.forEach(order => {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.price}</td>
                    <td>${order.address}</td>
                    <td>${order.restaurant}</td>
                    <td>${order.customer}</td>
                    <td>${order.needDeliverer? "پیک بوقلمون": "پیک رستوران"}</td>
                    <td>${order.deliverer}</td>
                    <td>${order.needDeliverer? order.transferPayment:"تعرفه رستوران"}</td>
                    <td>${Panel.getStatus(order.status)}</td>
                `;
                    table.appendChild(tr);
                })
            })
    }
})