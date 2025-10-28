export class Order {

    //Table ID
    id?: number = 0;

    //Customer Data
    customerId: number = 0;
    customerName?: string = "";
    orderId: number = 0;
    phoneNumber: string = "";

    //Product Data
    productId: number = 0;
    productName: string = "";
    imageFile: string = "";
    quantity: number = 0;
    price: string = "0.0";
    uom: string = "";
    address: string = ""; 
    //SKU??

    //status
    status: string ="";

    //transaction Data
    transactionId: number = 0;
    transactionDate: string ="";
    totalAmount: string = "";
   // paymentType: string = ""; //not yet implemented in orderlist/database comment for now
}
