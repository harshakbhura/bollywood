import { BrowserModule } from '@angular/platform-browser';

import { ErrorHandler, NgModule } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { IonicStorageModule } from '@ionic/storage';

import { Keyboard } from '@ionic-native/keyboard';

import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';



 

import { StatusBar } from '@ionic-native/status-bar';

import { SplashScreen } from '@ionic-native/splash-screen';

import { PipesModule } from '../pipes/pipes.module';

import { MovieNameProvider } from '../providers/movie-name/movie-name';

import { MenuPage } from '../pages/menu/menu';

import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

import { LevelPage } from '../pages/level/level';



 

@NgModule({

  declarations: [

    MyApp,

    HomePage,

    

    MenuPage,

    ProgressBarComponent,

    LevelPage

    

  ],

  imports: [

    BrowserModule,

    PipesModule,

    IonicModule.forRoot(MyApp),

    IonicStorageModule.forRoot(),

    HttpModule

  ],

  bootstrap: [IonicApp],

  entryComponents: [

    MyApp,

    HomePage,

    

    MenuPage,

    LevelPage

    

  ],

  providers: [

    StatusBar,

    SplashScreen,

    Keyboard,

    {provide: ErrorHandler, useClass: IonicErrorHandler},

    MovieNameProvider

  ]

})

export class AppModule {}

 