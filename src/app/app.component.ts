import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuPage } from '../pages/menu/menu';
import { Record } from '../pages/home/record';
import { MovieNameProvider } from '../providers/movie-name/movie-name';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = MenuPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public modalCtrl: ModalController,public movieService:MovieNameProvider) {
    this.initializeApp();
  }

 

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(()=>{
        this.splashScreen.hide();
      });
      this.statusBar.styleDefault();
      let records = null;
      let level=0;
      let record = localStorage.getItem('record');
      if(record!=null){
        records = JSON.parse(record);
        level=0;
        for(var len=records.length;level<len&&records[level].status;level++){
        }
      } else {
        records = new Array();
        level = 1;
        Array.from(Array(30),(x,i)=>{
          records[i]=new Record((i == 0) ? true : false);
        });
        localStorage.setItem('record',JSON.stringify(records));
      }
      this.getWikipage(level);
    });

  }

   getWikipage(level){
    let wikipage = '';
    if(localStorage.getItem('wiki')==null){
      this.movieService.getMovieNames(PRESENT_YEAR-level).subscribe(data=> {
        wikipage += data;
        localStorage.setItem('wiki',wikipage);
      });
    } else {
      wikipage = localStorage.getItem('wiki');
    }
  }
}
export const PRESENT_YEAR = new Date().getFullYear();