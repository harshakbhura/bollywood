import { Http,Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

/*
  Generated class for the MovieNameProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MovieNameProvider {

  constructor(public http: Http) {
    console.log('Hello MovieNameProvider Provider');
  }
  getMovieNames(year): Observable<any> {
    return this.http.get('https://en.wikipedia.org/api/rest_v1/page/html/List_of_Bollywood_films_of_'+year).map((response:Response)=>response.text());
  }
}
