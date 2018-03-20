import { Component, Output, EventEmitter, Input } from '@angular/core';
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
  @Input('guessed') guessed;
  @Output() alphaPressed = new EventEmitter<string>();
  letters:Array<string>;
  constructor() {
    this.letters = Array.from(['Q','W','E','R','T','Y','U','I','O',
    'P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M']);
  }
 
  changeButton($event,i){
    this.alphaPressed.emit($event.target.innerText);
   $event.target.parentElement.disabled=true;
  }

}
