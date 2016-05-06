import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocalStorageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocalStorageService {
  static get parameters(){
    return [[Http]]
  }

  constructor(http) {
    this.http = http;
    this.data = null;
  }

  saveRecord(db, id){};
  getRecord(db, id){};
  deleteRecord(db, id){};

  getAllRecords(db){};
  deleteAllRecords(db){};

  // //returns and array of all newsletter objects from local storage
  // getAllNewsletters(){  }
  //
  // getNewsletter(id){  }
  //
  // saveNewsletter(newsletter){ }
  //
  // deleteNewsletter(id){ }
  //
  // getAllMagazines(){ }
  //
  // getMagazine(id){ }// not sure what the ID will be yet
}
