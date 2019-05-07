
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { positionElements } from 'ngx-bootstrap/positioning/public_api';
import { InputBoxService } from './input-box.service';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.css']
})
export class InputBoxComponent {

  @Input() imageDetails;
  
  name:string;
  @Output() output = new EventEmitter();
  
  constructor(private inputBoxService: InputBoxService) { 
  }

  onSubmit(){
    let test = this.inputBoxService.tagImage({ tag: "hi", userId: this.imageDetails.faceId })
    debugger;
    // .subscribe(data => {
    //   debugger;
    // });
  }

}
