import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

let PouchDB = require('pouchdb');

/*
  Generated class for the LocalStorageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocalStorageService {
  private newslettersDb;
  private magazinesDb;

  static get parameters(){
    return [[Http]]
  }

  initDB {
    this.newslettersDb = new PouchDB('bonami-newsletters', { adapter: 'websql' });
    this.magazinesDb = new PouchDB('bonami-magazines', { adapter: 'websql' });
  }

  constructor(http) {
    this.http = http;
    this.data = null;
  }

  saveRecord(db, record, id){
    return db.put(record, id);
  };
  getRecord(db, id){
    return db.get(id);
  };
  deleteRecord(db, record){
    return db.remove(record)
  };

  getAllRecords(db){
    return db.allDocs({ include_docs: true});
  };
  deleteAllRecords(db){
    return db.destroy();
  };

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
