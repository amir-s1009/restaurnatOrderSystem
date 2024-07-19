import {Server} from "./server.js";
import {Panel} from "./panel.js";

let deliverer;

window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message", (event)=>{
    deliverer = JSON.parse(JSON.parse(event.data));
    document.getElementById("name").value = deliverer.name;
    document.getElementById("surName").value = deliverer.surName;
    document.getElementById("userName").value = deliverer.userName;
    document.getElementById("passWord").value = deliverer.passWord;
    document.getElementById("phone").value = deliverer.mobile;
    document.getElementById("gender").value = deliverer.gender;
    document.getElementById("city").value = deliverer.city;
})

document.getElementById("submit").addEventListener("click", ()=>{
    Server.POST("/deliverer/editProfile", {
        "userName":deliverer.userName,
        "passWord":deliverer.passWord,
        "newUserName":document.getElementById("userName").value,
        "newPassWord":document.getElementById("passWord").value,
        "name":deliverer.name,
        "surName":deliverer.surName,
        "mobile":document.getElementById("phone").value,
        "gender":deliverer.gender,
        "birthDate":deliverer.birthDate,
        "city":document.getElementById("city").value
    })
        .then(res => res.text())
        .then(msg => Panel.popUp(msg, "green", "white"))
        .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور", "red", "white"));
})