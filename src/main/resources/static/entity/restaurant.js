export class Restaurant{
    userName;
    newUserName;
    passWord;
    newPassWord
    name;
    phone;
    city;
    address;
    managerName;
    managerSurName;
    balance;
    accountNo;
    longitude;
    latitude;
    hrFrom;
    hrTo;
    //lists
    foodMenu;
    attachmentMenu;
    subscription;
    orders;
    supportRequest;

    constructor(userName, newUserName, passWord, newPassWord, name, phone, address, city, managerName, managerSurName,
                balance, foodMenu, attachmentMenu, subscription, orders, supportRequest, accountNo, hrFrom, hrTo) {
        this.userName = userName;
        this.newUserName = newUserName;
        this.passWord = passWord;
        this.newPassWord = newPassWord;
        this.name = name;
        this.phone = phone;
        this.city = city;
        this.address = address;
        this.managerName = managerName;
        this.managerSurName = managerSurName;
        this.balance = balance;
        this.foodMenu = foodMenu;
        this.attachmentMenu = attachmentMenu;
        this.subscription = subscription;
        this.orders = orders;
        this.supportRequest = supportRequest;
        this.accountNo = accountNo;
        this.hrFrom = hrFrom;
        this.hrTo = hrTo;
    }
}