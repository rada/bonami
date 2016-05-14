import {Page, NavController, NavParams, Storage, LocalStorage} from 'ionic-angular';
import {BonamiService} from '../../providers/bonami-service/bonami-service.js';
import {OnInit} from 'angular2/core';
import {MagazineService} from '../../providers/magazine-service/magazine-service.js'
import {LocalStorageService} from '../../providers/local-storage-service/local-storage-service.js'
import {AppConfig} from '../../config/config.js'

@Page({
  templateUrl: 'build/pages/magazine/magazine.html'
  // providers: [AppConfig]
})
export class MagazinePage {
  static get parameters() {
    return [[NavController], [NavParams], [BonamiService], [MagazineService],
    [LocalStorageService], [AppConfig]];
  }
  // Created this.data and fills it with magazineArticles from Local Storage
  // and if time limit for checking new magazineArticles is reached, it will also
  // check and fetch magazineArticles from Bonami API
  // this.data is referenced to MagazineService which is a singleton hence
  // the data doesn't need to be fetched from LocalStorage every time we
  // navigate to MagazinePage
  constructor(nav, navParams, bonamiService, magazineService, localStorageService, appConfig) {
    this.nav = nav;
    this.ls = localStorageService;
    this.ms = magazineService;
    this.appConfig = appConfig.appConfig;
    this.today = (new Date()).getDay();
    this.sampleImg = "https://1.bonami.cz/images/campaigns/homepage_screen/campaign-19316-spears-walker-hodinky.jpeg"
    if (this.ms.data.length == 0){ // magazineArticles haven't been fethced from MagazineService yet
      console.log("this.ms.data.length == 0");
      this.initData();
      this.ms.getMagazineArticles().then((data) =>{
        console.log("this.ms: ", this.ms);
        this.data.magazineArticle = data;
        console.log("this.data.magazineArticle", this.data.magazineArticle);
      });
    }else if(this.ms.checkNewMagazineArticles()){
      console.log("Checking new magazineArticles at Bonami.");
      this.initData();
      this.data.magazineArticle = this.ms.data;
      let localNlIds = this.ms.data.map((magazineArticle) => { return magazineArticle.id });
      this.ms.getNewMagazineArticles(localNlIds, true);
    }else{
      this.initData();
      this.data.magazineArticle = this.ms.data;
      console.log("Data already available in this.ms:", this.ms);
    }
  }

  // Creates empty objects fro magazineArticles in order not to get errors
  // from html template as this.data.BELOW_OBJECTS is used in *ngFor cycle
  initData(){
    this.data = {
      magazineArticle: [{
        id: '',
        image: '',
        title: 'Název příspěvku',
        tags: ['inspirace', 'Novinka'],
        author: 'Lenka Nová',
        publishedAt: '',
        perex: 'Nějaký perex',
      }]
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
    if (this.ms.data.length > event){
      this.data = this.ms.data[event];
      // this.ms.deleteLocalNewsletter(this.ms.data[event]);
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
