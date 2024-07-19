import {Server} from "./server.js";
import {Panel} from "./panel.js";
import {Map} from "./map.js";
import {Form} from "./form.js";

let restaurant;

let lat;
let lng;

window.addEventListener("load", ()=>{
    window.top.postMessage("iframe", "*");
})
window.addEventListener("load", ()=>{
    let app = Map.showMap(
        Map.tabrizGeo.lat,
        Map.tabrizGeo.lng,
        14,
        "#map"
    )
// Add in a crosshair for the map
    var crosshairIcon = L.icon({
        iconUrl: 'https://cloud.son.ir/index.php/s/qVUHj7HJSr1A7MK/download',
        iconSize:     [20, 20], // size of the icon
        iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    });
    var crosshairMarker = new L.marker(app.map.getCenter(), {icon: crosshairIcon, clickable:false});
    crosshairMarker.addTo(app.map);

// Move the crosshair to the center of the map when the user pans
    app.map.on('move', function(e) {
        crosshairMarker.setLatLng(app.map.getCenter());
    });

    crosshairMarker.on('click', function(event){
        lat = event.latlng.lat;
        lng = event.latlng.lng;
        Panel.popUp("موقعیت شما ثبت شد", "green", "white");
    });
})
window.addEventListener("message", (event)=>{
    restaurant = JSON.parse(JSON.parse(event.data));
    lat = restaurant.latitude;
    lng = restaurant.longitude;
    document.getElementById("name").value = restaurant.name;
    document.getElementById("userName").value = restaurant.userName;
    document.getElementById("passWord").value = restaurant.passWord;
    document.getElementById("phone").value = restaurant.phone;
    document.getElementById("address").value = restaurant.address;
    document.getElementById("city").value = restaurant.city;
    document.getElementById("managerName").value = restaurant.managerName;
    document.getElementById("managerSurName").value = restaurant.managerSurName;
    document.getElementById("accountNo").value = restaurant.accountNo
})

document.getElementById("submit").addEventListener("click", ()=>{
    Server.POST("/restaurant/editProfile", {
        "userName":restaurant.userName,
        "passWord":restaurant.passWord,
        "newUserName":document.getElementById("userName").value,
        "newPassWord":document.getElementById("passWord").value,
        "name":document.getElementById("name").value,
        "phone":document.getElementById("phone").value,
        "address":document.getElementById("address").value,
        "managerName":document.getElementById("managerName").value,
        "managerSurName":document.getElementById("managerSurName").value,
        "city":restaurant.city,
        "latitude":lat,
        "longitude":lng,
        "accountNo":document.getElementById("accountNo").value,
        "hrFrom":Number(Form.getSelectBoxItem("hrFrom")),
        "hrTo":Number(Form.getSelectBoxItem("hrTo")),
    })
        .then(res => res.text())
        .then(msg => Panel.popUp(msg, "green", "white"))
        .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور", "red", "white"));
})

