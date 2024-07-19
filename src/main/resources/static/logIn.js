import {Server} from "./server.js";
import {Panel} from "./panel.js";
import {Data} from "./data.js";

window.addEventListener("message", ()=>{
    Data.sendData({
        "userName": document.getElementById("userName").value,
        "passWord": document.getElementById("passWord").value
    }, target, Server.url)
});

let target;
document.getElementById("logInBtn").addEventListener("mouseover", ()=>{
    let userName = document.getElementById("userName").value;
    let passWord = document.getElementById("passWord").value;

    if(userName === "" || passWord === ""){
        document.getElementById("logInBtn").style.backgroundColor = "red";
    }
    else {
        document.getElementById("logInBtn").style.backgroundColor = "rgb(1, 105, 1)";
    }
})
document.getElementById("logInBtn").addEventListener("mouseleave", ()=>{
    document.getElementById("logInBtn").style.backgroundColor = "rgba(0, 138, 0, 0)";
})

function getTargetPanelApi(){
    let radios = document.getElementsByName("type");
    let api = "";
    radios.forEach((radio)=>{
        if(radio.checked)
            api = "/".concat(radio.id).concat("Panel");
    })
    return api;
}
function getTargetLoginApi(){
    let radios = document.getElementsByName("type");
    let api = "";
    radios.forEach((radio)=>{
        if(radio.checked)
            api = "/".concat(radio.id).concat("/logIn");
    })
    return api;
}
function authorized(){
    let userName = document.getElementById("userName").value;
    let passWord = document.getElementById("passWord").value;
    return !(userName === "" || passWord === "");
}
document.getElementById("logInBtn").addEventListener("click", ()=>{
    if(!authorized())
        Panel.popUp("نام کاربری یا رمز عبور نمیتواند خالی باشد", "orangered", "white");
    else if(getTargetPanelApi() === "")
        Panel.popUp("لطفا نوع کاربری را جهت ورود انتخاب نمایید", "orangered", "white");
    else {
        let status;
        Server.POST(getTargetLoginApi(),
            {
                "userName": document.getElementById("userName").value,
                "passWord": document.getElementById("passWord").value
            }
        )
            .then(res => {
                status = res.status;
                res.text().then(msg => {
                    if (status === 200) {
                        target = Server.openWindow(getTargetPanelApi().concat(
                            `-${document.getElementById("userName").value}-${document.getElementById("passWord").value}`,
                        ),"_blank");
                    }
                    else Panel.popUp(msg, "red", "white");
                })
                    .catch(err => Panel.popUp(err, "red", "white"));
            })
    }
});
document.getElementById("customerSignUpBtn").addEventListener("click", ()=>{Server.openWindow("/customerSignUp", "_self")});
document.getElementById("restaurantSignUpBtn").addEventListener("click", ()=>{Server.openWindow("/restaurantSignUp", "_self")});
document.getElementById("delivererSignUpBtn").addEventListener("click", ()=>{Server.openWindow("/delivererSignUp", "_self")});

// Data.receiveMessageAndSendData({
//     "userName": document.getElementById("userName").value,
//     "passWord": document.getElementById("passWord").value
// }, target);
