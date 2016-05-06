import {Injectable} from 'angular2/core';
import {BonamiService} from '../../providers/bonami-service/bonami-service.js';
import {LocalStorageService} from '../local-storage-service/local-storage-service.js'
import {AppConfig} from '../../config/config.js'

/*
  Generated class for the Newsletter provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NewsletterService {
  static get parameters(){
    return [[BonamiService], [LocalStorageService]]
  }

  constructor(bonamiService, localStorageService) {
    this.bonami = bonamiService;
    this.localStorage = localStorageService;
    this.data = []//this.getNewsletters();
  }

  getNewsletters(){
    let localNewslettersIds = [];
    let localNewsletters = this.localStorage.getAllNewsletters();
    localNewsletters.forEach(function(newsletter){
      //filter non-expired to this.data; push newsletter ID to localNewslettersIds
      //delete expired from storage
    })
    let remoteNewsletterIds = this.checkNewNewsletters(localNewslettersIds);
    if (newNewsletterIds.length == 0){
      return this.data
    }else{
      // fetch new newsletters from Bonami
    }
  }
  //get Newsletters from local DB/Storage
  getLocalNewletters(){
  }

  updateNewsletters(){
    this.deleteOldNewsletters();
  }

  checkNewNewsletters(newsletterIds){
    let availableNewslIds = [];
    this.bonami.fetchNewsletterIdList().then((idList) => availableNewslIds = idList);
    // let localNewsletters = this.getLocalNewletters();
    let newNewsletterIds = availableNewslIds.filter(function(remoteNewslId){
      return remoteNewslId != newsletterIds.find(function(localNewsletterId){
        return localNewsletterId == remoteNewslId;
      })
    }) || [];
    return newNewsletterIds;
  }
}
