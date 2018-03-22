import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
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
  alertData:Map<string,any>;
 
  constructor(public navCtrl: NavController, public viewCtrl:ViewController,
    public storage:Storage, public navParams: NavParams,public movieService:MovieNameProvider,
    public alertCtrl:AlertController) {
    this.level = navParams.get('index');
    this.record = navParams.get('record');
    this.movie = null;
    this.sublevels = this.record.get(this.level).sublevels;
    this.moviePipe = new MovieNamePipe();
    this.wikipage = '';
    this.guessed = ['A','E','I','O','U'];
    this.counter = 0;
   this.sublevels.forEach((value,key) => {
      if(value){
        this.counter = key+1;
      }
    });
    this.initAlertData();
    this.chances = Array.from(Array(5),(x,i)=>i);
    if(this.counter<30) {
      this.getWikipage();
    } else {
      this.movie='Completed';
      this.levelFinish(false,true);
    }
  }
 
  initAlertData(){
    this.alertData = new Map();
    this.alertData.set('win',{
      title:'YOU WON !',
      subTitle:'<img class="bd-rd-30" src="assets/imgs/next.png"/><br/>Let\'s try Next Movie !',
      buttons:[{text:'EXIT'},{text:'NEXT'}]
    });
    this.alertData.set('lose',{
      title:'YOU LOST !',
      subTitle:'<img class="bd-rd-30" src="assets/imgs/lose-'+Math.floor(Math.random()*2)+'.png"/><br/>Please Try Another Movie !',
      buttons:[{text:'EXIT'},{text:'REPLAY'}]
    });
    this.alertData.set('bonus',{
      title:'LUCKY DAY !',
      subTitle:'<img class="bd-rd-30" src="assets/imgs/bonus.jpg"/><br/>You got bonus points for Movie !',
      buttons:[{text:'EXIT'},{text:'NEXT'}]
    });
    this.alertData.set('jump',{
      title:'YOU DID IT !',
      subTitle:'<img class="bd-rd-30" src="assets/imgs/win.png"/><br/>Level Completed !',
      buttons:[{text:'EXIT'}]
    });
    this.alertData.set('chance',{
      title:'Uh..Oh..Wrong letter',
      subTitle:'<img class="bd-rd-30" src="assets/imgs/chance.png"/><br/>Try with another Letter..!',
      buttons:[{text:'OK'}]
    })
  }
 
  getWikipage(){
    let presentYear = new Date().getFullYear()-1;
    let index = 2*(this.level-1);
    this.movieService.getMovieNames(presentYear-index).subscribe(data=> {
      this.wikipage += data;
      this.movieService.getMovieNames(presentYear-index-1).subscribe(data=> {
        this.wikipage += data;
        this.getMovieName(this.counter);
      });
    });
  }
 
  getMovieName(index){
    let tables = document.getElementsByClassName("wikitable");
    let tableIndex = Math.floor(Math.random()*tables.length);
    let tags = tables[tableIndex].getElementsByTagName("i");
    let tagIndex = Math.floor(Math.random()*tags.length);
    let movieText = tags[tagIndex].innerText;
    console.log(index+""+this.counter);
    console.log(movieText);
    setTimeout(()=> {
      if(movieText == 'citation needed'){
        this.getMovieName(index);
      } else {
        this.moviename=movieText.toUpperCase();
        this.movie = this.moviePipe.transform(this.moviename);
        this.guessed = ['A','E','I','O','U'];
        this.chance = 5;
        if(this.movie.indexOf('_')==-1){
          this.counter = index;
          this.checkFinish(true,true);
        }
      }
    }, 3500);
  }
  ionViewDidLoad() {
  }
 
  checkFinish(bonus,status){
    this.record.get(this.level).score+=1;
    this.record.get(this.level).sublevels.set(this.counter,true);
    if(this.counter==30 && status){
      this.levelFinish(bonus,status);
    } else{
      this.gotoNext(bonus,status);
    }
  }
 
  levelFinish(bonus,status){
    let data =  this.alertData.get('jump');
    let alert = this.alertCtrl.create({
      title: data.title,
      subTitle: data.subTitle,
      buttons: [{
        text:data.buttons[0].text,
        handler:data=>{
          this.record.get(this.level+1).status=true;
          this.viewCtrl.dismiss();
      }}]
    });
    this.storage.set('record',this.record);
    alert.present();
  }
 
  gotoNext(bonus,status){
    /* let title = status?'YOU WON !':'YOU LOST !';
    let subTitle = status?'<img class="bd-rd-30" src="assets/imgs/win.png"/>Let\'s try Next ':'<img src="assets/imgs/lose-'+Math.floor(Math.random()*2)+'.png"/>Please Try Another ';
    let button = status? 'Next':'Replay';
    title = bonus?'LUCKY DAY':title;
    subTitle = bonus?'<img class="bd-rd-30" src="assets/imgs/bonus.png"/>You got bonus points for':subTitle; */
    let data =  bonus?this.alertData.get('bonus'):(status?this.alertData.get('win'):this.alertData.get('lose'));
    let alert = this.alertCtrl.create({
      title: data.title,
      subTitle: data.subTitle,
      buttons: [{
        text:data.buttons[0].text,
        handler:data=>{
          this.viewCtrl.dismiss();
      }},{
        text:data.buttons[1].text,
        handler:data=>{
          this.movie = null;
          if(this.counter<30){
            this.getMovieName(this.counter);
          }
        }
      }]
    });
   
    this.storage.set('record',this.record);
    alert.present();
  }
 
  handleKeyboardEvents(key) {
    //if(this.counter < 30) {
        if(this.guessed.indexOf(key) == -1){
          this.guessed.push(key);
          this.movie = this.moviePipe.transform(this.moviename,this.guessed);
          if(this.moviename.indexOf(key)==-1){
            this.chance-=1;
            if(this.chance == 4){
              let data = this.alertData.get('chance');
              let alert = this.alertCtrl.create({
                title: data.title,
                subTitle: data.subTitle,
                buttons: [data.buttons[0].text]
              });
            alert.present();
          }
        }
      }
      if(this.chance==0){
        this.record.get(this.level).sublevels.set(this.counter,false);
        this.gotoNext(false,false);
      } else if(this.movie.indexOf('_')==-1){
        //this.gotoNext(false,true);
        this.counter += 1;
        this.checkFinish(false,true);
        //this.record.get(this.level).score+=1;
       //this.record.get(this.level).sublevels.set(this.counter,true); //.get(index) = true;
      }
    }
// }
}