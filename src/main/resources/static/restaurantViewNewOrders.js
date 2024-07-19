import {Panel} from "./panel.js";
import {Server} from "./server.js";

let restaurant;
let orders = [];
window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message", (event)=> {
    restaurant = JSON.parse(JSON.parse(event.data));
    orders = restaurant.orders;
});

document.getElementById("newOrders").addEventListener("click", ()=>{
    showOrders(orders.filter(order => order.status === 0), 0);
})
document.getElementById("toBeSent").addEventListener("click", ()=>{
    showOrders(orders.filter(order => (order.status === 1 && !order.needDeliverer) || (order.status === 5)), 10);
})
document.getElementById("delivererToBeFound").addEventListener("click", ()=>{
    showOrders(orders.filter(order => order.status === 1 && order.needDeliverer), 10)
})
document.getElementById("sentOrders").addEventListener("click", ()=>{
    showOrders(orders.filter(order => order.status === 2), 2)
})

function showOrders(orders, status){
    document.getElementById("table").remove();
    let table = document.createElement("table");
    table.id = "table";
    let headers = (`
        <th>کد سفارش</th>
        <th>آدرس سفارش</th>
        <th>مبلغ سفارش</th>
        <th>لیست سفارش</th>
    `);
    let headerTr = document.createElement("tr");
    headerTr.innerHTML = headers;
    table.appendChild(headerTr);
    document.getElementById("container").appendChild(table);

    if (orders.length === 0)
        Panel.popUp("نتیجه ای یافت نشد", "red", "white");

    for (let i = 0; i < orders.length; i++) {
        let tr = document.createElement("tr");
        let row = "";
        let baseInfo = (`
                        <td>${orders[i].id}</td>
                        <td>${orders[i].address}</td>
                        <td>${Panel.deliminateNumber(orders[i].price)} ریال</td>
                        <td>
                            <button class="viewFoodsBtn">مشاهده</button>
                        </td>
                `);

        if(status === 0) {
            row =  (baseInfo + `
                            <td>
                                <button class="confirmAcceptBtn">قبول</button>
                            </td>
                            <td>
                                <button class="rejectOrder">لغو</button>
                            </td>
                    `)
        }
        else if(orders[i].status === 1 && !orders[i].needDeliverer){
            row =  (baseInfo+`
                        <td>
                            <button class="sendOrder">ارسال</button>
                        </td>
                    `)
        }
        else if(orders[i].status === 1 && orders[i].needDeliverer){
            row =  (baseInfo+`
                        <td>
                            <button class="cancelNeedDeliverer">لغو پیک</button>
                        </td>
                    `)
        }
        else if(orders[i].status === 5){
            row =  (baseInfo+`
                        <td>
                            <button class="viewDeliverer">اطلاعات راننده</button>
                        </td>
                        <td>
                            <button class="sendOrder">ارسال</button>
                        </td>
                    `)
        }
        else row = baseInfo;
        tr.innerHTML = row;
        table.appendChild(tr);

        document.getElementsByClassName("viewFoodsBtn").item(i).addEventListener("click", ()=> {
            let div = document.createElement('div');
            div.className = 'popUpContainer';
            div.classList.add('tableView');
            div.id = 'viewOrderFoods';
            div.innerHTML = (`
                    <div class='closeButtonContainer'>
                        <button onclick="document.getElementById('viewOrderFoods').remove()">X</button>
                    </div>
                    <table>
                        <tr>
                            <th>غذا</th>
                            <th>قیمت واحد</th>
                            <th>تخفیف%</th>
                            <th>تعداد</th>
                            <th>قیمت کل</th>
                        </tr>
                        ${
                orders[i].foods.map((food) => {
                    return (`
                                    <tr>
                                        <td>${food.name}</td>
                                        <td>${Panel.deliminateNumber(food.price)} ریال</td>
                                        <td>${food.discountPercent} %</td>
                                        <td>${food.count} پرس</td>
                                        <td>${Panel.deliminateNumber(food.totalPayment)} ریال</td>
                                    </tr>
                                  `)
                })
            }
                    </table>
                `)
            document.body.appendChild(div);
        });

        if(status === 0){
            document.getElementsByClassName("rejectOrder").item(i).addEventListener("click", ()=>{
                Server.POST('/restaurant/rejectOrder', {'id':orders[i].id, 'restaurant':{"userName":restaurant.userName, "passWord":restaurant.passWord}})
                    .then(res => res.text())
                    .then(msg => Panel.popUp(msg, 'green', 'white'))
                    .catch(err => Panel.popUp('خطا در ارسال اطلاعات به سرور', 'red', 'white'));
            })

            document.getElementsByClassName("confirmAcceptBtn").item(i).addEventListener("click", ()=>{
                let div = document.createElement("div");
                div.className = "popUpContainer";
                div.classList.add("walletContainer");
                div.id = "confirmBox";
                div.style.overflow = "hidden";
                div.style.height = "200px";
                div.innerHTML = (`
                            <div class="closeButtonContainer">
                                <button onclick="document.getElementById('confirmBox').remove()">X</button>
                            </div>
                            <div class="infoContainer">
                                <h3>آیا مایل به استفاده از پیک بوقلمون هستید؟</h3>
                                <div class="infoBox">
                                    <button id="yesBtn" style="width: 70px; padding: 5px; background-color: green; color: white">بله:)</button>    
                                    <button id="noBtn" style="width: 90px; padding: 5px; background-color: orangered; color: white">نه، پیک دارم</button>
                                </div>
                            </div>
                        `);
                document.body.appendChild(div);
                document.getElementById("yesBtn").addEventListener("click", ()=>{
                    Panel.popUp("رستوران گرامی، در حال حاضر امکان استفاده از این سرویس وجود ندارد", "orangered", "white");
                    /*document.getElementById('confirmBox').remove();
                    Server.POST('/restaurant/acceptOrder', {'id':orders[i].id, "restaurant":{"userName":restaurant.userName, "passWord":restaurant.passWord} ,'needDeliverer':true})
                        .then(res => res.text())
                        .then(msg => Panel.popUp(msg, 'green', 'white'))
                        .catch(err => Panel.popUp('خطا در ارسال اطلاعات به سرور', 'red', 'white'));*/
                })
                document.getElementById("noBtn").addEventListener("click", ()=>{
                    document.getElementById('confirmBox').remove();
                    Server.POST('/restaurant/acceptOrder', {'id':orders[i].id, "restaurant":{"userName":restaurant.userName, "passWord":restaurant.passWord} ,'needDeliverer':false})
                        .then(res => res.text())
                        .then(msg => Panel.popUp(msg, 'green', 'white'))
                        .catch(err => Panel.popUp('خطا در ارسال اطلاعات به سرور', 'red', 'white'));
                })
            });
        }
        else if(orders[i].status === 5){
            document.getElementsByClassName("sendOrder").item(i).addEventListener("click", ()=>{
                Server.POST('/restaurant/sendOrder', {'id':orders[i].id, "restaurant":{"userName":restaurant.userName, "passWord":restaurant.passWord}})
                    .then(res => res.text())
                    .then(msg => Panel.popUp(msg, 'green', 'white'))
                    .catch(err => Panel.popUp('خطا در برقراری ارتباط', 'red', 'white'));
            })

            document.getElementsByClassName("viewDeliverer").item(i).addEventListener("click", ()=>{
                let div = document.createElement("div");
                div.className = "popUpContainer";
                div.classList.add("walletContainer");
                div.id = "delivererInfo";
                div.innerHTML = (`
                            <div class="closeButtonContainer">
                                <button onclick="document.getElementById('delivererInfo').remove()">X</button>
                            </div>
                            <div class="infoContainer">
                                <div class="infoBox">
                                    <span class="infoLabel">نام و نام خانوادگی:</span>
                                    <span class="infoValue">${orders[i].deliverer.name} ${orders[i].deliverer.surName}</span>
                                </div>
                                <div class="infoBox">
                                    <span class="infoLabel">موبایل:</span>
                                    <span class="infoValue">${orders[i].deliverer.mobile}</span>
                                </div>
                            </div>
                        `);
                document.body.appendChild(div);
            });
        }
        else if(orders[i].status === 1 && orders[i].needDeliverer){
            document.getElementsByClassName("cancelNeedDeliverer").item(i).addEventListener("click",()=>{
                Server.POST('/restaurant/cancelNeedDeliverer', {'id':orders[i].id, "restaurant":{"userName":restaurant.userName, "passWord":restaurant.passWord}})
                    .then(res => res.text())
                    .then(msg => Panel.popUp(msg, 'green', 'white'))
                    .catch(err => Panel.popUp('خطا در برقراری ارتباط', 'red', 'white'));
            })
        }
        else if(orders[i].status === 1 && !orders[i].needDeliverer){
            document.getElementsByClassName("sendOrder").item(i).addEventListener("click", ()=>{
                Server.POST('/restaurant/sendOrder', {'id':orders[i].id, "restaurant":{"userName":restaurant.userName, "passWord":restaurant.passWord}})
                    .then(res => res.text())
                    .then(msg => Panel.popUp(msg, 'green', 'white'))
                    .catch(err => Panel.popUp('خطا در برقراری ارتباط', 'red', 'white'));
            })
        }


    }
}