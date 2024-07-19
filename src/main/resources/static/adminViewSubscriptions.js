import {Server} from "./server.js";
import {Panel} from "./panel.js";

let subscriptions;
let admin;

window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message", (event)=>{
    if(event.source.location.pathname.includes("/adminPanel")){
        admin = JSON.parse(JSON.parse(event.data));
        Server.AuthorizedGET("/admin/subscriptions", admin.userName, admin.passWord)
            .then(res => res.json())
            .then(list => subscriptions = list)
            .then(()=>{
                subscriptions.forEach(sub => {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                    <td>${sub.title}</td>
                    <td>${sub.capacity}</td>
                    <td>${sub.amount}</td>
                    <td>
                        <button class="delete">حذف</button>
                    </td>
                `;
                    document.getElementById("table").appendChild(tr);
                });

                for(let i = 0 ; i < subscriptions.length; i++)
                    document.getElementsByClassName("delete").item(i).addEventListener("click", ()=>{
                        Server.AuthorizedGET("/admin/deleteSub", admin.userName, admin.passWord)
                            .then(res => res.text())
                            .then(msg => Panel.popUp(msg, "green", "white"))
                            .catch(err => Panel.popUp("خطا در ارتباط با سرور", "red", "white"));
                    })
            })
            .catch(err => Panel.popUp("خطا در دریافت اطلاعات از سرور", "red", "white"));
    }
})

document.getElementById("add").addEventListener("click", ()=>{
    let div = document.createElement("div");
    div.id = "newSubCont";
    div.className = "walletContainer";
    div.innerHTML = `
        <div>
            <button onclick="document.getElementById('newSubCont').remove()">X</button>
        </div>
        <div>
            <input type="text" placeholder="عنوان:" id="title">
            <input type="text" placeholder="ظرفیت:" id="capacity">
            <input type="text" placeholder="مبلغ:" id="amount">
            <button class="button" id="submit">ثبت</button>
        </div>
    `;
    document.body.appendChild(div);
    document.getElementById("submit").addEventListener("click", ()=>{
        Server.POST("/admin/addSub", {
            "title":document.getElementById("title").value,
            "capacity":Number(document.getElementById("capacity").value),
            "amount":document.getElementById("amount").value,
        })
            .then(res => res.text())
            .then(msg => Panel.popUp(msg , "green", "white"))
            .catch(err => Panel.popUp("خطا در برقراری ارتباط با سرور", "red", "white"));
    })
})