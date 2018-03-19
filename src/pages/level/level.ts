import { Component } from '@angular/core';
 
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
 
import { Record } from '../home/record';
 
import { MovieNameProvider } from '../../providers/movie-name/movie-name';
 
import { MovieNamePipe } from '../../pipes/movie-name/movie-name';
 
 
/**
* Generated class for the LevelPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
 
@IonicPage()
@Component({
  selector: 'page-level',
  templateUrl: 'level.html'
})
export class LevelPage {
 
  level:number;
 
  complete:boolean;
 
  starcolor:string;
 
  sublevels:Map<number,boolean>;
 
  record:Map<number,Record>;
 
  wikipage:string;
 
  moviePipe:MovieNamePipe;
 
  counter:number;
 
  movie:string;
 
  moviename:string;
 
  guessed:Array<string>;
 
  chance:number;
 
  chances:Array<number>;
 
  constructor(public navCtrl: NavController, public viewCtrl:ViewController,
 
     public storage:Storage, public navParams: NavParams,public movieService:MovieNameProvider,
 
     public alertCtrl:AlertController, public toastCtrl: ToastController) {
 
    this.level = navParams.get('index');
 
    this.movie = null;
 
    this.record = navParams.get('record');
 
    this.sublevels = this.record.get(this.level).sublevels;
 
    this.moviePipe = new MovieNamePipe();
 
   this.wikipage = '';
 
    this.counter = 0;
 
    this.sublevels.forEach((value,key) => {
 
      if(value){
 
        this.counter = key+1;
 
        console.log(value);
 
      }
 
    });
 
    this.chances = Array.from(Array(5),(x,i)=>i);
 
    this.getWikipage();
 
  }
 
 
 
  getWikipage(){
 
    let presentYear = new Date().getFullYear()-1;
 
    //this.chance=10;
 
    let index = 2*(this.level-1);
 
    this.movieService.getMovieNames(presentYear-index).subscribe(data=> {
 
      this.wikipage += data;
 
      this.movieService.getMovieNames(presentYear-index-1).subscribe(data=> {
 
        this.wikipage += data;
 
        if(this.counter<30) {
 
          this.getMovieName(this.counter);
 
        } else {
 
          this.movie = 'Completed this Level !';
 
        }
 
      });
 
    });
 
 
 
  }
 
  getMovieName(index){
 
    let tables = document.getElementsByClassName("wikitable");
 
    let tableIndex = Math.floor(Math.random()*tables.length);
 
    let tags = tables[tableIndex].getElementsByTagName("i");
 
    let tagIndex = Math.floor(Math.random()*tags.length);
 
    console.log(tags[tagIndex].innerText);
 
    setTimeout(()=> {
 
      if(tags[tagIndex].innerText == 'citation needed'){
 
        this.getMovieName(index);
 
      } else {
 
        this.moviename=tags[tagIndex].innerText.toUpperCase();
 
        this.movie = this.moviePipe.transform(this.moviename);
 
        this.guessed = ['A','E','I','O','U'];
 
        this.chance = 5;
 
        this.counter = index;
 
        if(this.movie.indexOf('_')==-1){
 
          this.record.get(this.level).score+=1;
 
          this.record.get(this.level).sublevels.set(this.counter,true);
 
          this.gotoNext(true,true);
 
        }
 
      }
 
    }, 3500);
 
  }
 
 
 
  ionViewDidLoad() {
  
  }
 
  dismiss(){
    this.viewCtrl.dismiss();
  }
 
  gotoNext(bonus,status){
 
    let title = status?'YOU WON !':'YOU LOST !';
 
    let subTitle = status?'Let\'s try Next ':'<img src="assets/imgs/lose.png"/>Please Try Again ';
 
    let button = status? 'Next':'Replay';
 
    title = bonus?'LUCKY DAY':title;
 
    subTitle = bonus?'You got bonus points for':subTitle;
 
    let alert = null;
 
    if(this.counter==29 && status){
 
      alert = this.alertCtrl.create({
 
        title: title,
 
        subTitle: subTitle + 'Level !',
 
        buttons: [{
 
          text:'Exit',
 
          handler:data=>{
 
            this.record.get(this.level+1).status=true;
 
            this.dismiss();
 
        }}]
 
      });
 
    } else {
 
      alert = this.alertCtrl.create({
 
        title: title,
        message:'<ion-icon class="md-close"></ion-icon>',
        subTitle: subTitle + 'Movie !',
 
        buttons: [{
 
          text:'Exit',
          handler:data=>{
 
            this.dismiss();
 
        }},{
 
          text:button,
          cssClass:'close-before',
          handler:data=>{
 
            this.movie = null;
 
            if(this.counter<29){
 
              this.getMovieName(this.counter+1);
 
            }
 
          }
 
        }]
 
     });
     
    }
 
    alert.present();
 
  }
 
 
 
  handleKeyboardEvents(key) {
   
    if(this.counter < 30) {
 
        if(this.guessed.indexOf(key) == -1){
 
          this.guessed.push(key);
 
          this.movie = this.moviePipe.transform(this.moviename,this.guessed);
 
          if(this.moviename.indexOf(key)==-1){
 
          this.chance-=1;
 
          if(this.chance == 4){
 
            let alert = this.alertCtrl.create({
 
              title: 'Uh..Oh..Wrong letter',
 
              subTitle: 'Try with another Letter..!',
 
              buttons: ['OK']
 
            });
 
            alert.present();
 
          }
 
        }
 
      }
 
        if(this.chance==0){
 
          this.record.get(this.level).sublevels.set(this.counter,false);
 
          this.gotoNext(false,false);
 
        } else if(this.movie.indexOf('_')==-1){
 
          this.gotoNext(false,true);
 
          this.record.get(this.level).score+=1;
 
          this.record.get(this.level).sublevels.set(this.counter,true); //.get(index) = true;
 
        }
 
    }
 
  }
 
}