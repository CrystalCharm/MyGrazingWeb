export class OrderItem {

    //Table ID
    id: number = 0;

    //Customer Data
    orderId: number = 0;
    customerId: number = 0;
    customerName?: string = "";

    //Product Data
    productId: number = 0;
    productName: string = "";
    imageFile: string = "";
    quantity: number = 0;
    price: string = "0.0";
    uom: string = "";
  
    //SKU??

    //status
    status: string ="not_selected";

    //For UI
    showConfirm?: boolean; //For UI
}
