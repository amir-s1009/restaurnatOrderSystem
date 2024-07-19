import {Server} from "./server.js";
import {Panel} from "./panel.js";

let togglePage = false;
document.getElementById("logInBtn").addEventListener("click" , ()=>{
    togglePage = true;
})
document.getElementById("connectToUsBtn").addEventListener("click", ()=>{
    let div = document.createElement("div");
    div.setAttribute("id", "connectToUsBox");

    let closeBtn = document.createElement("button");
    closeBtn.innerHTML = "X";
    closeBtn.addEventListener("click" , ()=>{
        document.getElementById("connectToUsBox").remove();
    })
    div.appendChild(closeBtn);

    let phone = document.createElement("p");
    phone.innerHTML = "شماره تماس: 09375345126"
    div.appendChild(phone);

    let email = document.createElement("p");
    email.innerHTML = "پست الکترونیکی: amir.ranjdoozan@gmail.com"
    div.appendChild(email);

    let telegram = document.createElement("p");
    telegram.innerHTML = "تلگرام: 09375345126"
    div.appendChild(telegram);

    document.getElementById("body").appendChild(div);
})
window.addEventListener("load", ()=>{
    let first = "https://static1.varandaz.com/thumbnail/SAZpqC8X55qM/EANOZiiPICNDXdL45Yrim5v3twFZZiIjVZoP9wCeunleWTrdgTmWkgY28rfMoxko/maxresdefault-3-800x445.jpg";
    let second = "https://files.virgool.io/upload/users/819387/posts/jnsa7hiptwsv/oxwzsczyrrq8.jpeg";

    setInterval(()=> {
        document.getElementById("sliderImage").src = first;
        setTimeout(()=>{
            document.getElementById("sliderImage").src = second;
        }, 5000)
    },10000)
})

document.getElementById("logInBtn").addEventListener("click", ()=>{Server.openWindow("/logIn", "_self")});
function setAds(){
    let h1 = document.getElementById("adContent");

    setInterval(()=>{
        setTimeout(()=>{
            h1.innerHTML = "ثبت نام کن <span class=\"material-symbols-outlined\">\n" +
                "edit\n" +
                "</span>";
        }, 0);
        setTimeout(()=>{
            h1.innerHTML = "بگرد <span class=\"material-symbols-outlined\">\n" +
                "search\n" +
                "</span>";
        }, 1400);
        setTimeout(()=>{
            h1.innerHTML = "سفارش بده <span class=\"material-symbols-outlined\">\n" +
                "add_shopping_cart\n" +
                "</span>";
        }, 2900);
        setTimeout(()=>{
            h1.innerHTML = "&#128523 رستوران آنلاین بوقلمون";
        }, 4300);
    }, 7000)
}
window.addEventListener("load", setAds);

window.addEventListener("load", ()=>{
    Server.GET("/restaurant/all")
        .then(res => res.json())
        .then(restaurants => {
            restaurants.forEach(restaurant => {
                let card = document.createElement("div");
                card.className = "circle";
                //
                let nameBox = document.createElement("div");
                let nameValue = document.createElement("h1");
                nameValue.innerHTML = restaurant.name;
                nameBox.appendChild(nameValue);
                //////
                let img = document.createElement("img");
                img.src = "https://www.mahyashop.com/uploads/UserFiles/Images/Detail-Pics%2F%D8%A8%D9%88%D9%82%D9%84%D9%85%D9%88%D9%86%2FPRODUCT_turkey-03-02-03.png";
                //////
                let cityBox = document.createElement("div");
                let cityValue = document.createElement("span");
                cityValue.innerHTML = restaurant.city;
                cityBox.appendChild(cityValue);
                //////
                let addressBox = document.createElement("div");
                let addressValue = document.createElement("span");
                addressValue.innerHTML = restaurant.address;
                addressBox.appendChild(addressValue);
                //
                card.appendChild(nameBox);
                card.appendChild(img);
                card.appendChild(cityBox);
                card.appendChild(addressBox);
                //
                document.getElementById("topRestaurants").appendChild(card);
            })
        })
        .catch(err => Panel.popUp("خطا در دریافت اطلاعات از سرور", "red", "white"));
})
