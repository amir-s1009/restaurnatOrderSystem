export class Map{
    static apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBmN2NlNmM5NmFhMGJjYmNiMzY4ZDk1NTZiZTE1NzQxYmIyMWE5M2U4ODZmODgwOWQ0MmU3YmI0N2JiODFmNDJkZmNjM2JmNmEyMjAwNjI4In0.eyJhdWQiOiIyMzQxOCIsImp0aSI6IjBmN2NlNmM5NmFhMGJjYmNiMzY4ZDk1NTZiZTE1NzQxYmIyMWE5M2U4ODZmODgwOWQ0MmU3YmI0N2JiODFmNDJkZmNjM2JmNmEyMjAwNjI4IiwiaWF0IjoxNjkwNjUyMzE4LCJuYmYiOjE2OTA2NTIzMTgsImV4cCI6MTY5MzI0NDMxOCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.JGg-KWwpKCrW3bp80NNQYewjDs9sA7ppmBaFm0uVQvm2QWFi4BPU35bbjpE7eaCrGGJGydeamgV5uYpc0KGZkUtTzG9nm67azuEQrPpf6zlG0aTbbOfxkmqycCT2ByD8DFVSvpTADsaCPkZVUDi-vFFWFI8w3Antb1rRyw0vNWAk5ZWxsfoG6VqBsQo2QSHM7ykP9Rb71VUbTdYfaLYEafPu4Qc6jWxeiv82eOmfVjcXg7dNDx2EtZjqdk6ABOoRTrx-TeEBTSsbYIBxmHJPnNjFqAfTuwEr3MCoBWkDur1kzv2HG6hzilr0YZdwJ57IWQesdzyktThyf37TJo73EQ";
    static tabrizGeo = {
        lat : 38.0792,
        lng : 46.2887
    }
    static showMap(lat, lng, zoom, targetSelector){
        var app = new Mapp({
            element: targetSelector,
            presets: {
                latlng: {
                    lat: lat,
                    lng: lng
                },
                zoom: zoom
            },
            apiKey: this.apiKey
        });
        app.addLayers();
        app.addZoomControls();
        app.addGeolocation();
        return app;
    }

    static showDirections(lat, lng, originLat, originLng, destLat, destLng, zoom, targetSelector){
        let myLocation = {
            lat,lng
        }
        var app = new Mapp({
            element: targetSelector,
            presets: {
                latlng: {
                    lat: lat,
                    lng: lng
                },
                zoom: zoom
            },
            apiKey: this.apiKey
        });
        app.addLayers();
        app.addZoomControls();
        app.addGeolocation({
            history: true,
            onLoad: true,
            onLoadCallback: function(){
                myLocation.lat = app.states.user.latlng.lat;
                myLocation.lng = app.states.user.latlng.lng;
            },
        });
        app.drawRoute({
            start: [myLocation.lat, myLocation.lng],
            end: [Number(destLat), Number(destLng)],
            mode: 'car',
            draggable: true,
            fit: true,
        });
    }
}