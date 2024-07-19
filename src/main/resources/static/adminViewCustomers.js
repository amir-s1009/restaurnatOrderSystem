import {Panel} from "./panel.js";
import {Server} from "./server.js";

let admin;

window.addEventListener("load", ()=> window.top.postMessage("iframe", "*"))
window.addEventListener("message", (event)=>{
    if(event.source.location.pathname.includes("/adminPanel")) {
        admin = JSON.parse(JSON.parse(event.data));
        let customers;
        Server.AuthorizedGET("/admin/customers", admin.userName, admin.passWord)
            .then(res => res.json())
            .then(list => customers = list)
            .then(()=>{
                let table = document.getElementById("table");
                customers.forEach(customer =>{
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.surName}</td>
                <td>${customer.mobile}</td>
                <td>${customer.city}</td>
                <td>${customer.gender}</td>
                <td>${customer.balance}</td>
            `;
                    table.appendChild(tr);
                });
            })
            .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red", "white"));
    }
})