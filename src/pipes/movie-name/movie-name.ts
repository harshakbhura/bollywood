import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the MovieNamePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'movieName',
})
export class MovieNamePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    console.log(args);

    let re =  new RegExp("[^aeiou\\-\\:\\.\\,\\/ 0-9]","gi");  // /[^aeiou\- 0-9]/gi;

    let we=/ /gi;

    let ad = args.join().replace(/,/g,'');

    if(args.length>0){

      re =  new RegExp("[^aeiou"+ad+"\\-\\:\\.\\,\\/ 0-9]","gi");

    }

    return value.replace(re,'_').replace(we,'&emsp;');
  }
}
