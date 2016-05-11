import {Page, NavController, NavParams, Storage, LocalStorage} from 'ionic-angular';
import {BonamiService} from '../../providers/bonami-service/bonami-service.js';
import {OnInit} from 'angular2/core';
import {NewsletterService} from '../../providers/newsletter-service/newsletter-service.js'
import {LocalStorageService} from '../../providers/local-storage-service/local-storage-service.js'
import {AppConfig} from '../../config/config.js'
import {MagazinePage} from '../magazine/magazine';



@Page({
  templateUrl: 'build/pages/newsletter/newsletter.html'
  // providers: [AppConfig]
})
export class NewsletterPage {
  static get parameters() {
    return [[NavController], [NavParams], [BonamiService], [NewsletterService],
    [LocalStorageService], [AppConfig]];
  }
  // Created this.data and fills it with newsletters from Local Storage
  // and if time limit for checking new newsletters is reached, it will also
  // check and fetch newsletters from Bonami API
  // this.data is referenced to NewsletterService which is a singleton hence
  // the data doesn't need to be fetched from LocalStorage every time we
  // navigate to NewsletterPage
  constructor(nav, navParams, bonamiService, newsletterService, localStorageService, appConfig) {
    this.nav = nav;
    this.ls = localStorageService;
    this.nls = newsletterService;
    this.appConfig = appConfig.appConfig;
    this.today = (new Date()).getDay();
    this.sampleImg = "https://1.bonami.cz/images/campaigns/newsletter_new/campaign-297-darkove-poukazy.jpeg?v=iaa4h"
    if (this.nls.data.length == 0){ // newsletters haven't been fethced from NewsletterService yet
      this.initData();
      this.nls.getNewsletters().then((data) =>{
        console.log("this.nls: ", this.nls);
        this.data = this.nls.data[0];
      });
    }else if(this.nls.checkNewNewsletters()){
      console.log("Checking new newsletters at Bonami.");
      this.data = this.nls.data[0];
      let localNlIds = this.nls.data.map((nl) => { return nl.id });
      this.nls.getNewNewsletters(localNlIds, true);
    }else{
      this.data = this.nls.data[0];
      console.log("Data already available in this.nls:", this.nls);
    }
  }

  // Creates empty objects fro newsletters in order not to get errors
  // from html template as this.data.BELOW_OBJECTS is used in *ngFor cycle
  initData(){
    this.data = {
      onStockProducts: {},
      magazineArticle: {},
      lovedProducts: {},
      endingCampaigns: {}
    };
  }

  // for testing purposes only
  onPageLoaded(){
    console.log("Before platfor.ready().");
    this.platform.ready().then(() => {
      // this.ls.initDB(this.appConfig.dbs['newsletterDbName']);
      console.log("onPageLoaded called.");
    })
  }

  // for testing purposes only
  magazinePage(){
    this.nav.push(MagazinePage);
  }

  // for testing purposes only
  openPage(event, item){
    console.log(event, item);
    if (this.nls.data.length > event){
      this.data = this.nls.data[event];
      // this.nls.deleteLocalNewsletter(this.nls.data[event]);
    }
    // this.nav.push(NewsletterPage);
  }

  // Used in html template to calculate product/campaing remaining time
  calculateTimeRemaining(timeUTC){ // input time format: 2016-08-28T23:59:59+0000
    let dateNow = new Date;
    let dateEnd = Date.parse(timeUTC);
    let timeDiff = dateEnd - dateNow.valueOf();
    let dayInMSec = 24 * 3600 * 1000;
    let hourInMSec = 3600 * 1000;
    let daysLeft = Math.floor(timeDiff / dayInMSec);
    let hoursLeft = Math.floor(((timeDiff + dateNow.getTimezoneOffset()*60000) % dayInMSec)/ hourInMSec)
    return {
      "days": daysLeft,
      "hours": hoursLeft
    }
  }

  // for testing purposes only. Used to generate button headings in html template
  calculateDateFromToday(numOfDays, dayMonthFormat = false){
    let today = new Date;
    let dayInMiliSecs = 1000 * 3600 * 24;
    if (Number(numOfDays) || numOfDays == 0){
      let date = new Date(today.valueOf() + (dayInMiliSecs * Number(numOfDays)));
      if (dayMonthFormat) {
        return (date.getDate()) + "." + (date.getMonth()) + "."
      }
      return date;
    }
    return 0;
  }
}
