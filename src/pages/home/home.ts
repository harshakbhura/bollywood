import { Component } from '@angular/core';

import { ViewController } from 'ionic-angular';


import { SplashScreen } from '@ionic-native/splash-screen';

@Component({

  selector: 'page-home',

  templateUrl: 'home.html'

})

export class HomePage {

  constructor(public viewCtrl: ViewController, public splashScreen: SplashScreen) {

   

  }



  ionViewDidEnter() {



    this.splashScreen.hide();



    setTimeout(() => {

      this.viewCtrl.dismiss();

    }, 4000);



  }



/* getMenu(){

 this.navCtrl.push(MenuPage);

} */



/* getMovie(){

 let presentYear = new Date().getFullYear();

 let yearIndex = 1949+Math.floor(Math.random()*(presentYear-1950));

 this.chance=10;

 this.status=null;

 this.movieService.getMovieNames(yearIndex).subscribe(data=> {

   this.movies = data;

   setTimeout(()=> {

     let tables = document.getElementsByClassName("wikitable");

     let tableIndex = Math.floor(Math.random()*tables.length);

     let tags = tables[tableIndex].getElementsByTagName("i");

     let tagIndex = Math.floor(Math.random()*tags.length);

     console.log(tags[tagIndex].innerText);

     this.guessed = new Array();

     if(tags[tagIndex].innerText == 'citation needed'){

       this.getMovie();

     } else {

       this.moviename=tags[tagIndex].innerText.toUpperCase();

       this.movie = this.moviePipe.transform(this.moviename,this.guessed);

     }

   }, 10000);

  

 });



} */


}