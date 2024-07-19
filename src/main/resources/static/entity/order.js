export class Order{
    id;
    status;
    address;
    price;
    //lists
    foods;
    attachments;
    customer;
    restaurant;

    constructor(id, status, address, price, foods, attachments, customer, restaurant) {
        this.id = id;
        this.status = status;
        this.address = address;
        this.price = price;
        this.foods = foods;
        this.attachments = attachments;
        this.customer = customer;
        this.restaurant = restaurant;
    }
}