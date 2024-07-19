import {Panel} from "./panel.js";

window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message", (event)=>{
    let orders = JSON.parse(JSON.parse(event.data)).orders.reverse();
    if(orders.length === 0)
        Panel.popUp("هیچ سابقه سفارشی ندارید", "red", "white");
    else {
        let table = document.getElementById("table");
        for (let i = 0 ; i < orders.length; i++){
            let row = (`
                            <td>
                                <button class="viewFoodsBtn">مشاهده</button>
                            </td>
                            <td>${orders[i].id}</td>
                            <td>${orders[i].restaurant.name}</td>
                            <td>${orders[i].address}</td>
                            <td>${Panel.deliminateNumber(orders[i].price)} ریال</td>
                            <td>${orders[i].deliverer.name} ${orders[i].deliverer.surName}</td>
                            <td>${orders[i].deliverer.mobile}</td>
                            <td>${Panel.getStatus(orders[i].status)}</td>
                               
                    `)
            let tr = document.createElement("tr");
            tr.innerHTML = row;
            table.appendChild(tr);
            document.getElementsByClassName("viewFoodsBtn").item(i).addEventListener("click", ()=>{
                let container = (`
                            <div class="closeButtonContainer">
                                <button onclick="document.getElementById('customerViewOrderFoods').remove()">X</button>
                            </div>
                            <table>
                                <tr>
                                    <th>نام غذا</th>
                                    <th>تعداد</th>
                                    <th>قیمت واحد</th>
                                    <th>تخفیف %</th>
                                    <th>قیمت کل</th>
                                </tr>
                                ${
                    orders[i].foods.map((food) =>{
                        return(`
                                            <tr>
                                                <td>${food.name}</td>
                                                <td>${food.count} پرس</td>
                                                <td>${Panel.deliminateNumber(food.price)} ریال</td>
                                                <td>${food.discountPercent} %</td>
                                                <td>${Panel.deliminateNumber(food.totalPayment)} ریال</td>
                                            </tr>
                                        `)
                    })
                }
                            </table>
                        `);
                let div = document.createElement("div");
                div.innerHTML = container;
                div.id = "customerViewOrderFoods";
                div.classList.add("popUpContainer");
                div.classList.add("tableView");
                document.body.appendChild(div);
            })
        }

    }
})