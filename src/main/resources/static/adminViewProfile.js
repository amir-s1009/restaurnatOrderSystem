import {Server} from "./server.js";
import {Panel} from "./panel.js";

let admin;

window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message", (event)=>{
    admin = JSON.parse(JSON.parse(event.data));
    document.getElementById("name").value = admin.name;
    document.getElementById("surName").value = admin.surName;
    document.getElementById("userName").value = admin.userName;
    document.getElementById("passWord").value = admin.passWord;
    document.getElementById("phone").value = admin.mobile;
    document.getElementById("gender").value = admin.gender;
    document.getElementById("city").value = admin.city;
})

document.getElementById("submit").addEventListener("click", ()=>{
    Server.POST("/admin/editProfile", {
        "userName":admin.userName,
        "passWord":admin.passWord,
        "newUserName":admin.getElementById("userName").value,
        "newPassWord":admin.getElementById("passWord").value,
        "name":admin.name,
        "surName":admin.surName,
        "mobile":document.getElementById("phone").value,
        "gender":admin.gender,
        "birthDate":admin.birthDate,
        "city":document.getElementById("city").value
    })
        .then(res => res.text())
        .then(msg => Panel.popUp(msg, "green", "white"))
        .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور", "red", "white"));
})