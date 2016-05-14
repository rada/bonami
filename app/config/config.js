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
      apiUrlTest: "private-anon-e17b6324b-bonami1.apiary-mock.com",
      apiUrl: "www.bonami.cz/mcc16",
      apiEndpoints: {
        newsletters: "/newsletters",
        newsletterById: "/newsletters/:id",
        magazines: "/magazine-articles",
        magazineArticleById: "/magazine-articles/:id"
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
    let url = "https://" + this.appConfig.apiUrl + this.appConfig.apiEndpoints[endpoint];
    return url;
  }
}
