import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LevelPage } from '../level/level';
import { Record } from '../home/record';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  levels:Array<number>;
  loadProgress:number;
  record:Map<number,Record>;
  recordEntry:Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public storage:Storage) {
    this.storage.get('record').then((data)=>{
      console.log(data);
    });
    this.record = new Map();
    Array.from(Array(30),(x,i)=>{
      let status = (i == 0) ? true : false;
      this.record.set(i+1,new Record(status));
    });
    this.storage.set('record',this.record);
    this.recordEntry=Array.from(this.record.entries());
  }

  ionViewDidLoad() {

  }

  getSublevels(index){
    this.navCtrl.push(LevelPage,{index:index+1,record:this.record});
  }

  getScore(){
    let score = 0;
    this.record.forEach((value,key)=>{
      score += value.score;
    });
    return score*5;
  }
}
