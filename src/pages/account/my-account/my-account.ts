import { Component } from '@angular/core';
import { Platform, NavController, ViewController } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Config } from '../../../providers/service/config';
import { Values } from '../../../providers/service/values';
import { AppRate } from '@ionic-native/app-rate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { Address } from '../address/address';
import { MyInformation } from '../my-information/my-information';
import { Orders } from '../orders/orders';
import { WishlistPage } from '../wishlist/wishlist';
import { AccountLogin } from '../login/login';
import { AccountRegister } from '../register/register';
import { Post } from '../../post/post';
import { BackbuttonService } from '../../../providers/service/backbutton';
import { EN_TAB_PAGES } from "../../../app/config";
@Component({
    templateUrl: 'my-account.html'
})
export class MyAccount {
    tabBarElement: any;
    showtab: boolean = false;
    constructor(public platform: Platform, public viewCtrl: ViewController, private appRate: AppRate, private socialSharing: SocialSharing, public nav: NavController, public service: Service, public values: Values, private emailComposer: EmailComposer, public config: Config, private backbuttonService: BackbuttonService) {

    }
    hidetabs() {
        this.showtab = false;
        if (document.querySelector(".tabbar")) this.tabBarElement = document.querySelector(".tabbar")['style'].display = 'none';
    }
    showtabs() {
        this.showtab = true;
        if (document.querySelector(".tabbar")) this.tabBarElement = document.querySelector(".tabbar")['style'].display = 'flex';
    }
    Address() {
        this.nav.push(Address);
    }
    orders() {
        this.nav.push(Orders);
    }
    wishlist() {
        this.values.hideTabbar = false;
        this.nav.push(WishlistPage);
    }
    myInfo() {
        this.nav.push(MyInformation);
    }
    logout() {
        this.service.logout();
        if (!this.values.hideCloseButton) {
            this.nav.pop();
        }
    }
    login() {
        this.values.cartLoadEnable = false;
        this.nav.push(AccountLogin);
    }
    sinuUp() {
        this.nav.push(AccountRegister);
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
    post(id) {
        this.nav.push(Post, id);
    }
    dismiss() {
        this.nav.pop();
    }
    ionViewWillEnter() {
        this.backbuttonService.pushPage(EN_TAB_PAGES.EN_TP_ACCOUNT, this.nav);
        if(document.querySelector(".tabbar")){
            this.tabBarElement = document.querySelector(".tabbar")['style'];
            this.tabBarElement.display = 'flex';
            this.showtab = true; 
        }
    }
}