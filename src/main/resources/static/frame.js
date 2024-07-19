class Frame {
    open(){};

    createCloseButton(componentId){
        let div = document.createElement("div");
        div.className = "closeButtonContainer";
        let closeBtn = document.createElement("button");
        closeBtn.className = "closeButton";
        closeBtn.innerHTML = "X";
        closeBtn.addEventListener("click", ()=>{document.getElementById(componentId).remove()});
        div.appendChild(closeBtn);

        return div;
    };
}

export class TableFrame extends Frame {
    div;
    table;
    className;
    id;
    constructor(className, id) {
        super();
        this.className = className;
        this.id = id;
    }
    createTable(){
        this.div = document.createElement("div");
        this.div.id = this.id;
        this.div.className = this.className;
        let tableContainer = document.createElement("div");
        tableContainer.id = "tableBox";
        this.table = document.createElement("table");
        this.table.id = "table";
        tableContainer.appendChild(this.table);

        this.div.appendChild(super.createCloseButton(this.id));
        this.div.appendChild(tableContainer);
    }
    setTr(tr){
        this.table.appendChild(tr);
    }
    initialize(headers, keys, data){
        this.createTable();
        let headTr = document.createElement("tr");
        headers.forEach(header => {
            let headTh = document.createElement("th");
            headTh.innerHTML = header;
            headTr.appendChild(headTh);
        })
        this.setTr(headTr);
        data.forEach(data => {
            let row = document.createElement("tr");
            keys.forEach(key => {
                let td = document.createElement("td");
                td.innerHTML = data[key];
                row.appendChild(td);
            })
            this.setTr(row);
        })
    }
    initializeInputTable(headers, keys){
        this.createTable();
        let headTr = document.createElement("tr");
        headers.forEach(header => {
            let headTh = document.createElement("th");
            headTh.innerHTML = header;
            headTr.appendChild(headTh);
        })
        this.setTr(headTr);
        let row = document.createElement("tr");
        keys.forEach((key,index) => {
            let td = document.createElement("td");
            let input = document.createElement("input");
            input.type = "text";
            input.textAlign = "center";
            td.appendChild(input);
            row.appendChild(td);
        })
        this.setTr(row);
    }
    open() {
        document.body.appendChild(this.div);
    }
}

export class OrdinaryBox extends Frame{
    div;
    className;
    id;
    constructor(className, id) {
        super();
        this.className = className;
        this.id = id;
    }

    initialize(){
        this.div = document.createElement("div");
        this.div.className = this.className;
        this.div.id = this.id;
        this.div.appendChild(super.createCloseButton(this.id));
    }
    addComponent(component, className, id){
        component.className = className;
        component.id = id;
        this.div.appendChild(component);
    }
    open(){
        document.body.appendChild(this.div);
    }
}