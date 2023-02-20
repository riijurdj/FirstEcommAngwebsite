import { Router } from '@angular/router';
import { cart, priceSummary } from './../data-type';
import { ProductService } from './../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit{
  cartData:cart[] | undefined;
  priceSummary:priceSummary={
    price: 0,
    discount: 0,
    tax: 0,
    delivery:0,
    total:0
  }
constructor(private product: ProductService, private router:Router){}
ngOnInit(): void {
this.loadDetails();
}
removeToCart(cartId:number|undefined){
  cartId && this.product.removeToCart(cartId).subscribe((result)=>{
    this.loadDetails();
})
}
checkout(){
  this.router.navigate(['/checkout']);
}
loadDetails(){
  this.product.currentCart().subscribe((result)=>{
    this.cartData=result;
    let price=0;
    result.forEach((item)=>{
      if(item.quantity){

        price += (+item.price *+ item.quantity);
      }
    });
  this.priceSummary.price = price;
  this.priceSummary.discount = price/10;
  this.priceSummary.tax = price/5;
  this.priceSummary.delivery = 40;
  this.priceSummary.total = price - (price/10) + 40 + (price/5);
  if(!this.cartData.length){
    this.router.navigate(['/']);
  }
  });
}
}
