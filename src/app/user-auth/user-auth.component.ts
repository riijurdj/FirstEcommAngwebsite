import { ProductService } from './../services/product.service';
import { UserService } from './../services/user.service';
import { SignUp, Login, product, cart } from './../data-type';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit{
  showLogin:boolean=true;
  authError:string="";
constructor(private user: UserService, private product: ProductService){}
ngOnInit(): void {
  this.user.userAuthReload();
}
signUp(data:SignUp){
this.user.userSignUp(data);
}
login(data:Login){
this.user.userLogin(data);
this.user.invalidUserAuth.subscribe((result)=>{
if(result){
this.authError="user not found";
}
else{
  this.localCartToRemoteCart()
}
})
}
openSignUp(){
this.showLogin=false;
}
openLogin(){
this.showLogin=true;
}
localCartToRemoteCart(){
let data = localStorage.getItem('localCart');
let user = localStorage.getItem('user');
let userId = user && JSON.parse(user).id;
if(data){
  let cartDataList:product[] = JSON.parse(data);
  cartDataList.forEach((product:product, index)=>{
    let cartData : cart = {
      ...product,
      productId:product.id,
      userId
    };
    delete cartData.id;
    setTimeout(()=>{
      this.product.addToCart(cartData).subscribe((result)=>{
        if(result){
          console.log("item stored in db");
        }
      })
    }, 500);
      if(cartDataList.length===index+1){
        localStorage.removeItem('localcart');
      }

  });
}
this.product.getCartList(userId);
}
}
