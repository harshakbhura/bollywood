import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LevelPage } from '../level/level';
import { Record } from '../home/record';

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
  record:Array<Record>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    this.initRecord();
  }

  initRecord(){
    let record = localStorage.getItem('record');
    
      if(record!=null){
        this.record = JSON.parse(record);
      }else{
        this.record = new Array();
      }
      Array.from(Array(30),(x,i)=>{
        let status = (i == 0) ? true : false;
        this.record[i]=new Record(status);
        
      })
      localStorage.setItem('record',JSON.stringify(this.record));
    
  }

  getSublevels(index){
    this.navCtrl.push(LevelPage,{index:index,record:this.record});
  }

  getScore(){
    let score = 0;
    if(this.record){
      this.record.forEach((value,key)=>{
        score += value.score;
      });
    }
    return score*5;
  }
}
