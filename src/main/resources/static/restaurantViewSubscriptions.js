import {Server} from "./server.js";
import {Panel} from "./panel.js";

let restaurant;

window.addEventListener("load", ()=> window.top.postMessage("iframe", "*"));

window.addEventListener("message", (event)=>{
    restaurant = JSON.parse(JSON.parse(event.data));
    let subscriptions;
    Server.GET("/restaurant/subscriptions")
        .then(res => res.json())
        .then(list => subscriptions = list)
        .then(()=>{
            subscriptions.forEach(sub => {
                let div = document.createElement("div");
                div.className = "card";
                div.innerHTML = `
                        <h1 class="title">${sub.title}</h1>
                        <div class="itemBox">
                            <h1 class="capacity">${sub.capacity}</h1>
                            <span class="capacityDes">بار سفارش</span>
                        </div>
                        <div class="itemBox">
                            <h1 class="price">${Panel.deliminateNumber(sub.amount)}</h1>
                            <span class="priceDes" style="margin-right: 10px">ریال</span>
                        </div>
                        <button class="button">فعالسازی</button>
                `;
                document.body.appendChild(div);
            })

            for(let i = 0 ; i < subscriptions.length; i++)
                document.getElementsByClassName("button").item(i).addEventListener("click", ()=>{
                    Server.POST_Path("/restaurant/buySubscription", subscriptions[i].id, {
                        "userName":restaurant.userName,
                        "passWord":restaurant.passWord
                    })
                        .then(res => res.text())
                        .then(msg => Panel.popUp(msg, "green", "red"))
                        .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red", "white"));

                })
        })
        .catch(err => Panel.popUp("خطا در برقراری ارتباط با سرور", "red", "white"));
})