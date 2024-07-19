import {Server} from "./server.js";
import {Panel} from "./panel.js";
import {Customer} from "./entity/users.js";
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

    if(Form.isValid("userName", "passWord",
        "repeatPassWord", "name", "surName", "mobile")){

        if(document.getElementById("mobile").value.length < 11)
            Panel.popUp("شماره موبایل غیر مجاز است", "red", "white");
        else if(!gender)
            Panel.popUp("جنسیت را انتخاب نمایید", "red", "white");
        else if(!Form.getSelectBoxItem("city"))
            Panel.popUp("شهر را انتخاب کنید", "red", "white");
        else if(document.getElementById("passWord").value !== document.getElementById("repeatPassWord").value)
            Panel.popUp("رمز عبور و تکرار آن همخوانی ندارد", "red", "white");
        else if(!document.getElementById("agree").checked)
            Panel.popUp("لطفا با قوانین موافقت فرمایید", "orangered", "white");
        else {
            let customer = new Customer(
                document.getElementById("userName").value,
                document.getElementById("passWord").value,
                document.getElementById("name").value,
                document.getElementById("surName").value,
                document.getElementById("mobile").value,
                gender,
                Form.getSelectBoxItem("city"),
                null,
                null,
                "0"
            );
            Server.POST("/customer/createAccount", customer)
                .then(res => res.text())
                .then(msg => Panel.popUp(msg, "green", "white"))
                .catch(err => Panel.popUp("خطا در ارسال اطلاعات", "red", "white"));
        }
    }
    else Panel.popUp("لطفا کادر ها را خالی نگذارید", "red", "white");
})