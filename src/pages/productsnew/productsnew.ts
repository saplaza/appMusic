import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Service} from '../../providers/service/service';
import { ProductPage } from '../product/product';
import { Values } from '../../providers/service/values';

/**
 * Generated class for the ProductsnewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-productsnew',
  templateUrl: 'productsnew.html',
})
export class ProductsnewPage {

  constructor(public nav: NavController, public navParams: NavParams, public service: Service, public values: Values) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsnewPage');
  }
  hideLoading(){
	   this.loading = false;
  }
  getProduct(item) {
    this.nav.push(ProductPage, item);
  }
  doInfinite(infiniteScroll) {
        this.service.loadMore().then((results) => {infiniteScroll.complete()});
    }
  addToWishlist(id) {
        if (this.values.isLoggedIn) {
            this.values.wishlistId[id] = true;
            this.service.addToWishlist(id).then((results) => this.update(results, id));
        } else {
            this.presentToastLoginAlert();
        }
    }
   update(results, id) {
        if (results.success == "Success") {
            this.values.wishlistId[id] = true;
        } else {}
    }
    removeFromWishlist(id) {
        this.values.wishlistId[id] = false;
        this.service.deleteItem(id).then((results) => this.updateWish(results, id));
    }
    updateWish(results, id) {
        if (results.status == "success") {
            this.values.wishlistId[id] = false;
        }
    }

}
