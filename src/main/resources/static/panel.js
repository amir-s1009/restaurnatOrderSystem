import {Server} from "./server.js";
import {TableFrame} from "./frame.js";

export class Panel{
    static defaultBgColor = "#463528";
    static defaultFontColor = "#ff8000";
    static selectedItemId;
    static popUp(text, backgroundColor, fontColor){
        let div = document.createElement("div");
        let h1 = document.createElement("h1");

        h1.innerHTML = text;
        div.setAttribute("id", "welcomeBox");

        div.style.position = "fixed";
        div.style.transition = "0.5s";
        if(window.innerWidth < 400)
            div.style.left = "3%";
        else div.style.left = "32%";
        div.style.top = "-10%";
        div.style.borderRadius = "10px";
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.justifyContent = "center";
        div.style.backgroundColor = backgroundColor;
        if(window.innerWidth < 400)
            div.style.width = "90%";
        else div.style.width = "30%";
        div.style.padding = "3% 2%";
        div.style.opacity = "0";
        h1.style.fontSize = "18px";
        h1.style.color = fontColor;
        h1.style.flexFlow = "wrap";
        h1.style.direction = "rtl";
        h1.style.textAlign = "right";

        div.appendChild(h1);
        document.body.appendChild(div);

        let opacity = 0;
        let top = -10;
        let fadeIn = setInterval(()=>{
            document.getElementById("welcomeBox").style.opacity = String(opacity);
            document.getElementById("welcomeBox").style.top = String(top)+"%";
            opacity += 0.1;
            top += 1.9;
            if(opacity > 1.0)
                clearInterval(fadeIn);
        },150);


        setTimeout(()=>{
            top = top - 1.9;
            opacity = 1.0;
            let fadeOut = setInterval(()=>{
                document.getElementById("welcomeBox").style.opacity = String(opacity);
                document.getElementById("welcomeBox").style.top = String(top)+"%";
                opacity = opacity-0.1;
                top = top-1;
                if(opacity < 0) {
                    document.getElementById("welcomeBox").remove();
                    clearInterval(fadeOut);
                }
            },150);
        }, 2700)
    }
    static setToggleMenu(){
        document.getElementsByClassName("navbar").item(0).addEventListener("mouseenter", ()=> this.openSideMenu());
        document.getElementsByClassName("navbar").item(0).addEventListener("mouseleave", ()=> this.closeSideMenu());
    }
    static openSideMenu(){
        let navbar = document.getElementsByClassName("navbar").item(0);
        let viewBox = document.getElementsByClassName("viewBox").item(0);

        navbar.style.width = "20%";
        viewBox.style.width = "77%";
        document.getElementById("viewWallet").style.visibility = "visible";
        try {
            document.getElementById("viewFulfillingOrder").style.visibility = "visible";
        }
        catch (e){

        }
    }
    static closeSideMenu(){
        let navbar = document.getElementsByClassName("navbar").item(0);
        let viewBox = document.getElementsByClassName("viewBox").item(0);

        navbar.style.width = "5%";
        viewBox.style.width = "95%";
        document.getElementById("viewWallet").style.visibility = "hidden";
        try {
            document.getElementById("viewFulfillingOrder").style.visibility = "hidden";
        }
        catch (e){

        }
    }
    static selectMenu(menu, targetId, iframeSrc){
        document.getElementById("iframe").src = iframeSrc;
        this.selectedItemId = targetId;
        this.changeItemColor(targetId, "orangered", "white");
        document.getElementById(targetId).addEventListener("mouseleave", () => {this.changeItemColor(targetId, "orangered", "white")});
        document.getElementById(targetId).addEventListener("mouseenter", ()=>{this.changeItemColor(targetId, "orangered", "white")})
        menu.forEach((item)=>{
            if (item !== this.selectedItemId) {
                this.setHover(item, "rgb(150, 72, 45)", "white");
                document.getElementById(item).style.backgroundColor = this.defaultBgColor;
                document.getElementById(item).style.color = this.defaultFontColor;
            }
        })
    }
    static changeItemColor(targetId, bgColor, fontColor){
        document.getElementById(targetId).style.backgroundColor = bgColor;
        document.getElementById(targetId).style.color = fontColor;
    }
    static setHover(targetId, bgColor, fontColor){
        document.getElementById(targetId).addEventListener("mouseenter", () => {this.changeItemColor(targetId, bgColor, fontColor)});
        document.getElementById(targetId).addEventListener("mouseleave", () => {this.changeItemColor(targetId, this.defaultBgColor, this.defaultFontColor)});
    }
    static logOut(){
        Server.openWindow("/logIn", "_self");
    }
    static deliminateNumber(number){
        let result = [];
        let deliminatedNumber = "";
        let counter = 0;
        for(let i = number.length-1 ; i >= 0 ; i--){
            if(counter % 3 === 0 && counter !== 0)
                result.unshift(',');
            result.unshift(number.charAt(i));
            counter++;
        }
        result.forEach(char => {
            deliminatedNumber += char;
        })
        return deliminatedNumber;
    }
    static getStatus(statusCode){
        let statusText = "";
        if(statusCode === 0)
            statusText = "در انتظار پذیرش";
        else if(statusCode === 1)
            statusText = "آماده ارسال";
        else if(statusCode === 2)
            statusText = "ارسال شده";
        else if (statusCode === 3)
            statusText = "تحویل داده شده";
        else if (statusCode === 4)
            statusText = "رد شده";
        else if (statusCode === 5)
            statusText = "در انتظار ارسال";
        return statusText;
    }

    static createComponent(element, innerHtml, className, id){
        let component = document.createElement(element);
        component.innerHTML = innerHtml;
        component.className = className;
        component.id = id;
        return component;
    }
    static createButton(tableRow, buttonText, className, id, callBack){
        let td = document.createElement("td");
        let button = document.createElement("button");
        button.innerHTML = buttonText;
        button.id = id;
        button.className = className;
        button.addEventListener("click", () => {
            callBack();
        })
        td.appendChild(button);
        tableRow.appendChild(td);
    }
    static displayRestaurants(restaurants){
        if (restaurants.length === 0)
            Panel.popUp("هیچ رستورانی برای نمایش وجود ندارد", "red", "white");
        else {
            document.getElementById("restaurantBox").childNodes.forEach(child => child.remove());
            for(let i = 0 ; i < restaurants.length ; i++){

                let card = (`
                        <div class="infoBox">
                            <h1>رستوران</h1>
                            <h1> ${restaurants[i].name}</h1>
                        </div>
                        <img alt="لوگو" src="https://www.mahyashop.com/uploads/UserFiles/Images/Detail-Pics%2F%D8%A8%D9%88%D9%82%D9%84%D9%85%D9%88%D9%86%2FPRODUCT_turkey-03-02-03.png">
                        <div class="infoBox">
                            <span class="address">آدرس:</span>
                            <span class="address"> ${restaurants[i].address}</span>
                        </div>
                        <div class="infoBox">
                            <span class="phone">تلفن:</span>
                            <span class="phone"> ${restaurants[i].phone}</span>
                        </div>
                        <div class="infoBox">
                            <span class="address">ساعت کاری:</span>
                            <span class="address"> از ${restaurants[i].hrFrom} الی ${restaurants[i].hrTo}</span>
                        </div>
                `)
                let restaurantCard = document.createElement("div");
                restaurantCard.innerHTML = card;
                restaurantCard.className = "restaurantCard";
                restaurantCard.addEventListener("click", ()=>{
                    if(restaurants[i].hrFrom > new Date().getHours() || restaurants[i].hrTo <= new Date().getHours())
                        Panel.popUp("رستوران مورد نظر بسته است", "orangered", "white");
                    else {
                        window.top.postMessage(JSON.stringify(JSON.stringify(restaurants[i])), "*");
                        Server.openWindow("/foods", "_self");
                    }
                })
                document.getElementById("restaurantBox").appendChild(restaurantCard);
            }
        }
    }
    static displayFoodsForCustomer(foods){
        if (foods.length === 0)
            Panel.popUp("هیچ غذایی برای نمایش وجود ندارد", "red", "white");
        else {
            document.getElementById("restaurantBox").childNodes.forEach(child => child.remove());
            for(let i = 0 ; i < foods.length ; i++){
                let card = (`
                        <div class="infoBox">
                            <h1>خوراک</h1>
                            <h1> ${foods[i].name}</h1>
                        </div>
                        <img alt="لوگو" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Foodlogo.svg/2341px-Foodlogo.svg.png">
                        <div class="infoBox">
                            <span class="address">قیمت:</span>
                            <span class="address"> ${Panel.deliminateNumber(foods[i].price)} ریال</span>
                        </div>
                        <div class="infoBox">
                            <span class="phone">تخفیف:</span>
                            <span class="phone"> ${foods[i].discountPercent} %</span>
                        </div>
                        <div class="button">
                            <button class="addBtn">افزودن به سبد خرید <span class="material-symbols-outlined">add_shopping_cart</span></button>
                        </div>
                `)
                let foodCard = document.createElement("div");
                foodCard.innerHTML = card;
                foodCard.className = "restaurantCard";
                document.getElementById("restaurantBox").appendChild(foodCard);

                document.getElementsByClassName("addBtn").item(i).addEventListener("click", ()=> {
                    window.top.postMessage(JSON.stringify(
                        JSON.stringify({
                            "name":foods[i].name,
                            "price":foods[i].price,
                            "count":1,
                            "discountPercent":foods[i].discountPercent,
                            "totalPayment":String(Number(foods[i].price)*(100-Number(foods[i].discountPercent))/100)
                        })
                    ), "*");
                });
            }
        }
    }
    static displayFoodsForRestaurant(foods){

        if (foods.length === 0)
            Panel.popUp("هیچ غذایی برای نمایش وجود ندارد", "red", "white");
        else {
            while (document.getElementById("restaurantBox").hasChildNodes())
                document.getElementById("restaurantBox").lastChild.remove();
            for(let i = 0 ; i < foods.length ; i++){

                let card = (`
                        <div class="infoBox">
                            <h1>خوراک</h1>
                            <h1> ${foods[i].name}</h1>
                        </div>
                        <img alt="لوگو" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Foodlogo.svg/2341px-Foodlogo.svg.png">
                        <div class="infoBox" style="justify-content: space-between; margin-top: 8px">
                            <span class="address">قیمت:</span>
                            <input onchange="foods[i].price = value" value="${foods[i].price} "/>
                        </div>
                        <div class="infoBox" style="justify-content: space-between; margin-top: 8px">
                            <span class="phone">تخفیف:</span>
                            <input onchange="foods[i].discountPercent = value" value="${foods[i].discountPercent}"/>
                        </div>
                        <div class="button" style="margin-top: 8px">
                            <button id="delete">حذف<span class="material-symbols-outlined">delete</span></button>
                        </div>
                `);

                let foodCard = document.createElement("div");
                foodCard.innerHTML = card;
                foodCard.className = "restaurantCard";
                document.getElementById("restaurantBox").appendChild(foodCard);

                document.getElementById("delete").addEventListener("click", ()=>{
                    foods.splice(i, 1);
                    this.displayFoodsForRestaurant(foods);
                });
            }
        }
        let addToMenu = document.createElement("div");
        addToMenu.className = "restaurantCard";
        addToMenu.id = "addToMenu";
        let h1 = document.createElement("h1");
        h1.innerHTML = "+";
        addToMenu.appendChild(h1);
        document.getElementById("restaurantBox").appendChild(addToMenu);//

        addToMenu.addEventListener("click", ()=>{
            let container = (`
                <div class="closeButtonContainer">
                    <button onclick="document.getElementById('addNewPopUp').remove()">X</button>
                </div>
                <div class="infoContainer" style="width: 100%">
                    <div class="walletItem">
                        <h1>غذا:</h1>
                        <input type="text" id="foodName"/>
                    </div>
                    <div class="walletItem">
                        <h1>قیمت:</h1>
                        <input type="text" id="foodPrice" placeholder="به ریال"/>
                    </div>
                    <div class="walletItem">
                        <h1>درصد تخفیف:</h1>
                        <input type="text" id="foodDiscount" placeholder="بدون اعشار"/>
                    </div>
                    <button id="addNewPopUpBtn" class="button" style="">اضافه کردن +</button>
                </div>
            `)
            let addNewPopUp = document.createElement("div");
            addNewPopUp.id = "addNewPopUp";
            addNewPopUp.className = "popUpContainer";
            addNewPopUp.classList.add("walletContainer");
            addNewPopUp.innerHTML = container;
            document.body.appendChild(addNewPopUp);

            document.getElementById("addNewPopUpBtn").addEventListener("click", ()=>{
                foods.push({
                    "name": document.getElementById("foodName").value,
                    "price": document.getElementById("foodPrice").value,
                    "discountPercent": document.getElementById("foodDiscount").value,
                });
                while (document.getElementById("restaurantBox").hasChildNodes())
                    document.getElementById("restaurantBox").lastChild.remove();
                this.displayFoodsForRestaurant(foods);
            })
        })

    }
}