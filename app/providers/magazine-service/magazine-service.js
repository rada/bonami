import {Injectable} from 'angular2/core';
import {BonamiService} from '../../providers/bonami-service/bonami-service.js';
import {LocalStorageService} from '../local-storage-service/local-storage-service.js'
import {AppConfig} from '../../config/config.js'

@Injectable()
export class MagazineService {
  static get parameters(){
    return [[BonamiService], [LocalStorageService], [AppConfig]]
  }

  constructor(bonamiService, localStorageService, appConfig) {
    this.bonami = bonamiService;
    this.ls = localStorageService;
    this.appConfig = appConfig.appConfig;
    this.data = []//this.getMagazineArticles();
    this.magazineArticles = {};
  }

  // Gets data from Local Storage (PouchDB) and saves it to this.Data
  // if timelimit for checking new magazineArticle at Bonami is reached
  // it will check for new magazineArticles, fetches and saves them to
  // Local Storage and adds them to this.data (this.getNewMagazineArticles)
  getMagazineArticles(){
    if (this.data.length == 0){
      return new Promise(resolve => {
        return this.getAllLocalMagazineArticles().then((data) => {
          let localMagazineArticlesIds = this.data.map((magazineArticles) => { return magazineArticles.id });

          // if(this.checkNewMagazineArticles()){
          this.getNewMagazineArticles(localMagazineArticlesIds, false).then((resp) => {
            console.log("observable", resp);
            resolve(resp);
          });
          // }
        }).catch((err) => { console.log(err); });
      })
    }
  }

  // Checking if timelimit for appConfig for checking new
  // magazineArticles is reached
  checkNewMagazineArticles(){
    let lastBonamiUpdate = new Date(localStorage.getItem("lastMgzUpdateCheck"));
    console.log("Last Bonami new magazine articles check at: ", lastBonamiUpdate);
    return (new Date() - lastBonamiUpdate) >= this.appConfig.remoteNlIntervalCheck;
  }

  // Fetched new magazineArticles from Bonami API and saves them
  // to Local Storage if passed parameter save == true
  // and also adds to this.data (this.saveMagazineArticle)
  getNewMagazineArticles(magazineArticleIds, save){
    return new Promise(resolve => {
      this.bonami.getMagazineArticleList().map((resp)=> resp.json()).subscribe((resp) => {
        console.log("MagazineArticles list fetched.", resp);
              this.data = resp;
        // let remoteMagazineArticleIds = resp.map((magazineArticles) => { return magazineArticles.id });
        // remoteMagazineArticleIds.forEach((remoteMagazineArticleId) => {
        //   let isNew = remoteMagazineArticleId != magazineArticleIds.find((localMagazineArticleId) => {
        //     return localMagazineArticleId == remoteMagazineArticleId;
        //   })
        //   if (isNew){
        //     this.getMagazineArticle(remoteMagazineArticleId).then(resp => {
        //       if (save){ this.saveMagazineArticle(resp) };
        //       // this.data.push(resp);
        //     })
        //   }
        // });
        localStorage.setItem("lastMgzUpdateCheck", Date());
        resolve(this.data);
      }, (err) => {
        console.error("Unable to fetch Bonami magazineArticle list: ", err);
      })
    })
  }

  // Fetched magazineArticle from Bonami API
  getMagazineArticle(id){
    return new Promise(resolve => {
      this.bonami.getMagazineArticle(id).map((res)=> res.json()).subscribe(
        resp => {
          console.log("New magazineArticle fetched: ", resp);
          // resp.id += Math.ceil(Math.random()*30); // Unique ID is needed to save to PouchDB workaround befor API is available.
          this.data.push(resp);
          resolve(resp);
        },
        err => {console.error("Bonami Service error: ", err);}
      );
    })
  }

  //gets one magazineArticle from local DB/Storage
  getLocalMagazineArticle(id){
    let magazineArticle =
    this.ls.getRecord(this.appConfig.dbs['magazineDbName'], id).then((data) => {
      console.log("Record fetched (data): ", data);
      this.magazineArticles = data;
      return data;
    }).catch((err) => {
      console.error("Unable to fetch record from local DB: ", err);
      return {};
    });
    return magazineArticle;
  }

  // Saves magazineArticle to Local Storage and also adds it to this.data
  saveMagazineArticle(magazineArticle){
    if (magazineArticle.id){
      magazineArticle._id = String(magazineArticle.id);
      return this.ls.saveRecord(this.appConfig.dbs['magazineDbName'], magazineArticle).then((resp) => {
        console.log("magazineArticle saved.", resp);
        // this.data.push(resp);
      }).catch((err) => {
        console.error("Unable to save magazineArticle: ", err);
      });
    }
  }

  // Deletes magazineArticle from Local Storage and removes it from this.data
  deleteLocalMagazineArticle(magazineArticle){
    this.ls.deleteRecord(this.appConfig.dbs['magazineDbName'], magazineArticle).then((resp) => {
      console.log("magazineArticle deleted. ", resp);
      let index = this.data.indexOf(magazineArticle);
      if (index > -1){ this.data.splice(index, 1); }
    }).catch((err) => {
      console.error("Unable to delete magazineArticle: ", err);
    })
  }

  // Gets all magazineArticles from Local Storage and adds them to this.data
  getAllLocalMagazineArticles(){
    return this.ls.getAllRecords(this.appConfig.dbs['magazineDbName']).then((data) =>{
        this.data = data.rows.map((row) => {
          let nlDate = new Date(row.doc.publishedAt)
          row.doc.date = nlDate.toLocaleDateString();
          return row = row.doc
        })
    }).catch((err) => {
      console.error("Error fetching magazine articles from local DB: ", err);
    })
  }

  // Not yet implemented
  updateMagazineArticles(){
    this.deleteOldMagazineArticles();
  }

}
