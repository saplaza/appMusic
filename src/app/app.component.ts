import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, MenuController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Service } from '../providers/service/service';
import { Values } from '../providers/service/values';
import { Config } from '../providers/service/config';
import { TranslateService } from '@ngx-translate/core';
import { AppRate } from '@ionic-native/app-rate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ModalController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { Post } from '../pages/post/post';
import { AccountLogin } from '../pages/account/login/login';
import { MyAccount } from '../pages/account/my-account/my-account';
import { Orders } from '../pages/account/orders/orders';
import { AccountRegister } from '../pages/account/register/register';
import { OrderSummary } from '../pages/checkout/order-summary/order-summary';
import { CartPage } from '../pages/cart/cart';
import { TabsPage } from '../pages/tabs/tabs';
import { MusicPage } from '../pages/music/music';
import { EventsPage } from '../pages/events/events';
import { RadioPage } from '../pages/radio/radio';
import { PhotosPage } from '../pages/photos/photos';
import { ProductsPage } from '../pages/products/products';
import { ProductsnewPage } from '../pages/productsnew/productsnew';
import { ProductPage } from '../pages/product/product';
import { Address } from '../pages/account/address/address';
import { OneSignal } from '@ionic-native/onesignal';
import { Globals } from '../app/config';
import { NativeStorage } from '@ionic-native/native-storage';
import { BackbuttonService } from '../providers/service/backbutton';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
//import { Deeplinks } from '@ionic-native/deeplinks';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = TabsPage;
    status: any;
    items: any = {};
    buttonLanguagesSettings: boolean = false;
    categories: any;
    image: any;
    name: any;
    data: any = {};
    alert: any;
    constructor(/*public deeplinks: Deeplinks, */private nativeStorage: NativeStorage, public app: App, private emailComposer: EmailComposer, private appRate: AppRate, public modalCtrl: ModalController, private oneSignal: OneSignal, private socialSharing: SocialSharing, statusBar: StatusBar, public splashScreen: SplashScreen, public alertCtrl: AlertController, public platform: Platform, public service: Service, public config: Config, public values: Values, public translateService: TranslateService, public menuCtrl: MenuController, private backbuttonService: BackbuttonService, private screenOrientation: ScreenOrientation) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            statusBar.backgroundColorByHexString('#f6f6f6');
            splashScreen.hide();
            this.registerBackButton();
            this.nativeStorage.getItem('blocks').then(data => { if (data) { 
                this.splashScreen.hide();
                this.service.blocks = data.blocks;
                this.values.settings = data.settings;
                this.values.calc(platform.width());
                if (this.values.settings.app_dir == 'rtl') this.platform.setDir('rtl', true);
                this.translateService.setDefaultLang(this.values.settings.language);
            } }, error => console.error(error));
            this.nativeStorage.getItem('categories').then(data => {
                if (data) {
                    this.service.categories = data;
                    this.service.mainCategories = this.service.categories.filter(item => item.parent === 0);
                }
            }, error => console.error(error));
            this.service.load().then((results) => this.handleService(results));
            this.screenOrientation.onChange().subscribe(
               () => {
                   this.values.calc(platform.height());
               }
            );
        });
    }
    handleService(results) {
        if (this.values.settings.app_dir == 'rtl') this.platform.setDir('rtl', true);
            this.translateService.setDefaultLang(this.values.settings.language);
            this.splashScreen.hide();
            this.values.calc(this.platform.width());
        if (this.platform.is('cordova')) {
            this.oneSignal.startInit(this.values.settings.onesignal_app_id, this.values.settings.google_project_id);
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
            this.oneSignal.handleNotificationReceived().subscribe(result => {
                console.log(result);
            });
            this.oneSignal.handleNotificationOpened().subscribe(result => {
                if (result.notification.payload.additionalData.category) {
                    this.nav.push(ProductsPage, {id: result.notification.payload.additionalData.category});
                } else if (result.notification.payload.additionalData.product) {
                    this.nav.push(ProductPage, {id: result.notification.payload.additionalData.product});
                } else if (result.notification.payload.additionalData.post) {
                    this.post({di: result.notification.payload.additionalData.post});
                } else if (result.notification.payload.additionalData.order) {
                    this.nav.push(OrderSummary, {id: result.notification.payload.additionalData.order});
                }
            });
            this.oneSignal.endInit();
        }
        if(this.values.data.settings.show_latest == '1')
        this.service.getProducts();
        if(this.values.data.settings.show_featured == '1')
        this.service.getfeaturedProduct({status: 'publish', featured: true, per_page: 50});
        if(this.values.data.settings.show_onsale == '1')
        //this.service.onSaleProduct();
        this.service.getbestOffers();
    }
    openPage(page) {
        this.nav.setRoot(page);
    }
    getCategory(id, slug, name) {
        this.values.onsale = false;
        this.values.newCollections = false;
        this.values.featuredProducts = false;
        this.items.id = id;
        this.items.slug = slug;
        this.items.name = name;
        this.menuCtrl.close();
        this.items.categories = this.service.categories;
        this.nav.setRoot(ProductsPage, this.items);
    }
    getCart() {
        this.values.hideTabbar = false;
        this.nav.setRoot(CartPage);
    }
    music() {
        this.nav.setRoot(MusicPage);
    }
    events() {
        this.nav.setRoot(EventsPage);
    }
    radio() {
        this.nav.setRoot(RadioPage);
    }
    photos() {
        this.nav.setRoot(PhotosPage);
    }
    tienda() {
        this.nav.setRoot(ProductsPage);
    }
    logout() {
        this.service.logout();
    }
    login() {
        this.values.cartLoadEnable = false;
        this.nav.setRoot(AccountLogin);
    }
    signIn() {
        this.values.cartLoadEnable = false;
        this.nav.setRoot(AccountLogin);
    }
    register() {
        this.nav.setRoot(AccountRegister);
    }
    address() {
        this.nav.setRoot(Address);
    }
    order() {
        this.nav.setRoot(Orders);
    }
    cart() {
        this.values.hideTabbar = false;
        this.nav.setRoot(CartPage, 1);
    }
    post(id) {
        this.nav.setRoot(Post, id);
    }
    myAccount() {
        if (this.values.isLoggedIn) {
            this.values.hideCloseButton = false;
            let modal = this.modalCtrl.create(MyAccount);
            modal.present();
        } else {
            this.nav.push(AccountLogin);
        }
    }
    bestOffers() {
        this.values.onsale = true;
        this.values.newCollections = false;
        this.values.featuredProducts = false;
        this.nav.setRoot(ProductsPage);
    }
    shop() {
        this.nav.setRoot(TabsPage);
    }
    getSubCategoryDropdown(j) {
        for (let item in this.service.mainCategories) {
            if (item == j) {
                if (this.service.mainCategories[j].activated) this.service.mainCategories[j].activated = false;
                else this.service.mainCategories[j].activated = true;
            }
        }
    }
    rateApp() {
        if (this.platform.is('cordova')) {
            this.appRate.preferences.storeAppURL = {
                ios: this.values.settings.rate_app_ios_id,
                android: this.values.settings.rate_app_android_id,
                windows: 'ms-windows-store://review/?ProductId=' + this.values.settings.rate_app_windows_id
            };
            this.appRate.promptForRating(true);
        }
    }
    shareApp() {
        if(this.platform.is('cordova')){
            var url = '';
            if(this.platform.is('android'))
            url = this.values.settings.share_app_android_link;
            else url = this.values.settings.share_app_ios_link;
            var options = {
                message: '',
                subject: '',
                files: ['', ''],
                url: url,
                chooserTitle: ''
            }
            this.socialSharing.shareWithOptions(options);
        }
    }
    contact() {
        let email = {
            to: this.values.settings.support_email,
            subject: '',
            body: '',
            isHtml: true
        };
        this.emailComposer.open(email);
    }
    registerBackButton() {
        this.platform.registerBackButtonAction(() => {
          if (this.menuCtrl.isOpen()) {
            this.menuCtrl.close();
            return;
          }
          for (let i = 0; i < Globals.navCtrls.length; i++) {
            let n = Globals.navCtrls[i];
            if (n) {
              if (n.canGoBack()) {
                let navParams = n.getActive().getNavParams();
                if (navParams) {
                  let resolve = navParams.get("resolve");
                  if (resolve) {
                    n.pop().then(() => resolve({}));
                  } else {
                    n.pop();
                  }
                } else {
                  n.pop();
                }
                return;
              }
            } else console.log("n was null!");
          }

          if (this.nav.getActive().instance instanceof TabsPage && !this.nav.canGoBack()) {
            let popPageVal = this.backbuttonService.popPage();
            if (popPageVal >= 0) {
              this.switchTab(popPageVal);
            } else {
              if (this.alert) {
                this.alert.dismiss();
                this.alert = null;
              } else {
                this.showAlert();
              }
            }
          } else {
            if (this.nav.canGoBack()) {
              this.nav.pop();
            }
          }
        });
    }
      showAlert() {
        this.alert = this.alertCtrl.create({
          title: "Exit?",
          message: "Are you sure you want to exit?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                this.alert = null;
              }
            },
            {
              text: "Exit",
              handler: () => {
                this.platform.exitApp();
              }
            }
          ]
        });
        this.alert.present();
      }
      switchTab(tabIndex) {
        if (tabIndex >= 0) {
          Globals.tabIndex = tabIndex;
          //Globals.tabs.select(tabIndex);
          //this.values.changeTab = false;
          this.app.getRootNav().getActiveChildNav().select(tabIndex);
         // Globals.tabs.selectedIndex = tabIndex;
        }
      }
}