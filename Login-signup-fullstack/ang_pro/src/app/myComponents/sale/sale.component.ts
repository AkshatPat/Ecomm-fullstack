import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit{

  baseUrl = "http://localhost:3000/";
  cartProducts: any[] = [];
  subTotal: number = 0;
  saleObj: any = {
    "SaleId": 0,
    "CustId": 0,
    "SaleDate": new Date(),
    "TotalInvoiceAmount": 0,
    "Discount": 0,
    "PaymentNaration": "Paytm",
    "DeliveryAddress1": "plot no. 112",
    "DeliveryAddress2": "near sbi atm",
    "DeliveryCity": "pune",
    "DeliveryPinCode": "454545",
    "DeliveryLandMark": "ATM"
  }

  constructor(private productServ: ProductService, private router: Router){ }

  ngOnInit(): void {
    this.loadCart()
  }

  // updateQuantity(product: any) {
  //   if (product.quantity < 1) {
  //     product.quantity = 1;  
  //   }
  //   this.productServ.updateCartQuantity(product).subscribe((res: any) => {
  //     this.loadCart(); 
  //   });
  // }

  logout(e: any){
    e.preventDefault();
    this.router.navigate(['/login']);
    localStorage.clear();

  }

  loadCart(){
    this.subTotal = 0;
    const userId =  localStorage.getItem('userId');
    this.productServ.getCartItemsByProductId(userId).subscribe((res: any)=>{
      this.cartProducts = res.data;
      this.cartProducts.forEach(element => {
        this.subTotal = this.subTotal + element.productPrice;
        
      });
    })
  }

  removeItem(cart: any) {
    // const userId =  localStorage.getItem('userId');

    this.productServ.removeCartItemById(cart.productId).subscribe((res: any)=>{
      if(res.status) {
        this.productServ.cartAddedSubject.next(true);
        this.loadCart();
      }
    })
  }
  
  // makeSale() {
  //   this.saleObj.TotalInvoiceAmount = this.subTotal;
  //   this.productServ.cartAddedSubject.next(true);
  //   this.productServ.makeSale(this.saleObj).subscribe((res: any)=>{
  //     if(res.result) {
  //       this.loadCart();
  //       this.productServ.cartAddedSubject.next(true);
  //       alert("Sale success");
  //     }
  //   })
  // }
}
