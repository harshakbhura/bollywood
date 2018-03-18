import { Component } from '@angular/core';

/**
 * Generated class for the AlphaKeyboardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'alpha-keyboard',
  templateUrl: 'alpha-keyboard.html'
})
export class AlphaKeyboardComponent {

  text: string;
  letters:Array<string>;
  constructor() {
    console.log('Hello AlphaKeyboardComponent Component');
    this.text = 'Hello World';
    this.letters = Array.from(Array(26),(x,i)=>{
      return String.fromCharCode(i+65);
    });
    console.log(this.letters);
  }

}
