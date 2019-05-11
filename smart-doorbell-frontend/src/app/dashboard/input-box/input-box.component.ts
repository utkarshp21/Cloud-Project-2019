
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
  tag:string;

  @Output() tagOutput = new EventEmitter();
  
  constructor(private inputBoxService: InputBoxService) { 
  }

  onSubmit(){
    
    this.inputBoxService.tagImage({ tag: this.tag, faceId: this.imageDetails.faceId }, this.imageDetails.idToken).subscribe(data => {
      this.tagOutput.next(data.body.result);
    });

    // .subscribe(data => {
    //   debugger;
    // });
  }

}
