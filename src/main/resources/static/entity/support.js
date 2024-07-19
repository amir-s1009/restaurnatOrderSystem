export class Support{
    id;
    status;
    subject;
    content;
    response;
    date;
    //list
    restaurant;

    constructor(id, status, subject, content, response, date, restaurant) {
        this.id = id;
        this.status = status;
        this.subject = subject;
        this.content = content;
        this.response = response;
        this.date = date;
        this.restaurant = restaurant;
    }
}