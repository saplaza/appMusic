import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, FabContainer, LoadingController, PopoverController, ViewController, Content, ModalController, ToastController } from 'ionic-angular';
import { ProductService } from '../../providers/service/product-service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';
import { md5 } from './md5';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { PopoverPage } from '../about-popover/about-popover';
import { CartPage } from '../cart/cart';
import { Slides } from 'ionic-angular';

@Component({
    templateUrl: 'product.html'
})
export class ProductPage {
    @ViewChild(Slides) slides: Slides;
    @ViewChild(Content) content:Content;

    product: any;
    id: any;
    status: any;
    options: any = {};
    quantity: any;
    reviews: any;
    AddToCart: any;
    related: any;
    crossSell: any;
    upsell:any;
    items: any;
    disableBuyNow: boolean = false;
    disableAddButton: boolean = false;
    tabBarElement: any;
    showOverview: boolean = true;
    showRelated : boolean = false;
    showReviews : boolean = false;
    segment = 'overview';
    form: any = {};
    buttonSubmitLogin: boolean = false;
    showAddReview:  boolean = false;
    count: any;
    count5: number = 0;
    count4: number = 0;
    count3: number = 0;
    count2: number = 0;
    count1: number = 0;
    count5Percentage: string = '0' + '%';
    count4Percentage: string = '0' + '%';
    count3Percentage: string = '0' + '%';
    count2Percentage: string = '0' + '%';
    count1Percentage: string = '0' + '%';
    filter: any = {};
    usedVariationAttributes: any = [];
    variations: any;

    constructor(public toastCtrl: ToastController, public viewCtrl: ViewController, private photoViewer: PhotoViewer, public popoverCtrl: PopoverController, public nav: NavController, public service: ProductService, params: NavParams, public functions: Functions, public values: Values, private socialSharing: SocialSharing, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
        this.quantity = "1";
        this.AddToCart = "Add To Cart";
        if(document.querySelector(".tabbar"))
        this.tabBarElement = document.querySelector(".tabbar")['style'];

        if(params.data.id){
            this.product = params.data;
            this.usedVariationAttributes = this.product.attributes.filter(function (attribute) { return attribute.variation == true });
            this.id = params.data.id;
            this.options.product_id = this.id;
            if ((this.product.type == 'variable') && this.product.variations.length) this.getVariationProducts();
            this.getRelatedProducts();
            this.getUpsellProducts();
            this.getCrossSellProducts();
            this.getReviews();
        }
        else {
            this.id = params.data;
            this.options.product_id = this.id;
            this.service.getProduct(this.id)
                .then((results) => this.handleProductResults(results));
        }
    }

    handleProductResults(results) {
        this.product = results;
        if ((this.product.type == 'variable') && this.product.variations.length) this.getVariationProducts();
        this.getReviews();
        this.getRelatedProducts();
        this.getUpsellProducts();
        this.getCrossSellProducts();
    }
    getVariationProducts() {
        this.service.getVariationProducts(this.product.id).then((results) => this.variations = results);
    }
    getProduct(id) {
        this.nav.push(ProductPage, id);
    }
    addToCart(id) {
        if (this.setVariations()) {
            this.service.addToCart(this.options).then((results) => this.updateCart(results));
        }
    }
    buyNow(id) {
        if (this.setVariations()) {
            this.service.addToCart(this.options).then((results) => this.updateBuynowResults(results));
        }
    }
    setVariations(){
        this.product.attributes.forEach(item => {
            if(item.selected){
                this.options['variation[attribute_pa_' + item.name + ']'] = item.selected;
            }
        })
        for(var i = 0; i < this.product.attributes.length; i++){
            if(this.product.attributes[i].variation && this.product.attributes[i].selected == undefined){
                this.functions.showAlert('Options', 'Please Select Product ' + this.product.attributes[i].name  + ' Option');
                return false;
            }
        }
        return true;
    }
    updateBuynowResults(a) {
        this.disableBuyNow = false;
        this.nav.push(CartPage);
    }
    updateCart(a) {
        this.disableAddButton = false;
        this.AddToCart = "Add To Cart";
        this.presentToast();
    }
    getCart() {
        this.nav.push(CartPage);
    }
    mySlideOptions = {
        initialSlide: 1,
        loop: true,
        autoplay: 5800,
        pager: true
    }
    getReviews() {
        this.service.getReviews(this.id).then((results) => this.handleReview(results));
    }
    handleReview(a) {
        this.reviews = a;
        this.count = this.product.rating_count;
        for (let item in this.reviews) {
            this.reviews[item].avatar = md5(this.reviews[item].email);
        }
        this.reviews.forEach(review => {
            if (review.rating == 5) {
                this.count5 = this.count5 + 1;
            }
            if (review.rating == 4) {
                this.count4 = this.count4 + 1;
            }
            if (review.rating == 3) {
                this.count3 = this.count3 + 1;
            }
            if (review.rating == 2) {
                this.count2 = this.count2 + 1;
            }
            if (review.rating == 1) {
                this.count1 = this.count1 + 1;
            }
        });
        this.count5Percentage = ((this.count5 / this.count) * 100) + '%';
        this.count4Percentage = ((this.count4 / this.count) * 100) + '%';
        this.count3Percentage = ((this.count3 / this.count) * 100) + '%';
        this.count2Percentage = this.count2 + '%';
        this.count1Percentage = this.count1 + '%';
    }
   addToWishlist(id) {
        if (this.values.isLoggedIn) {
            this.values.wishlistId[this.product.id] = true;
            this.service.addToWishlist(id).then((results) => this.update(results));
        } else {
            this.presentToastLoginAlert();
        }
    }
    update(a) {
        if (a.success == "Success") {
            this.presentToastAddToWishlist();
        } else {
            this.values.wishlistId[this.product.id] = false;
            this.functions.showAlert("error", "error");
        }
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
    getRelatedProduct(item) {
        this.nav.push(ProductPage, item);
    }
    getRelatedProducts() {
        if (this.product.related_ids != 0) {
        for(let item in this.product.related_ids)
        this.filter['include[' + item + ']'] = this.product.related_ids[item];
      
            this.service.getRelatedProducts(this.filter)
               .then((results) => this.related = results);
        }
    }

    getUpsellProducts() {
        if (this.product.upsell_ids != 0) {
        for(let item in this.product.upsell_ids)
        this.filter['include[' + item + ']'] = this.product.upsell_ids[item];
      
            this.service.getUpsellProducts(this.filter)
               .then((results) => this.upsell = results);
        }
    }

    getCrossSellProducts() {
        if (this.product.cross_sell_ids != 0) {
        for(let item in this.product.cross_sell_ids)
        this.filter['include[' + item + ']'] = this.product.cross_sell_ids[item];
      
            this.service.getCrossSellProducts(this.filter)
               .then((results) => this.crossSell = results);
        }
    }
    share(product, network: string, fab: FabContainer) {
        var options = {
            message: 'Hey check this product',
            subject: product.title,
            files: ['', ''],
            url: product.permalink,
            chooserTitle: 'Pick an app'
        }
        let loading = this.loadingCtrl.create({
            content: 'Please wait...',
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(() => {
            fab.close();
        });
        loading.present();
        this.socialSharing.shareWithOptions(options);
        /*this.socialSharing.share("Check this item:  Lifestyle://home/items/" + product.id, product.title)
            .then(() => {
            })
            .catch(() => {
        });*/
    }
    showMoreReviews() {
        this.showRelated = false;
        this.showOverview = false;
        this.showReviews = true;
        this.segment = 'reviews';
    }
    viewPhoto(index) {
        this.slides.slideTo(index + 1, 500);
    }
    zoomPhoto(src) {
        this.photoViewer.show(src, this.product.name);
    }
    presentPopover(event: Event) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: event
        });
    }
    ionViewDidLoad() {
        if (document.querySelector(".tabbar")) this.tabBarElement.display = 'none';
    }
    ionViewWillLeave() {
        if (document.querySelector(".tabbar")) this.tabBarElement.display = 'flex';
    }
    similar() {
        this.showRelated = true;
        this.showOverview = false;
        this.showReviews = false;
        this.segment = 'related';
    }
    updateSchedule(event) {
        if (event._value == 'overview') {
            this.showOverview = true;
            this.showRelated = false;
            this.showReviews = false;
        } else if (event._value == 'related') {
            this.showOverview = false;
            this.showRelated = true;
            this.showReviews = false;
        } else if (event._value == 'reviews') {
            this.showOverview = false;
            this.showRelated = false;
            this.showReviews = true;
        }
    }
    yourRating(rating) {
        this.form.rating = rating;
    }
    submitComment() {
        this.form.id = this.id;
        if (this.validate()) {
            this.buttonSubmitLogin = true;
            this.service.submitComment(this.form).then((results) => {
                this.status = results;
                this.buttonSubmitLogin = false;
                this.functions.showAlert("Success", "Thank you for your review! Your review is awaiting approval");
            });
        }
    }
    validate() {
        if (!this.values.isLoggedIn) {
            if (this.form.author == undefined || this.form.author == "") {
                this.functions.showAlert("ERROR", "Please Enter Name");
                return false
            }
            if (this.form.email == undefined || this.form.email == "") {
                this.functions.showAlert("ERROR", "Please Enter Email");
                return false
            }
        }
        if (this.form.comment == undefined || this.form.comment == "") {
            this.functions.showAlert("ERROR", "Please Enter Comment");
            return false
        } else return true;
    }
    showSubmitReview() {
        if (this.showAddReview) this.showAddReview = false;
        else this.showAddReview = true;
    }

    presentToastLoginAlert() {
        let toast = this.toastCtrl.create({
            message: 'You must login to add item to wishlist',
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }
    presentToastAddToWishlist() {
        let toast = this.toastCtrl.create({
            message: 'Item added to wishlist',
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }
    presentToast() {
        let toast = this.toastCtrl.create({
            message: 'Item added to cart',
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }

    chooseVariation(att, value){
        this.product.attributes.forEach(item => {
            if(item.name == att.name){
                item.selected = value;
            }
        })
        var test = new Array(this.usedVariationAttributes.lenght);
        test.fill(false);
        this.variations.forEach(variation => {
            this.usedVariationAttributes.forEach((attribute, index) => {
                if(variation.attributes.length == 0){
                    console.log('0');
                    this.options.variation_id = variation.id;
                    this.product.in_stock = variation.in_stock;
                    this.product.price = variation.price;
                    this.product.sale_price = variation.sale_price;
                    this.product.regular_price = variation.regular_price;
                }
                else {
                    variation.attributes.forEach(item => {
                        if(item.name == attribute.name && item.option == attribute.selected){
                            test[index] = true;
                        }
                    })
                    if(test.every( v => v === true )){
                        this.options.variation_id = variation.id;
                        this.product.in_stock = variation.in_stock;
                        this.product.price = variation.price;
                        this.product.sale_price = variation.sale_price;
                        this.product.regular_price = variation.regular_price;
                        test.fill(false);
                    };
                }
            })
        })
    }
}