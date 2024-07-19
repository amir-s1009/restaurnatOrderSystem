class Person{
    userName;
    passWord;
    name;
    surName;
    mobile;
    gender;
    city;
    balance;

    constructor(userName, passWord, name, surName, mobile, gender, city, balance) {
        this.userName = userName;
        this.passWord = passWord;
        this.name = name;
        this.surName = surName;
        this.mobile = mobile;
        this.gender = gender;
        this.city = city;
        this.balance = balance;
    }
}
export class Customer extends Person{
    //lists
    orders;
    favoriteRestaurants;

    constructor(userName, passWord, name, surName, mobile, gender, city, orders, favoriteRestaurants, balance) {
        super(userName, passWord, name, surName, mobile, gender, city, balance);
        this.orders = orders;
        this.favoriteRestaurants = favoriteRestaurants;
    }
}
export class Deliverer extends Person{
    accountNo
    status;
    //list
    orderBox;

    constructor(userName, passWord, name, surName, mobile, gender, city, status, orderBox, balance, accountNo) {
        super(userName, passWord, name, surName, mobile, gender, city, balance);
        this.status = status;
        this.orderBox = orderBox;
        this.accountNo = accountNo;
    }

}
export class Admin extends Person{
    constructor(userName, passWord, name, surName, mobile, gender, city) {
        super(userName, passWord, name, surName, mobile, gender, city);
    }
}

