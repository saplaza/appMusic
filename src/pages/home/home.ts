import {Component} from '@angular/core';
import {NavController, ToastController } from 'ionic-angular';
import {Service} from '../../providers/service/service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';
import { ProductsPage } from '../products/products';
import { ProductsnewPage } from '../productsnew/productsnew';
import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { ProductPage } from '../product/product';
import { Post } from '../post/post';
import { EN_TAB_PAGES } from "../../app/config";
import { BackbuttonService } from '../../providers/service/backbutton';
import { MusicPage } from '../music/music';
import { BiografiaPage } from '../biografia/biografia';
import { EventsPage } from '../events/events';
import { RadioPage } from '../radio/radio';
import { PhotosPage } from '../photos/photos';

@Component({
    templateUrl: 'home.html'
})
export class Home {

    items: any;
    loading: boolean = true;
    tabBarElement: any;
    constructor(public toastCtrl: ToastController, public nav: NavController, public service: Service, public values: Values, public functions: Functions, private backbuttonService: BackbuttonService) {
        this.items = [];
        if(document.querySelector(".tabbar"))
        this.tabBarElement = document.querySelector(".tabbar")['style'];
    }
    doRefresh(refresher){
        this.service.load().then((results) => {
            this.handleService(results);
            refresher.complete();
        });
    }
    handleService(results){
       // 
    }
    getCategory(id, slug, name) {
        this.items.id = id;
        this.items.name = name;
        this.items.slug = slug;
        this.items.categories = this.service.categories;
        this.nav.push(ProductsPage, this.items);
    }
    getCart() {
        this.nav.push(CartPage);
    }
    getSearch() {
        this.nav.push(SearchPage);
    }
    mySlideOptions = {
        initialSlide: 1,
        loop: true,
        autoplay: 5800,
        pager: true
    }
    getProduct(item) {
        this.nav.push(ProductPage, item);
    }
    presentToastLoginAlert() {
        let toast = this.toastCtrl.create({
          message: 'You must login to add item to wishlist',
          duration: 1000,
           position: 'top'
        });
        toast.present();
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
    viewAllFeatured() {
        this.nav.push(ProductsPage, {filter: {featured: true}});
    }
    goto(data){
        if(data.description == "product"){
            this.nav.push(ProductPage, data.url);   
        }
        else if(data.description == "category"){
            this.items.id = data.url;
            this.items.name = data.title;
            this.items.categories = this.service.categories;
            this.nav.push(ProductsPage, this.items);
        }

        else if(data.description == "post"){
            this.nav.push(Post, data.url);
        }
    }
    doInfinite(infiniteScroll) {
        this.service.loadMore().then((results) => {infiniteScroll.complete()});
    }
    hideLoading(){
        this.loading = false;
    }
    getSubCategories(id){
        return this.service.categories.filter(item => item.parent === parseInt(id) && item.name != 'Uncategorized');
    }
    ionViewWillEnter() {
        this.backbuttonService.pushPage(EN_TAB_PAGES.EN_TP_HOME, this.nav); 
        if (document.querySelector(".tabbar")) this.tabBarElement.display = 'flex';
    }
    music() {
        this.nav.push(MusicPage);
    }
    events(url) {
            this.nav.push(EventsPage);
    }
    radio() {
        this.nav.push(RadioPage);
    }
    photos() {
        this.nav.push(PhotosPage);
    }
    products() {
        this.nav.push(ProductsPage);
    }
    biografia() {
        this.nav.push(BiografiaPage);
    }
    miaction(url){
        if(url == 'biography'){
            this.nav.push(BiografiaPage);
        }else if(url == 'new'){
            this.nav.push(ProductsnewPage);
        }else if(url == 'events'){
            this.nav.push(EventsPage);
        }else if(url == 'radio'){
            this.nav.push(RadioPage);
        }else if(url == 'photos'){
            this.nav.push(PhotosPage);
        }else if(url == 'music'){
            this.nav.push(MusicPage);
        }else if(url == 'store'){
            this.nav.push(ProductsPage);
        }else{
            this.nav.push(MusicPage);
        }
    }
}