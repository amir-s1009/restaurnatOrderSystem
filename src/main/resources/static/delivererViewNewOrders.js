import {Panel} from "./panel.js";
import {Server} from "./server.js";
import {Map} from "./map.js";

let deliverer;
let orders;
let status1;
window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message", (event)=>{
    deliverer = JSON.parse(JSON.parse(event.data));
    Server.GET("/deliverer/getNewOrders")
        .then(res => res.json())
        .then(list =>{
            if(list.length === 0)
                Panel.popUp("هیچ سفارش جدیدی یافت نشد", "red", "white");
            orders = list;
        })
        .then(()=>{
            orders.forEach(order =>{
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
        .then(()=> {
            if(deliverer.status === 0)
                showNewOrders(orders);
            else if(deliverer.status === 1)
                routeRestaurant(deliverer.orderBox[deliverer.orderBox.length-1]);
            else if(deliverer.status === 2)
                routeDestination(deliverer.orderBox[deliverer.orderBox.length-1]);

        })
        .catch(err => Panel.popUp(err, "red", "white"));
})

function showNewOrders(orders){
    let table = document.getElementById("table");
    let headers = ["id", "address", "restaurant", "restaurant"];
    for (let i = 0 ; i < orders.length; i++) {
        let tr = document.createElement("tr");
        //
        for(let j = 0 ; j < headers.length ; j++) {
            let td = document.createElement("td");
            if(j === 2)
                td.innerHTML = orders[i].restaurant.name;
            else if(j === 3)
                td.innerHTML = orders[i].restaurant.address;

            else td.innerHTML = (orders[i])[headers[j]];

            tr.appendChild(td);

        }

        let transferPay = document.createElement("td");
        transferPay.innerHTML = Panel.deliminateNumber(orders[i].transferPayment)+" ریال";
        tr.appendChild(transferPay);

        Panel.createButton(tr, "انجام سفارش", null, null,()=>{

            Server.POST("/deliverer/acceptOrder", {
                "id":(orders[i])["id"],
                "deliverer":{"userName":deliverer.userName, "passWord":deliverer.passWord}
            })
                .then(res => {
                    status1 = res.status;
                    res.text()
                        .then(msg => {
                            if(status1 !== 200)
                                Panel.popUp(msg, "green", "white");
                            else {
                                routeRestaurant(orders[i]);
                            }
                        })
                })
                .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور", "red", "white"));
        })
        //
        table.appendChild(tr);
    }
}

function routeRestaurant(order){
    while (document.body.hasChildNodes())
    while (document.body.hasChildNodes())
        document.body.lastChild.remove();
    let tookOrder = Panel.createComponent("button",     "محموله را گرفتم", null, "reachedRestaurant");
    let tookOrderBtnBar = Panel.createComponent("div", null, "buttonBar", null);
    tookOrderBtnBar.appendChild(tookOrder);
    tookOrder.addEventListener("click", ()=>{
        Server.POST("/deliverer/takeFromRestaurant", {
            "id":order.id,
            "deliverer":{"userName":deliverer.userName, "passWord":deliverer.passWord}
        })
            .then(res => {
                status1 = res.status;
                res.text()
                    .then(msg => {
                        if(status1 === 200){
                            routeDestination(order);
                        }
                        else Panel.popUp(msg, "red", "white");
                    })
            })
    });
    document.body.appendChild(tookOrderBtnBar);
    Map.showDirections(
        38.0792,
        46.2887,
        38.0792,
        46.2887,
        order.restaurant.latitude,
        order.restaurant.longitude,
        13,
        "body"
    );
}

function  routeDestination(order){
    while (document.body.hasChildNodes())
        document.body.lastChild.remove();
    let deliveredOrderBtn = Panel.createComponent("button", "تحویل دادم", null, "deliveredOrder");
    let deliveredOrderBtnBar = Panel.createComponent("div", null, "buttonBar", null);
    deliveredOrderBtnBar.appendChild(deliveredOrderBtn);
    deliveredOrderBtn.addEventListener("click", ()=>{
        Server.POST("/deliverer/deliverOrder", {"id":order.id, "deliverer":{"userName":deliverer.userName, "passWord":deliverer.passWord}})
            .then(res => {
                status1 = res.status;
                res.text()
                    .then((msg)=>{
                        if(status1 === 200)
                            window.location.reload();
                        Panel.popUp(msg, "green", 'white');
                    })
            })

    })
    document.body.appendChild(deliveredOrderBtnBar);
    Map.showDirections(
        38.0792,
        46.2887,
        order.restaurant.latitude,
        order.restaurant.longitude,
        order.latitude,
        order.longitude,
        13,
        "body"
    );
}