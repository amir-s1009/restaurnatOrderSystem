export class Data{
    static setOnLoad(callBack){
        window.addEventListener("load", ()=>callBack());
    }
    static sendData(obj, targetPage, origin){
        targetPage.postMessage(JSON.stringify(JSON.stringify(obj)), origin);
    }
    static sendText(text, targetPage){
        targetPage.postMessage(text, "*");
    }
    static sendDataToIframe(data, target){
        window.addEventListener("message", (event)=>{
            if (event.data === "iframe")
                this.sendData(data, target);
        })
    }
    static getData(){
        window.addEventListener("message", (event)=>{
            JSON.parse(JSON.parse(event.data));
        })
    }
    static receiveMessageAndSendData(data, targetPage){
        window.addEventListener("message", (event)=>{
            Data.sendData(data, targetPage);
        })
    }
    static receiveTextData(){
        window.addEventListener("message", (event)=>{
            return event.data;
        })
    }
}