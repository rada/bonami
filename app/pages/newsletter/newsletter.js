import {Page, NavController, NavParams} from 'ionic-angular';
import {BonamiService} from '../../providers/bonami-service/bonami-service.js';
import {OnInit} from 'angular2/core';
import {NewsletterService} from '../../providers/newsletter-service/newsletter-service.js'


@Page({
  templateUrl: 'build/pages/newsletter/newsletter.html',
  providers: [BonamiService]
})
export class NewsletterPage {
  static get parameters() {
    return [[NavController], [NavParams], [BonamiService], [NewsletterService]];
  }
  constructor(nav, navParams, bonamiService, newsletterService) {
    this.nav = nav;
    this.weekDays = ['pondeli','utery','streda', 'ctvrtek', 'patek', 'sobota', 'nedele'];
    this.today = (new Date()).getDay();
    this.data = {
      onStockProducts: {},
      magazineArticle: {},
      lovedProducts: {},
      endingCampaigns: {}
    };
    this.sampleImg = "https://1.bonami.cz/images/campaigns/newsletter_new/campaign-297-darkove-poukazy.jpeg?v=iaa4h"
    bonamiService.getNewsletter(1).map((res)=> res.json()).subscribe(
      resp => {this.data = resp; console.log(resp);},
      err => {console.error("Bonami Service error: ", err);}
    );
  }

  openPage(event, item){
    this.nav.push(NewsletterPage);
  }

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
