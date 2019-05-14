
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { positionElements } from 'ngx-bootstrap/positioning/public_api';
import { InputBoxService } from './input-box.service';
import { AmplifyService } from 'aws-amplify-angular';
import { Router } from '@angular/router';

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
  
  constructor(private inputBoxService: InputBoxService, private amplifyService: AmplifyService, public router: Router) { 
  }

  onSubmit(){
    if(this.tag){
      this.inputBoxService.tagImage({ tag: this.tag, faceId: this.imageDetails.faceId }, this.imageDetails.idToken).subscribe(data => {
        this.tagOutput.next((<any>data).body.result);
      },
      err => {
        if (err.status == 401) {
          this.signOut();
        }
      });
    }else{
      this.tagOutput.next("error");
    }
    // .subscribe(data => {
    //   debugger;
    // });
  }

  signOut() {
    this.amplifyService.auth().signOut();
    this.router.navigate(['/']);
  }

}
