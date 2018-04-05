import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, FabContainer } from 'ionic-angular';
import { Record } from '../home/record';
import { MovieNameProvider } from '../../providers/movie-name/movie-name';
import { MovieNamePipe } from '../../pipes/movie-name/movie-name';
import { PRESENT_YEAR } from '../../app/app.component';

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
  hintType: any;
  isHintVisible: boolean;
  hint:string;
  hints:Object;
  movieArr:Array<string>;
  level:number;
  record:Array<Record>;
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
    public navParams: NavParams,public movieService:MovieNameProvider,
    public alertCtrl:AlertController) {
    this.level = navParams.get('index');
    this.record = navParams.get('record');
    this.movie = null;
    let sublevels = this.record[this.level].sublevels;
    this.moviePipe = new MovieNamePipe();
    this.wikipage = '';
    this.guessed = ['A','E','I','O','U'];
    this.counter = 0;
    this.isHintVisible = false;
    this.hint=null;
    sublevels.forEach((value,key) => {
      if(value){
        this.counter = key;
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
      title:'CORRECT !',
      subTitle:'<img class="bd-rd-30" src="assets/imgs/next.png"/><br/>Let\'s try Next Movie !',
      buttons:[{text:'EXIT'},{text:'NEXT'}]
    });
    this.alertData.set('lose',{
      title:'RETRY !',
      subTitle:'<img class="bd-rd-30" src="assets/imgs/lose-'+this.counter%2+'.png"/><br/>Please Try Another Movie !',
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
    this.wikipage = localStorage.getItem('wiki');
    setTimeout(()=>{
      this.getMovieName(this.counter);
    },100);
  }
 
  getMovieName(index){
    let tables = document.getElementsByClassName("wikitable");
    let tableIndex = Math.floor(Math.random()*(tables.length-1))+1;
    let tags = tables[tableIndex].getElementsByTagName("i");
    let tagIndex = Math.floor(Math.random()*(tags.length-1));
    let movieText = tags[tagIndex].innerText;
    setTimeout(()=> {
      if(movieText == 'citation needed'){
        this.getMovieName(index);
      } else {
        this.moviename=movieText.toUpperCase();
        let movie = this.moviePipe.transform(this.moviename);
        this.movieArr = movie.split("&emsp;");
        if(this.movieArr.length>3){
          this.getMovieName(index);
        }else{
          this.movie = movie;
        }
        let sibling = tags[tagIndex].parentNode.nextSibling;
        this.hints = {
          director:sibling['innerText'],
          cast:sibling.nextSibling['innerText'],
          genre:sibling.nextSibling.nextSibling['innerText']
        }
        this.guessed = ['A','E','I','O','U'];
        this.chance = 5;
        if(this.movie.indexOf('_')==-1){
          this.counter = index;
          this.checkFinish(true,true);
        }
      }
    }, 500);
  }

  showHint(type, fab: FabContainer){
    this.isHintVisible = true;
    this.hint=this.hints[type];
    this.hintType=type;
  }
  
  ionViewDidLoad() {
  }
  ionViewWillLeave(){
    localStorage.setItem('record',JSON.stringify(this.record));
  }
  checkFinish(bonus,status){
    this.record[this.level].score+=1;
    this.record[this.level].sublevels[this.counter]=true;
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
          this.movieService.getMovieNames(PRESENT_YEAR-this.level-2).subscribe(data=> {
            localStorage.setItem('wiki',data);
          });
          this.record[this.level+1].status=true;
          this.viewCtrl.dismiss();
      }}]
    });
    alert.present();
  }
 
  gotoNext(bonus,status){
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
          this.movie = ' ';
          this.isHintVisible=false;
          if(this.counter<30){
            this.getMovieName(this.counter);
          }
        }
      }]
    });
    alert.present();
  }
 
  handleKeyboardEvents(key) {
    if(this.guessed.indexOf(key) == -1){
        this.guessed.push(key);
        this.movie = this.moviePipe.transform(this.moviename,this.guessed);
        this.movieArr = this.movie.split("&emsp;");
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
      this.record[this.level].sublevels[this.counter]=false;
      this.gotoNext(false,false);
    } else if(this.movie.indexOf('_')==-1){
      this.counter += 1;
      this.checkFinish(false,true);
    }
  }
}