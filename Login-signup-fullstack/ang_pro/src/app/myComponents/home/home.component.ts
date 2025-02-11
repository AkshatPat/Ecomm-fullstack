import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  subTotal: number = 0;
  cartProducts: any[] = [];
  productList: any[] = [];

  baseUrl = "http://localhost:3000/";
  constructor(private productServ: ProductService, private router: Router){ }

  ngOnInit(): void {
    this.loadCart();
    this.loadAllProducts();
  }

  loadCart(){
    const userId =  localStorage.getItem('userId');
    this.subTotal = 0;
    this.productServ.getCartItemsByProductId(userId).subscribe((res: any)=>{
      this.cartProducts = res.data;
      console.log("this is cart product",this.cartProducts);
      this.productServ.cartAddedSubject.next(true);
      
      this.cartProducts.forEach(element => {
        this.subTotal = this.subTotal + element.productPrice;
        // this.subTotal += element.productPrice * element.quantity;
        
      });
    })
  }

  // updateQuantity(product: any) {
  //   if (product.quantity < 1) {
  //     product.quantity = 1;  
  //   }
  //   this.productServ.updateCartQuantity(product).subscribe((res: any) => {
  //     this.loadCart(); 
  //   });
  // }

  redirectToSale() {
    this.router.navigate(['/sale']);
  }

  logout(e: any){
    e.preventDefault();
    this.router.navigate(['/login']);
    localStorage.clear();
  }

  loadAllProducts(){
    this.productServ.getAllProducts().subscribe((result: any)=>{
      this.productList = result.data;
      console.log(this.productList, "product list");
      
    })
  }

  addItemToCart(productId: number, price: any) {
    const userId =  localStorage.getItem('userId');
    console.log("item added to cart");

    const existingProduct = this.cartProducts.find(item => item.productId === productId);
    
    if (existingProduct) {
      // If the product is already in the cart, increase the quantity
      existingProduct.quantity += 1;
      this.productServ.updateCartQuantity(existingProduct).subscribe((res: any) => {
        if (res.status) {
          alert("Product quantity updated in cart");
          this.productServ.cartAddedSubject.next(true);
          this.loadCart();
        }
      });
    } else {
    let cartObj = {
      custId: userId,
      productId: productId,
      productPrice: price,
      quantity: 1
    }

    this.productServ.addToCart(cartObj).subscribe((res: any) => {
      
      if (res.status) {
        alert("Product Added to cart");
        this.productServ.cartAddedSubject.next(true);
        this.loadCart() 
      } 
    });
  }
  }

  

  
}
