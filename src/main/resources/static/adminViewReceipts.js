import {Server} from "./server.js";
import {Panel} from "./panel.js";

let receipts;
let admin;

window.addEventListener("load", ()=> window.top.postMessage("iframe", "*"))
window.addEventListener("message", (event)=>{
    if(event.source.location.pathname.includes("/adminPanel")) {
        admin = JSON.parse(JSON.parse(event.data));
        Server.AuthorizedGET("/admin/receipts", admin.userName, admin.passWord)
            .then(res => res.json())
            .then(list => receipts = list)
            .then(()=>{
                let table = document.createElement("table");
                if(document.getElementById("successful").checked){
                    receipts.filter(receipt => receipt.status === "DONE").forEach(receipt =>{
                        let tr = document.createElement("tr");
                        tr.innerHTML = `
                    <td>${receipt.id}</td>
                    <td>${Panel.deliminateNumber(receipt.amount)+" ریال"}</td>
                    <td>${receipt.accountNo}</td>
                    <td>${new Date(receipt.date).toLocaleString("fa-IR")}</td>
                `;
                        table.appendChild(tr);
                    })
                }
                else if(document.getElementById("unsuccessful").checked){
                    receipts.filter(receipt => receipt.status === "FAILED").forEach(receipt =>{
                        let tr = document.createElement("tr");
                        tr.innerHTML = `
                    <td>${receipt.id}</td>
                    <td>${Panel.deliminateNumber(receipt.amount)+" ریال"}</td>
                    <td>${receipt.accountNo}</td>
                    <td>${new Date(receipt.date).toLocaleString("fa-IR")}</td>
                    <td>
                        <button>واریز دستی</button>
                    </td>
                `;
                        table.appendChild(tr);
                    })
                }
            })
            .catch(err => Panel.popUp("خطا در برقراری ارتباط", "red", "white"));
    }
})