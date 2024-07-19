export class Form{
    static getSelectBoxItem(boxId){
        return document.getElementById(boxId).options[document.getElementById(boxId).selectedIndex].text;
    }
    static isValid(...args){
        let valid = true;
        for(let arg of args)
            if (!document.getElementById(arg).value){
                valid = false;
                break;
            }
        return valid;
    }
}