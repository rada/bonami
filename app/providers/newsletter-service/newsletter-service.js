import {Injectable} from 'angular2/core';
import {BonamiService} from '../../providers/bonami-service/bonami-service.js';
import {LocalStorageService} from '../local-storage-service/local-storage-service.js'
import {AppConfig} from '../../config/config.js'

@Injectable()
export class NewsletterService {
  static get parameters(){
    return [[BonamiService], [LocalStorageService], [AppConfig]]
  }

  constructor(bonamiService, localStorageService, appConfig) {
    this.bonami = bonamiService;
    this.ls = localStorageService;
    this.appConfig = appConfig.appConfig;
    this.data = []//this.getNewsletters();
    this.nl = {};
  }

  // Gets data from Local Storage (PouchDB) and saves it to this.Data
  // if timelimit for checking new newsletter at Bonami is reached
  // it will check for new newsletters, fetches and saves them to
  // Local Storage and adds them to this.data (this.getNewNewsletters)
  getNewsletters(){
    if (this.data.length == 0){
      return this.getAllLocalNewsletters().then((data) => {
        let localNewslettersIds = this.data.map((nl) => { return nl.id });

        if(this.checkNewNewsletters()){
          this.getNewNewsletters(localNewslettersIds, true).then((resp) => {
            console.log("observable", resp);
          });
        }
      }).catch((err) => { console.log(err); });
    }
  }

  // Checking if timelimit fro appConfig for checking new
  // newsletters is reached
  checkNewNewsletters(){
    let lastBonamiUpdate = new Date(localStorage.getItem("lastUpdateCheck"));
    console.log("Last Bonami new newsletters check at: ", lastBonamiUpdate);
    return (new Date() - lastBonamiUpdate) >= this.appConfig.remoteNlIntervalCheck;
  }

  // Fetched new newsletters from Bonami API and saves them
  // to Local Storage if passed parameter save == true
  // and also adds to this.data (this.saveNewsletter)
  getNewNewsletters(newsletterIds, save){
    return new Promise(resolve => {
      let newNewsletters = [];
      this.bonami.getNewslettersList().map((resp)=> resp.json()).subscribe((resp) => {
        console.log("Newsletter list fetched.");
        let remoteNewslIds = resp.map((nl) => { return nl.id });
        remoteNewslIds.forEach((remoteNewslId) => {
          let isNew = remoteNewslId != newsletterIds.find((localNewsletterId) => {
            return localNewsletterId == remoteNewslId;
          })
          if (isNew){
            this.getNewsletter(remoteNewslId).then(resp => {
              if (save){ this.saveNewsletter(resp) };
              // this.data.push(resp);
            })
          }
        });
        localStorage.setItem("lastUpdateCheck", Date());
        resolve(this.data);
      }, (err) => {
        console.error("Unable to fetch Bonami newsletter list: ", err);
      })
    })
  }

  // Fetched newsletter from Bonami API
  getNewsletter(id){
    return new Promise(resolve => {
      this.bonami.getNewsletter(id).map((res)=> res.json()).subscribe(
        resp => {
          console.log("New newsletter fetched: ", resp);
          resp.id += Math.ceil(Math.random()*30); // Unique ID is neede to save to PouchDB workaround befor API is available.
          resolve(resp);
        },
        err => {console.error("Bonami Service error: ", err);}
      );
    })
  }

  //gets one Newsletter from local DB/Storage
  getLocalNewsletter(id){
    let newsletter =
    this.ls.getRecord(this.appConfig.dbs['newsletterDbName'], id).then((data) => {
      console.log("Record fetched (data): ", data);
      this.nl = data;
      return data;
    }).catch((err) => {
      console.error("Unable to fetch record from local DB: ", err);
      return {};
    });
    return newsletter;
  }

  // Saves newsletter to Local Storage and also adds it to this.data
  saveNewsletter(newsletter){
    if (newsletter.id){
      newsletter._id = String(newsletter.id);
      return this.ls.saveRecord(this.appConfig.dbs['newsletterDbName'], newsletter).then((resp) => {
        console.log("Newsletter saved.", resp);
        this.data.push(resp);
      }).catch((err) => {
        console.error("Unable to save newsletter: ", err);
      });
    }
  }

  // Deletes newsletter from Local Storage and removes it from this.data
  deleteLocalNewsletter(newsletter){
    this.ls.deleteRecord(this.appConfig.dbs['newsletterDbName'], newsletter).then((resp) => {
      console.log("Newsletter deleted. ", resp);
      let index = this.data.indexOf(newsletter);
      if (index > -1){ this.data.splice(index, 1); }
    }).catch((err) => {
      console.error("Unable to delete newsletter: ", err);
    })
  }

  // Gets all newsletters from Local Storage and adds them to this.data
  getAllLocalNewsletters(){
    return this.ls.getAllRecords(this.appConfig.dbs['newsletterDbName']).then((data) =>{
        this.data = data.rows.map((row) => {
          let nlDate = new Date(row.doc.publishedAt)
          row.doc.date = nlDate.toLocaleDateString();
          return row = row.doc
        })
    }).catch((err) => {
      console.error("Error fetching newsletters from local DB: ", err);
    })
  }

  // Not yet implemented
  updateNewsletters(){
    this.deleteOldNewsletters();
  }

}
