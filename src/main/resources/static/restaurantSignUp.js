import {Form} from "./form.js";
import {Restaurant} from "./entity/restaurant.js";
import {Server} from "./server.js";
import {Panel} from "./panel.js";
import {OrdinaryBox} from "./frame.js";
import {Map} from "./map.js";

let lat;
let lng;

document.getElementById("submit").addEventListener("click", ()=>{
    if(Form.isValid("userName", "passWord", "repeatPassWord", "name", "phone",
        "address", "managerName", "managerSurName", "accountNo")){

        if(document.getElementById("passWord").value !== document.getElementById("repeatPassWord").value)
            Panel.popUp("رمز عبور و تکرار آن همخوانی ندارد", "red", "white");
        else if(document.getElementById("accountNo").value.length < 24)
            Panel.popUp("شماره شبا غیر مجاز است", "red", "white");
        else if(document.getElementById("phone").value.length < 11)
            Panel.popUp("شماره تلفن غیر مجاز است", "red", "white");
        else if(!Form.getSelectBoxItem("city"))
            Panel.popUp("شهر را انتخاب کنید", "red", "white");
        else if(!(Form.getSelectBoxItem("hrFrom") && Form.getSelectBoxItem("hrTo")))
            Panel.popUp("لطفا ساعت کاری را وارد کنید", "red", "white");
        else if(!(lng && lat))
            Panel.popUp("لطفا موقعیت رستوران را تعیین کنید", "red", "white");
        else if(!document.getElementById("agree").checked)
            Panel.popUp("لطفا با قوانین موافقت فرمایید", "orangered", "white");
        else {
            let restaurant = new Restaurant(
                document.getElementById("userName").value,
                null,
                document.getElementById("passWord").value,
                null,
                document.getElementById("name").value,
                document.getElementById("phone").value,
                document.getElementById("address").value,
                Form.getSelectBoxItem("city"),
                document.getElementById("managerName").value,
                document.getElementById("managerSurName").value,
                "0",
                null,
                null,
                null,
                null,
                null,
                document.getElementById("accountNo").value,
                Number(Form.getSelectBoxItem("hrFrom")),
                Number(Form.getSelectBoxItem("hrTo"))
            );
            restaurant.longitude = lng;
            restaurant.latitude = lat;
            Server.POST("/restaurant/createProfile", restaurant)
                .then(res => res.text())
                .then(msg => Panel.popUp(msg, "green", "white"))
                .catch(err => Panel.popUp("خطا در ارسال اطلاعات به سرور", "red", "white"));
        }
        }

    else Panel.popUp("لطفا کادر هارا خالی نگذارید", "red", "white");
})

document.getElementById("viewMap").addEventListener("click", ()=>{
    let wrapper = document.createElement("div");
    wrapper.className = "popUpContainer"
    wrapper.id = "mapWrapper";
    let mapFrame = document.createElement("div");
    mapFrame.id = "mapFrame";
    wrapper.appendChild(mapFrame);
    document.body.appendChild(wrapper);
    Panel.popUp("لطفا موقعیتتان را کلیک فرمایید", "green", "white");
    let app = Map.showMap(
        Map.tabrizGeo.lat,
        Map.tabrizGeo.lng,
        14,
        "#mapFrame"
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
        document.getElementById("mapWrapper").remove();
    });
})