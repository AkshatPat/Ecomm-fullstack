import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public cartAddedSubject = new Subject<boolean>()

  constructor(private http: HttpClient) { }

  getAllProducts():Observable<any[]>{
    return this.http.get<any[]>("http://localhost:3000/api/product-list");
  }

  addToCart(productData: any): Observable<any> {
   
        
    return this.http.post<any>("http://localhost:3000/api/cart-product", productData);
  }

  getCartItemsByProductId(custId: any){
    return this.http.get<any>(`http://localhost:3000/api/cart-items?custId=${custId}`)
  }

  removeCartItemById(id: number): Observable<any> {
    return this.http.get<any[]>(`http://localhost:3000/api/remove-item/${id}`);
  }

  updateCartQuantity(productQuantity: any): Observable<any> {
    return this.http.post<any>("http://localhost:3000/api/cart-product-quantity", productQuantity)
  }

  // makeSale(obj: any): Observable<any>{
  //   return this.http.post<any>("https://onlinetestapi.gerasim.in/api/Ecomm/AddNewSale", obj);
  // }

  // updateCartQuantity(product: any): Observable<any> {
  //   const obj = {
  //     productId: product.productId,
  //     customerId: product.customerId,
  //     quantity: product.quantity
  //   };
  //   return this.http.post("https://onlinetestapi.gerasim.in/api/Ecomm/", obj);
  // }
  
}
