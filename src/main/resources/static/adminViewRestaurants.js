import {Panel} from "./panel.js";
import {Server} from "./server.js";

let restaurants;
let admin;

window.addEventListener("load", ()=> window.top.postMessage("iframe", "*"))
window.addEventListener("message", (event)=>{
    if(event.source.location.pathname.includes("/adminPanel")) {
        admin = JSON.parse(JSON.parse(event.data));
        Server.AuthorizedGET("/admin/restaurants", admin.userName, admin.passWord)
            .then(res => res.json())
            .then(list => restaurants = list)
            .then(()=>{
                let table = document.getElementById("table");
                restaurants.forEach((restaurant, index) =>{
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                    <td>${restaurant.name}</td>
                    <td>${restaurant.city}</td>
                    <td>${restaurant.address}</td>
                    <td>${restaurant.managerName}</td>
                    <td>${restaurant.managerSurName}</td>
                    <td>${restaurant.phone}</td>
                    <td>${restaurant.balance}</td>
                    <td>${restaurant.accountNo}</td>
                    <td><button class="block">تعلیق</button></td>
                    <td><button class="unblock">آزادسازی</button></td>
               `;
                    table.appendChild(tr);
                    document.getElementsByClassName("block").item(index).addEventListener("click", ()=>{
                        Server.POST("/admin/blockRestaurant", {
                            "userName":restaurant.userName,
                            "passWord":restaurant.passWord,
                            "admin":{"userName":admin.userName, "passWord":admin.passWord}
                        })
                            .then(res => res.text())
                            .then(msg => Panel.popUp(msg, "green", "white"))
                            .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red", "white"));
                    });
                    document.getElementsByClassName("unblock").item(index).addEventListener("click", ()=>{
                        Server.POST("/admin/unBlockRestaurant", {
                            "userName":restaurant.userName,
                            "passWord":restaurant.passWord,
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