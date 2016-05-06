import {Page, NavController} from 'ionic-angular';

/*
  Generated class for the MagazinePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/magazine/magazine.html',
})
export class MagazinePage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }
}
