export class Subscription{
    id;
    name;
    capacity;
    used;
    remaining;
    price;
    constructor(id, name, capacity, used, remaining, price) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.used = used;
        this.remaining = remaining;
        this.price = price;
    }
}