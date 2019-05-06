import { Component, OnInit } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import User from './types/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashBoardComponent implements OnInit {

  title = 'Chat Bot';
  user: User;

  constructor(private amplifyService: AmplifyService, public router: Router) { }

  ngOnInit() {
    Auth.currentSession().then(session => {
      this.user = {
        username: session.getIdToken().payload["cognito:username"],
        email: session.getIdToken().payload['email'],
        phone_number: session.getIdToken().payload['phone_number'],
        cognitoId: session.getIdToken().payload['sub'],
      };
      console.log(this.user);
    });
  }

  signOut() {
    this.amplifyService.auth().signOut();
    this.router.navigate(['/']);
  }

}
