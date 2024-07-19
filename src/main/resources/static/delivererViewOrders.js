import {Panel} from "./panel.js";

window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message", (event)=>{
    let ordersList = JSON.parse(JSON.parse(event.data)).orderBox;
    let orders = ordersList.filter(order => order.status === 3);
    if(orders.length === 0)
        Panel.popUp("هیچ سابقه حملی ندارید", "red", "white");
    else {
        let table = document.getElementById("table");
        let headers = ["id","restaurant", "address", "transferPayment"];
        for (let i = 0 ; i < orders.length; i++){
            let tr = document.createElement("tr");
            //
            for(let j = 0 ; j < headers.length ; j++) {
                let td = document.createElement("td");
                if(j === 1)
                    td.innerHTML = orders[i].restaurant.name;
                else if(j === 3)
                    td.innerHTML = Panel.deliminateNumber(orders[i].transferPayment)+" ریال";
                else
                    td.innerHTML = (orders[i])[headers[j]];
                tr.appendChild(td);
            }

            let status = document.createElement("td");
            status.innerHTML = Panel.getStatus(orders[i].status);
            tr.appendChild(status);
            //
            table.appendChild(tr);
        }

    }
})