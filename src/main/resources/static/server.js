export class Server{
    static domain = "localhost:8080";
    static url = "http://".concat(this.domain);
    static getFetchUrl(api){
        return this.url.concat(api)
    }
    static openWindow(api, target){
        return open(this.getFetchUrl(api), target);
    }
    static async AuthorizedGET(api, username, password){
        return await fetch(this.getFetchUrl(api)+`/${username}/${password}`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        });
    }
    static async GET(api){
        return await fetch(this.getFetchUrl(api), {
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        });
    }
    static async POST(api, object){
        return await fetch(this.getFetchUrl(api), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(object)
        });
    }
    static async POST_Path(api, pathVariable, object){
        return await fetch(this.getFetchUrl(api).concat(`/${pathVariable}`), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(object)
        });
    }
    static async PUT(api, object){
        return await fetch(this.getFetchUrl(api), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(object)
        });
    }
}