import {Panel} from "./panel.js";
import {Server} from "./server.js";
import {Data} from "./data.js";
import {Map} from "./map.js";

let data;
let customer;
let restaurant = {
    id:0
};
let orderBox = [];
let lat;
let lng;

Panel.setToggleMenu();

Data.setOnLoad(()=> Data.sendData("ok", window.opener));

window.addEventListener("message", (event)=>{
    if (event.source.location.pathname === "/logIn"){
        data = JSON.parse(JSON.parse(event.data));
        Server.POST("/customer/profile",{
            "userName":data.userName,
            "passWord":data.passWord
        })
            .then(res => res.json())
            .then(obj => {
                customer = obj;
                document.getElementById("name").innerHTML = customer.name;
                document.getElementById("surName").innerHTML = customer.surName;
                let balance = document.createElement("span");
                balance.innerHTML = Panel.deliminateNumber(customer.balance);
                document.getElementById("balance").appendChild(balance);
            })
            .then(()=>{
                customer.orders.forEach(order =>{
                    if(order.deliverer !== null){
                        if(typeof order.deliverer === "string")
                            Server.POST("/deliverer/getSecureProfile", {"id":order.deliverer})
                                .then(res => res.json())
                                .then(deliv => order.deliverer = deliv)
                                .catch(err => {});
                        else if(typeof order.deliverer === "object")
                            Server.POST("/deliverer/getSecureProfile", {"id":order.deliverer.id})
                                .then(res => res.json())
                                .then(deliv => order.deliverer = deliv)
                                .catch(err => {});
                    }
                    else order.deliverer = {};
                })
            })
            .then(()=>{
                customer.orders.forEach(order =>{
                    if(typeof order.restaurant === "number")
                        Server.POST("/restaurant/getSecureProfile", {"id":order.restaurant})
                            .then(res => res.json())
                            .then(rest => order.restaurant = rest)
                            .catch(err => {});
                    else if(typeof order.restaurant === "object")
                        Server.POST("/restaurant/getSecureProfile", {"id":order.restaurant.id})
                            .then(res => res.json())
                            .then(rest => order.restaurant = rest)
                            .catch(err => {});
                })
            })
            .catch(err => Panel.popUp("خطا در دریافت اطلاعات از سرور", "red", "white"));
    }
    else if(event.data === "iframe")
        Data.sendData(customer, document.getElementById("iframe").contentWindow);
    else if(event.data === "foodIframe")
        Data.sendData(restaurant, document.getElementById("iframe").contentWindow);
    else if(event.data === "logOut")
        window.open("/logIn", "*");
    else if(event.source.location.pathname === "/restaurants") {
        restaurant = JSON.parse(JSON.parse(event.data));
    }
    if(event.source.location.pathname === "/foods"){
        let orderedFood = JSON.parse(JSON.parse(event.data));
        if (orderBox.length !== 0){
            if(orderBox[0].restaurant !== orderedFood.restaurant)
                Panel.popUp("شما به صورت همزمان میتوانید از یک رستوران سفارش دهید", "orangered", "white");
            else if(exists(orderBox, orderedFood))
                Panel.popUp("غذای مورد نظر در سبد سفارش موجود است", "red", "white");
            else {
                orderBox.push(orderedFood);
                Panel.popUp("غذا به سبد اضافه شد", "green", "white");
            }
        }
        else{
            orderBox.push(orderedFood);
            Panel.popUp("غذا به سبد اضافه شد", "green", "white");
        }
    }
})

function exists(orderBox, orderedFood){
    let found = false;
    orderBox.forEach((food)=>{
        if (food.name === orderedFood.name)
            found = true;
    })
    return found;
}

const targetIds = ["viewProfile", "viewOrders", "viewRestaurants"];
const iframeSources = ["/customerViewProfile", "/customerOrders", "/restaurants"];

for (let i = 0 ; i < targetIds.length ; i++)
    document.getElementById(targetIds[i]).addEventListener("click", ()=>{
        Panel.selectMenu(targetIds, targetIds[i], Server.getFetchUrl(iframeSources[i]));
    })

document.getElementById("exit").addEventListener("click", Panel.logOut);

document.getElementById("cartIcon").addEventListener("click", ()=>{
    if(orderBox.length === 0)
        Panel.popUp("سبد شما خالی میباشد", "orangered", "white");
    else showCart(orderBox);
});

function showCart(orderBox){

    let foods = orderBox.map((food) => {
        return(`
            <tr>
                <td>${food.name}</td>
                <td>${Panel.deliminateNumber(food.price)} ریال</td>
                <td>${food.count} پرس</td>
                <td>${food.discountPercent} %</td>
                <td>${Panel.deliminateNumber(food.totalPayment)} ریال</td>
                <td>
                    <button id="increase" class="increaseBtn">+</button>
                </td>
                <td>
                    <button id="decrease" class="decreaseBtn">-</button>
                </td>
                <td>
                    <button id="delete" class="deleteBtn">حذف</button>
                </td>
            </tr>
        `)
    })
    let cart = (`
            <div class="closeButtonContainer">
                <button onclick="document.getElementById('cartContainer').remove()">X</button>
            </div>
            <div id="tableBox">
                <table>
                    <tr>
                        <th>غذا</th>
                        <th>قیمت</th>
                        <th>تعداد</th>
                        <th>تخفیف %</th>
                        <th>قیمت کل</th>
                    </tr>
                    ${foods}
                </table>
            </div>
            <div class="cartItem">
                <h1>رستوران:</h1>
                <h1>${restaurant.name}</h1>
            </div>
            <div class="cartItem">
                <h1>مبلغ سفارش:</h1>
                <h1 id="finalPayment" class="infoValue">${Panel.deliminateNumber(String(calculateFinalPayment()))} ریال</h1>
            </div>
            <div class="cartItem">
                <input id="addressValue" type="text" placeholder = "آدرس را وارد کنید:"/>
            </div>
            
            <button id="selectOnMap" class="button">تعیین موقعیت</button>
            <button id="submitOrder" class="button">ثبت سفارش</button>
            
        `);

    let cartContainer = document.createElement("div");
    cartContainer.innerHTML = cart;
    cartContainer.className = "popUpContainer";
    cartContainer.id = "cartContainer";
    document.body.appendChild(cartContainer);

    for(let index = 0 ; index < orderBox.length; index++){
        document.getElementsByClassName("increaseBtn").item(index).addEventListener("click", ()=>{
            orderBox[index].count++;
            document.getElementById('cartContainer').remove();
            calculateFoodPrice(index);
            showCart(orderBox);
        })
    }

    for(let index = 0 ; index < orderBox.length; index++){
        document.getElementsByClassName("decreaseBtn").item(index).addEventListener("click", ()=>{
            if(orderBox[index].count > 1){
                orderBox[index].count--;
                document.getElementById('cartContainer').remove();
                calculateFoodPrice(index);
                showCart(orderBox);
            }
        })
    }

    for(let index = 0 ; index < orderBox.length; index++){
        document.getElementsByClassName("deleteBtn").item(index).addEventListener("click", ()=>{
            orderBox.splice(index, 1);
            document.getElementById('cartContainer').remove();
            showCart(orderBox);
        })
    }

    document.getElementById("selectOnMap").addEventListener("click", ()=>{
        document.getElementById("cartContainer").remove();
        let mapFrame = document.createElement("div");
        mapFrame.id = "mapFrame";
        let wrapper = document.createElement("div");
        wrapper.className = "popUpContainer";
        wrapper.id = "mapWrapper";
        wrapper.appendChild(mapFrame);
        document.body.appendChild(wrapper);
        Panel.popUp("لطفا موقعیتتان را کلیک فرمایید", "green", "white");
        let app = Map.showMap(
            Map.tabrizGeo.lat,
            Map.tabrizGeo.lng,
            14,
            "#mapFrame"
        )
        // Add in a crosshair for the map
        var crosshairIcon = L.icon({
            iconUrl: 'https://cloud.son.ir/index.php/s/qVUHj7HJSr1A7MK/download',
            iconSize:     [20, 20], // size of the icon
            iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
        });
        var crosshairMarker = new L.marker(app.map.getCenter(), {icon: crosshairIcon, clickable:false});
        crosshairMarker.addTo(app.map);

        // Move the crosshair to the center of the map when the user pans
        app.map.on('move', function(e) {
            crosshairMarker.setLatLng(app.map.getCenter());
        });

        crosshairMarker.on('click', function(event){
            lat = event.latlng.lat;
            lng = event.latlng.lng;
            Panel.popUp("موقعیت شما ثبت شد", "green", "white");
            wrapper.remove();
            document.body.appendChild(cartContainer);
        });
    })
    document.getElementById("submitOrder").addEventListener("click", ()=>{
        if(!document.getElementById("addressValue").value)
            Panel.popUp("آدرس را وارد کنید", "red", "white");
        else {
            let order = {
                "status":0,
                "address":document.getElementById("addressValue").value,
                "price":calculateFinalPayment(),
                "foods":orderBox,
                "attachments":null,
                "customer":{"userName":customer.userName, "passWord":customer.passWord},
                "restaurant":{"userName":restaurant.userName},
                "longitude":lng,
                "latitude":lat
            };
            if(!(order["latitude"] && order["longitude"]))
                Panel.popUp("اطلاعات جغرافیایی شما ثبت نشده است", "red", "white");
            else {
                fetch("https://map.ir/eta/driving/"+String(restaurant.longitude)+","+String(restaurant.latitude)+";"+String(order.longitude)+","+String(order.latitude), {
                    headers:{
                        "x-api-key":Map.apiKey
                    },
                })
                    .then(res => res.json())
                    .then(obj => {
                        if(obj.routes.distance > 12000)
                            order.transferPayment = String(Math.round((3*Math.log2((obj.routes.distance/1000)+4)-6)*100000));
                        else {
                            if((new Date().getHours() > 12 && new Date().getHours() < 15)||
                                (new Date().getHours() > 18 && new Date().getHours() < 21)
                            )
                                order.transferPayment = String(Math.round((3*Math.log2((obj.routes.distance/1000)+4)-6)*100000));
                            else
                                order.transferPayment = String(Math.round(obj.routes.distance/2*100));
                        }
                    })
                    .then(()=> Panel.popUp("در صورتیکه رستوران مورد نظر سفارش را با پیک بوقلمون ارسال کند هزینه آن، "+Panel.deliminateNumber(order.transferPayment)+" ریال"+" خواهد بود", "green", "white"))
                    .then(()=>{
                        setTimeout(()=>{
                            let status;
                            Server.POST("/customer/submitOrder", order)
                                .then(res => {
                                    status = res.status;
                                    res.text()
                                        .then(msg => {
                                            if(status === 200){
                                                orderBox.splice(0, orderBox.length);
                                                restaurant = {id:0};
                                                lat = undefined;
                                                lng = undefined;
                                            }
                                            Panel.popUp(msg, "green", "white")
                                        })
                                })

                                .catch(err => Panel.popUp("خطا در ازسال اطلاعات به سرور", "red", "white"));
                        }, 4000);
                    })
                    .catch(err => Panel.popUp("خطا در محسابه کرایه پیک ", "red", "white"));
            }
        }
    })
}

function calculateFoodPrice(index){
    orderBox[index]["totalPayment"] = String(
        Number(orderBox[index]["price"])
        *(100-Number(orderBox[index]["discountPercent"]))/100
        *Number(orderBox[index]["count"])
    );
}

function calculateFinalPayment(){
    let amount = 0;
    orderBox.forEach(food => {
        amount += Number(food.totalPayment);
    })
    return String(amount);
}

document.getElementById("viewWallet").addEventListener("click", ()=>{

    let container = (`
    <div class="closeButtonContainer">
        <button onclick="document.getElementById('walletCont').remove()">X</button>
    </div>
    <div style="width: 100%" class="infoContainer">
        <div class="walletItem">
            <h1>موجودی فعلی شما:</h1>
            <h1>${Panel.deliminateNumber(customer.balance)} ریال</h1>
        </div>
        <div class="walletItem">
            <h1>مبلغ افزایش کیف پول:</h1>
            <input id="increaseValue" type="text" placeholder = "مبلغ را به ریال وارد نمایید:"/>
        </div>
    </div>
    <button id="chargeBalance" class="button">پرداخت</button>
    
    `)

    let div = document.createElement("div");
    div.innerHTML = container;
    div.id = "walletCont"
    div.className = "popUpContainer";
    div.classList.add('walletContainer');
    document.body.appendChild(div);
    document.getElementById("chargeBalance").addEventListener("click", ()=>{
        Server.POST("/customer/increaseWallet", {"userName":customer.userName, "passWord":customer.passWord, "increaseAmount":document.getElementById("increaseValue").value})
            .then(res => res.text())
            .then(msg => Panel.popUp(msg, "green", "white"))
            .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red", "white"));
    })
});

document.getElementById("viewFulfillingOrder").addEventListener("click", ()=>{
    let last = customer.orders[customer.orders.length-1];
    if(last.status !== 3){
        let container = (`
    <div class="closeButtonContainer">
        <button onclick="document.getElementById('fulfillingOrder').remove()">X</button>
    </div>
    <div class="infoContainer">
    <div class="infoBox">
        <span class="infoLabel">کد سفارش:</span>
        <span class="infoValue"> ${last.id}</span>
    </div>
    <div class="infoBox">
        <span class="infoLabel">وضعیت سفارش:</span>
        <span class="infoValue"> ${Panel.getStatus(last.status)}</span>
    </div>
    <div class="infoBox">
        <span class="infoLabel">رستوران:</span>
        <span class="infoValue"> ${last.restaurant.name}</span>
    </div>
    <div class="infoBox">
        <span class="infoLabel">تلفن رستوران:</span>
        <span class="infoValue"> ${last.restaurant.phone}</span>
    </div>
     <div class="infoBox">
        <span class="infoLabel">نحوه ارسال:</span>
        <span class="infoValue"> ${last.needDeliverer?"با پیک بوقلمون":"با پیک رستوران"}</span>
    </div>
    <div class="infoBox">
        <span class="infoLabel">آدرس تحویل:</span>
        <span class="infoValue"> ${last.address}</span>
    </div>
    <div class="infoBox">
        <span class="infoLabel">مبلغ سفارش:</span>
        <span class="infoValue"> ${Panel.deliminateNumber(last.price)} ریال</span>
    </div>
    <div class="infoBox">
        <span class="infoLabel">نام پیک:</span>
        <span class="infoValue">${last.deliverer.name?last.deliverer.name+" "+last.deliverer.surName:"---"}</span>
    </div>
    <div class="infoBox">
        <span class="infoLabel">موبایل راننده:</span>
        <span class="infoValue"> ${last.deliverer.mobile?last.deliverer.mobile:"---"}</span>
    </div>
    <div class="infoBox">
        <span class="infoLabel">هزینه حمل:</span>
        <span class="infoValue"> ${last.needDeliverer ? Panel.deliminateNumber(last.transferPayment)+" ریال" : "بر اساس تعرفه رستوران"}</span>                   
    </div>
    </div>
    <button id="getOrderBtn" class="button">تحویل گرفتم</button>
        `);
        let div = document.createElement("div");
        div.innerHTML = container;
        div.className = "popUpContainer";
        div.classList.add('walletContainer');
        div.id = "fulfillingOrder";
        document.body.appendChild(div);
        document.getElementById("getOrderBtn").addEventListener("click", ()=>{
            Server.POST("/customer/getOrder", {"id":last.id})
                .then(res => res.text())
                .then(msg => Panel.popUp(msg, "green", "white"))
                .catch(err => Panel.popUp("خطا در برقرای ارتباط", "red", "white"));
        })
    }
    else Panel.popUp("شما سفارش در حال انجام ندارید", "orangered", "white");
})

