import {Injectable} from 'angular2/core';

@Injectable()
export class AppConfig{

  constructor(){
    this.appConfig = {
      // basic config
      debugMode: true,
      storagePrefix: "test_",

      // date config
      weekDays: ['pondeli','utery','streda', 'ctvrtek', 'patek', 'sobota', 'nedele'],
      // API config
      apiKey: "4aa883f95999ec813b8bfaf319f3972b",
      apiUrl: "private-anon-e17b6324b-bonami1.apiary-mock.com",
      apiEndpoints: {
        newsletters: "/newsletter",
        newsletterById: "/newsletter/:id",
        magazine: ""
      },
      // DB Congif
      dbs: {
          newsletterDbName: "bonami-newsletters",
          magazineDbName: "bonami-magazines"
        },
      // interval after which we check new newsletters
      // using Bonami API
      remoteNlIntervalCheck: 3600000
    }
  }

  getApiUrl(endpoint){
    var url = "http://" + this.appConfig.apiUrl + this.appConfig.apiEndpoints[endpoint];
    return url;
  }
}
