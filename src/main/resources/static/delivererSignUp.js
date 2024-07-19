import {Server} from "./server.js";
import {Panel} from "./panel.js";
import {Deliverer} from "./entity/users.js";
import {Form} from "./form.js";

document.getElementById("submit").addEventListener("click", ()=>{
    let gender;

    let options = document.getElementsByName("gender");
    if(options[0].checked)
        gender = "مدکر";
    else if(options[1].checked)
        gender = "مونث";
    else if(options[2].checked)
        gender = "سایر";

    if(Form.isValid("userName", "passWord", "repeatPassWord",
        "name", "surName", "mobile", "accountNo")){

        if(document.getElementById("passWord").value !== document.getElementById("repeatPassWord").value)
            Panel.popUp("رمز عبور و تکرار آن همخوانی ندارد", "red", "white");
        else if(document.getElementById("accountNo").value.length < 24)
            Panel.popUp("شماره شبا غیر مجاز است", "red", "white");
        else if(document.getElementById("mobile").value.length < 11)
            Panel.popUp("شماره موبایل غیر مجاز است", "red", "white");
        else if (!Form.getSelectBoxItem("city"))
            Panel.popUp("شهر را انتخاب کنید", "red", "white");
        else if(!gender)
            Panel.popUp("لطفا جنسیت را انتخاب نمایید", "red", "white");
        else if(!document.getElementById("agree").checked)
            Panel.popUp("لطفا با قوانین موافقت فرمایید", "orangered", "white");
        else{
            let deliverer = new Deliverer(
                document.getElementById("userName").value,
                document.getElementById("passWord").value,
                document.getElementById("name").value,
                document.getElementById("surName").value,
                document.getElementById("mobile").value,
                gender,
                Form.getSelectBoxItem("city"),
                0,
                null,
                "0",
                document.getElementById("accountNo").value
            );
            Server.POST("/deliverer/createAccount", deliverer)
                .then(res => res.text())
                .then(msg => Panel.popUp(msg, "green", "white"))
                .catch(err => Panel.popUp("خطا در ارسال اطلاعات", "red", "white"));
        }
    }
    else Panel.popUp("لطفا کادر هارا خالی نگذارید", "red", "white");
})