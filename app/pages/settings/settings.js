import {Page, NavController} from 'ionic-angular';
import {AppConfig} from '../../config/config.js'

/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {
  static get parameters() {
    return [[NavController], [AppConfig]];
  }

  constructor(nav, appConfig) {
    this.nav = nav;
    this.appConfig = appConfig.appConfig;
  }
}
