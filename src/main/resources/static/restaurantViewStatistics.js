import {Panel} from "./panel.js";

let orders = [];

window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("message", (event)=>{
    orders = JSON.parse(JSON.parse(event.data)).orders;
    if(orders.length === 0)
        Panel.popUp("هیچ سابقه سفارشی ندارید", "red", "white");
    else {
        let table = document.getElementById("table");
        for (let i = 0 ; i < orders.length; i++){
            let tr = document.createElement("tr");
            tr.innerHTML = (`
                <td>
                    <button class="viewFoodsBtn">مشاهده</button>
                </td>
                <td>${orders[i].address}</td>
                <td>${orders[i].id}</td>
                <td>${Panel.deliminateNumber(orders[i].price)} ریال</td>
                <td>${orders[i].deliverer.name} ${orders[i].deliverer.surName}</td>
                <td>${orders[i].deliverer.mobile}</td>
                <td>${Panel.getStatus(orders[i].status)}</td>
            `);
            table.appendChild(tr);
            document.getElementsByClassName("viewFoodsBtn").item(i).addEventListener("click", ()=> {
                let div = document.createElement('div');
                div.className = 'popUpContainer';
                div.classList.add('tableView');
                div.id = 'viewOrderFoods';
                div.innerHTML = (`
                    <div class='closeButtonContainer'>
                        <button onclick="document.getElementById('viewOrderFoods').remove()">X</button>
                    </div>
                    <table>
                        <tr>
                            <th>غذا</th>
                            <th>قیمت واحد</th>
                            <th>تخفیف%</th>
                            <th>تعداد</th>
                            <th>قیمت کل</th>
                        </tr>
                        ${
                    orders[i].foods.map((food) => {
                        return (`
                                    <tr>
                                        <td>${food.name}</td>
                                        <td>${Panel.deliminateNumber(food.price)} ریال</td>
                                        <td>${food.discountPercent} %</td>
                                        <td>${food.count} پرس</td>
                                        <td>${Panel.deliminateNumber(food.totalPayment)} ریال</td>
                                    </tr>
                                  `)
                    })
                }
                    </table>
                `)
                document.body.appendChild(div);
            });
        }
    }
})







