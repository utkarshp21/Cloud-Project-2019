import { Component } from '@angular/core';

import { AmplifyService } from 'aws-amplify-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'smart-doorbell-frontend';

  constructor(private amplifyService: AmplifyService, public router: Router) { }

  signOut() {
    this.amplifyService.auth().signOut();
    this.router.navigate(['/']);
  }
}
