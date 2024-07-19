import {Server} from "./server.js";
import {Panel} from "./panel.js";

let customer;

window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message", (event)=>{
    customer = JSON.parse(JSON.parse(event.data));
    document.getElementById("name").value = customer.name;
    document.getElementById("surName").value = customer.surName;
    document.getElementById("userName").value = customer.userName;
    document.getElementById("passWord").value = customer.passWord;
    document.getElementById("phone").value = customer.mobile;
    document.getElementById("gender").value = customer.gender;
    document.getElementById("city").value = customer.city;
})

document.getElementById("submit").addEventListener("click", ()=>{
    let status;
    Server.POST("/customer/editProfile", {
        "userName":customer.userName,
        "passWord":customer.passWord,
        "newUserName":document.getElementById("userName").value,
        "newPassWord":document.getElementById("passWord").value,
        "name":customer.name,
        "surName":customer.surName,
        "mobile":document.getElementById("phone").value,
        "gender":customer.gender,
        "city":document.getElementById("city").value
    })
        .then(res => {
            status = res.status;
            res.text()
            .then(msg => Panel.popUp(msg, "green", "white"))
                .then(()=> {
                    if(status === 200)
                        window.top.postMessage("logOut", "*")
                })
                .catch(err => {})
        })
        .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور", "red", "white"));
})