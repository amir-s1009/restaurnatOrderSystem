import {Server} from "./server.js";
import {Panel} from "./panel.js";

let restaurant;
window.addEventListener("load", ()=>{window.top.postMessage("iframe","*")});
window.addEventListener("message", (event)=>{
    restaurant = JSON.parse(JSON.parse(event.data));
})

function isValid(){
    return document.getElementById("subject").value !== "" && document.getElementById("description").value !== "";
}

document.getElementById("submit").addEventListener("click", ()=>{
    if (isValid()){
        Server.POST("/restaurant/requestForSupport", {
            "subject":document.getElementById("subject").value,
            "content":document.getElementById("description").value,
            "restaurant": {"userName":restaurant.userName, "passWord":restaurant.passWord}
        })
            .then(res => res.text())
            .then(msg => Panel.popUp(msg,"green","white"))
            .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور", "red","white"));
    }
    else Panel.popUp("لطفا باکس هارا تکمیل فرمایید", "red", "white");
})

document.getElementById("viewResponse").addEventListener("click" , ()=>{
    let div = document.createElement("div");
    div.id = "restaurantViewResponse";
    div.className = "popUpContainer";
    div.innerHTML = (`
        <div class="closeButtonContainer">
            <button onclick="document.getElementById('restaurantViewResponse').remove()">X</button>
        </div>
        ${
            restaurant.supportRequest.map((support)=>{
                return(`
                    <div class="infoContainer" style="border-bottom: 2px solid saddlebrown">
                        <div class="infoBox">
                            <span class="infoLabel">شماره درخواست:</span>
                            <span class="infoValue"> ${support.id}</span>
                        </div>
                        <div class="infoBox">
                            <span class="infoLabel">موضوع درخواست:</span>
                            <span class="infoValue"> ${support.subject}</span>
                        </div>
                        <div class="infoBox">
                            <span class="infoLabel">متن درخواست:</span>
                            <span class="infoValue"> ${support.content}</span>
                        </div>
                        <div class="infoBox">
                            <span class="infoLabel">پاسخ:</span>
                            <span class="infoValue"> ${support.status?support.response:"پاسخ داده نشده"}</span>
                        </div>
                    </div>
                `)
            })
        }
    `)
    document.body.appendChild(div);
})