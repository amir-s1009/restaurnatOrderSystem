import {Server} from "./server.js";
import {Panel} from "./panel.js";

let supports;
let admin;

window.addEventListener("load", ()=> window.top.postMessage("iframe", "*"))
window.addEventListener("message", (event)=>{
    if(event.source.location.pathname.includes("/adminPanel")) {
        admin = JSON.parse(JSON.parse(event.data));
        Server.AuthorizedGET("/admin/supports", admin.userName, admin.passWord)
            .then(res => res.json())
            .then(list => supports = list)
            .then(()=>{
                let table = document.getElementById("table");
                supports.forEach((support, index) =>{
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                    <td>${support.id}</td>
                    <td>${support.subject}</td>
                    <td>${support.content}</td>
                    <td>${new Date(support.date).toLocaleDateString("fa-IR")}</td>
                    <td><button class="respond">پاسخگویی</button></td>
                `;
                    table.appendChild(tr);
                    document.getElementsByClassName("respond").item(index).addEventListener("click", ()=>{
                        let div = document.createElement("div");
                        div.id = "responseBox";
                        div.className = "popUpContainer";
                        div.classList.add("walletContainer");
                        div.innerHTML = `
                        <div class="closeButtonContainer">
                            <button onclick="document.getElementById('responseBox').remove()">X</button>
                        </div>
                        <div class="infoContainer">
                            <textarea id="response" placeholder="پاسخ را اینجا بنویسید:" style="width: 100%; resize: vertical; min-height: 150px"></textarea>
                            <button class="button" id="submit">ثبت پاسخ</button>
                        </div>
                    `;
                        document.body.appendChild(div);
                        document.getElementById("submit").addEventListener("click", ()=>{
                            Server.POST("/admin/respondSupport", {
                                "id":support.id,
                                "response":document.getElementById("response").value,
                                "admin":{"userName":admin.userName, "passWord":admin.passWord}
                            })
                                .then(res => res.text())
                                .then(msg => Panel.popUp(msg, "green", "white"));
                        })
                    })
                })
            })
            .catch(err => Panel.popUp("خطا در دریافت اطلاعات از سرور", "red", "white"));
    }
})