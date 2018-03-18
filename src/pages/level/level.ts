import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
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
  templateUrl: 'level.html',

  host: {

    '(document:keydown)': 'handleKeyboardEvents($event)'

  }
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

     public alertCtrl:AlertController,public keyboard:Keyboard, public toastCtrl: ToastController) {

    this.level = navParams.get('index');

    //this.complete = true;

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

    this.keyboard.show();

   

  }

 

  getWikipage(){

    let presentYear = new Date().getFullYear();

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

      /* setTimeout(()=> {

       

      }, 10000); */

    });

  

  }

 

  getStatus(level){

    this.record.get(this.level).sublevels[level].status;

    return this.record.get(this.level).sublevels[level].status;

  }

 

  getMovieName(index){

    console.log(index);

    let tables = document.getElementsByClassName("wikitable");

    let tableIndex = Math.floor(Math.random()*tables.length);

    let tags = tables[tableIndex].getElementsByTagName("i");

    let tagIndex = Math.floor(Math.random()*tags.length);

   

    

    console.log(tags[tagIndex].innerText);

    /* this.guessed = new Array();

    this.chance = 5;

    if(this.movie.indexOf('_')==-1){

      this.status=true;

      this.gotoNext();

    } */

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

   

    /* let modal = this.modalCtrl.create(MovieGuessPage,{movie:movie,moviename:moviename});

    modal.present();

    modal.onDidDismiss(data=>{

      if(data.status){

        this.record.get(this.level).score+=5;

        this.record.get(this.level).sublevels.set(index,true); //.get(index) = true;

      } else {

        this.record.get(this.level).sublevels.set(index,false);

      }

      this.storage.set('record',JSON.stringify(this.record));

    }); */

    //this.navCtrl.push(MovieGuessPage,{movie:movie,moviename:moviename});

  }

 

  ionViewDidLoad() {

    //console.log('ionViewDidLoad LevelPage');

  }

 

  dismiss(){

    this.viewCtrl.dismiss();

  }

 

  gotoNext(bonus,status){

    let title = status?'YOU WON !':'YOU LOST !';

    let subTitle = status?'Let\'s try Next ':'Please Try Again ';

    let button = status? 'Next':'Replay';

    title = bonus?'LUCKY DAY':title;

    subTitle = bonus?'You got bonus points !':subTitle;

    let alert = null;

    if(this.counter==29 && status){

      alert = this.alertCtrl.create({

        title: title,

        subTitle: subTitle + 'Level !',

        message:'<ion-icon name="arrow-back"></ion-icon>',

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

        subTitle: subTitle + 'Movie !',

        message:'<ion-icon name="arrow-back"></ion-icon>',

        buttons: [{

          text:'Exit',

          handler:data=>{

            this.dismiss();

        }},{

          text:button,

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

 

  handleKeyboardEvents(event: KeyboardEvent) {

    if(this.counter < 30) {

    let keycode = event.which || event.keyCode;

    let key = null;

      if(keycode > 64 && keycode < 91) {

        key= String.fromCharCode(keycode);

        if(this.guessed.indexOf(key) == -1){

          this.guessed.push(key);

          this.movie = this.moviePipe.transform(this.moviename,this.guessed);

          if(this.moviename.indexOf(key)==-1){

          this.chance-=1;

          if(this.chance == 4){

            let alert = this.alertCtrl.create({

              title: 'Uh..Oh..Wrong letter',

              subTitle: 'Try with another Letter..!',

              message:'<ion-icon name="arrow-back"></ion-icon>',

              buttons: ['OK']

            });

            alert.present();

          }

        }

      }

        console.log(this.chance);

        console.log(this.movie.indexOf('_')==-1);

        if(this.chance==0){

         

          this.record.get(this.level).sublevels.set(this.counter,false);

          this.gotoNext(false,false);

        } else if(this.movie.indexOf('_')==-1){

         

          this.gotoNext(false,true);

          this.record.get(this.level).score+=1;

          this.record.get(this.level).sublevels.set(this.counter,true); //.get(index) = true;

        }

      } else {

        key = null;

      }

    }

  }
}
