import {App, IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {NewsletterPage} from './pages/newsletter/newsletter';
import {ListPage} from './pages/list/list';
import {MagazinePage} from './pages/magazine/magazine';
import {NewsletterService} from './providers/newsletter-service/newsletter-service.js'
import {BonamiService} from './providers/bonami-service/bonami-service.js';
import {LocalStorageService} from './providers/local-storage-service/local-storage-service.js'
import {AppConfig} from './config/config.js'


@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [NewsletterService, BonamiService, LocalStorageService, AppConfig]
})
class MyApp {
  static get parameters() {
    return [[IonicApp], [Platform], [BonamiService], [LocalStorageService]];
  }

  constructor(app, platform, newsletterService) {
    this.app = app;
    this.platform = platform;
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Newsletter', component: NewsletterPage },
      { title: 'List', component: ListPage },
      { title: 'Magazine', component: MagazinePage }
    ];

    this.rootPage = NewsletterPage;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
