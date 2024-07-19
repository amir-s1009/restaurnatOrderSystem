import {Server} from "./server.js";
import {Panel} from "./panel.js";

let deliverers;
let admin;

window.addEventListener("load", ()=> window.top.postMessage("iframe", "*"))
window.addEventListener("message", (event)=>{
    if(event.source.location.pathname.includes("/adminPanel")) {
        admin = JSON.parse(JSON.parse(event.data));
        Server.AuthorizedGET("/admin/deliverers", admin.userName, admin.passWord)
            .then(res => res.json())
            .then(list => deliverers = list)
            .then(()=>{
                let table = document.getElementById("table");
                deliverers.forEach((deliverer, index) =>{
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                    <td>${deliverer.name}</td>
                    <td>${deliverer.surName}</td>
                    <td>${deliverer.mobile}</td>
                    <td>${deliverer.city}</td>
                    <td>${deliverer.balance}</td>
                    <td>${deliverer.accountNo}</td>
                    <td><button class="block">تعلیق</button></td>
                    <td><button class="unblock">آزادسازی</button></td>
                `;
                    table.appendChild(tr);
                    document.getElementsByClassName("block").item(index).addEventListener("click", ()=>{
                        Server.POST("/admin/blockDeliverer", {
                            "userName":deliverer.userName,
                            "passWord":deliverer.passWord,
                            "admin":{"userName":admin.userName, "passWord":admin.passWord}
                        })
                            .then(res => res.text())
                            .then(msg => Panel.popUp(msg, "green", "white"))
                            .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red", "white"));
                    });
                    document.getElementsByClassName("unblock").item(index).addEventListener("click", ()=>{
                        Server.POST("/admin/unBlockDeliverer", {
                            "userName":deliverer.userName,
                            "passWord":deliverer.passWord,
                            "admin":{"userName":admin.userName, "passWord":admin.passWord}
                        })
                            .then(res => res.text())
                            .then(msg => Panel.popUp(msg, "green", "white"))
                            .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red", "white"));
                    });
                })
            })
            .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red", "white"));
    }
})