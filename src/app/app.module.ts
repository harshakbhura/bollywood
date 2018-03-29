import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PipesModule } from '../pipes/pipes.module';
import { MovieNameProvider } from '../providers/movie-name/movie-name';
import { MenuPage } from '../pages/menu/menu';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { LevelPage } from '../pages/level/level';
import { AlphaKeyboardComponent } from '../components/alpha-keyboard/alpha-keyboard';

@NgModule({
  declarations: [
    MyApp,
    MenuPage,
    ProgressBarComponent,
    LevelPage,
    AlphaKeyboardComponent
  ],
  imports: [
    BrowserModule,
    PipesModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPage,
    LevelPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MovieNameProvider
  ]
})
export class AppModule {}
