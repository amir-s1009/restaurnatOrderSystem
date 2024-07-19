import {Data} from "./data.js";
import {Panel} from "./panel.js";
import {Server} from "./server.js";

let userName;
let restaurant = {};
let foods;
Data.setOnLoad(()=> window.top.postMessage("foodIframe", "*"));

window.addEventListener("message", (event)=>{
    restaurant = JSON.parse(JSON.parse(event.data));
    Panel.displayFoodsForCustomer(restaurant.foodMenu);
})

document.getElementById("back").addEventListener("click", ()=>{
    Server.openWindow("/restaurants", "_self");
})

document.getElementById("search").addEventListener("click", ()=>{
    let foodName = document.getElementById('searchFood').value;
    if(foodName !== ""){
        let filteredFood = restaurant.foodMenu.filter(food => food.name === foodName);
        console.log(filteredFood);
        if (filteredFood.length === 0)
            Panel.popUp("غذا یافت نشد", "red", "white");
        else Panel.displayFoodsForCustomer(filteredFood);
    }
})