import {App, IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {NewsletterPage} from './pages/newsletter/newsletter';
import {MagazinePage} from './pages/magazine/magazine';
import {SettingsPage} from './pages/settings/settings';
import {NewsletterService} from './providers/newsletter-service/newsletter-service.js'
import {MagazineService} from './providers/magazine-service/magazine-service.js'
import {BonamiService} from './providers/bonami-service/bonami-service.js';
import {LocalStorageService} from './providers/local-storage-service/local-storage-service.js'
import {AppConfig} from './config/config.js'


@App({
  templateUrl: 'build/app.html',
  config: {
    pageTransition: 'ios'
  }, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [NewsletterService, MagazineService, BonamiService, LocalStorageService, AppConfig]
})
class MyApp {
  static get parameters() {
    return [[IonicApp], [Platform], [BonamiService], [LocalStorageService], [AppConfig]];
  }

  constructor(app, platform, newsletterService, appConfig) {
    this.app = app;
    this.platform = platform;
    this.initializeApp();
    this.appConfig = appConfig.appConfig;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Newsletter', component: NewsletterPage },
      { title: 'Magazine', component: MagazinePage }
    ];
    this.settingsPage = { title: 'Settings', component: SettingsPage };
    this.rootPage = NewsletterPage;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      // One Signal Push Notification code
      document.addEventListener('deviceready', () => {
        // Enable to debug issues.
        // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
        let appId = this.appConfig.oneSignalAppId;
        let googleProjectNumber = this.appConfig.googleProjectNumber;
        var notificationOpenedCallback = function(jsonData) {
          console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal.init("8baf272d-5a7f-4f97-8b72-75df81f0d15b", {googleProjectNumber: "1005880216694"}, notificationOpenedCallback);

        // Show an alert box if a notification comes in when the user is in your app.
        window.plugins.OneSignal.enableInAppAlertNotification(true); }, false);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
