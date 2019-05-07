
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { positionElements } from 'ngx-bootstrap/positioning/public_api';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.css']
})
export class InputBoxComponent {

  @Input() type: string = "success";
  @Input() position;
  
  name:string;
  @Output() output = new EventEmitter();
  
  constructor() { 
   
  }

  onSubmit(){
    debugger;
  }

}
