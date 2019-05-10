import { Component, OnInit, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import User from './types/user';
import { Filter } from './types/filter';

import { InputBoxComponent } from './input-box/input-box.component';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashBoardComponent implements OnInit {

  @ViewChild("alertContainer", { read: ViewContainerRef }) container;
  componentRef: ComponentRef<any>;
  dashBoardImages:Array<any>;

  constructor(private dashboardService: DashboardService, private resolver: ComponentFactoryResolver, private amplifyService: AmplifyService, public router: Router) { }

  createComponent(imageDetails) {
    
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(InputBoxComponent);

    this.componentRef = this.container.createComponent(factory);

    this.componentRef.instance.imageDetails = imageDetails;

    this.componentRef.instance.output.subscribe(event => console.log(event));

  }

  ngOnDestroy() {
    if(this.componentRef){
      this.componentRef.destroy();
    }
  }

  filter = new Filter("Utkarsh", Date.now(), Date.now());

  onFilterSearch(){
    this.dashboardService.filterImages(Object.assign({}, this.filter), this.user.idToken).subscribe(data => {
        this.dashBoardImages = data.body;
        debugger;
    });
  }

  title = 'Chat Bot';
  user: User;

  survilanceImages = [
    {
      src:"../../assets/images/my.jpeg",
      boundedBox:[{
        "faceId":123,
        "tagged":false,
        "name":"Don't know",
        "Width": 0.16857413947582245,
        "Height": 0.34200599789619446,
        "Left": 0.18879032135009766,
        "Top": 0.2254735231399536
      },{
        "faceId": 124,
        "tagged":true,
        "name": "Don't know",
        "Width": 0.18640722334384918,
        "Height": 0.4353622496128082,
        "Left": 0.4885527789592743,
        "Top": 0.11046215891838074
      }]
    },
    {
      src: "../../assets/images/my2.jpeg",
      boundedBox: [{
        "faceId": 123123,
        "tagged": true,
        "name": "Don't know",
        "Width": 0.16857413947582245,
        "Height": 0.34200599789619446,
        "Left": 0.18879032135009766,
        "Top": 0.2254735231399536
      }, {
        "faceId": 123123,
        "tagged": false,
        "Width": 0.18640722334384918,
        "Height": 0.4353622496128082,
        "Left": 0.4885527789592743,
        "Top": 0.11046215891838074
      }]
    },
    {
      src: "../../assets/images/my3.jpeg",
      boundedBox: [{
        "faceId": 123123,
        "tagged": true,
        "name": "Don't know",
        "Width": 0.16857413947582245,
        "Height": 0.34200599789619446,
        "Left": 0.18879032135009766,
        "Top": 0.2254735231399536
      }, {
        "faceId": 123123,
        "tagged": false,
        "Width": 0.18640722334384918,
        "Height": 0.4353622496128082,
        "Left": 0.4885527789592743,
        "Top": 0.11046215891838074
      }]
    },
    {
      src: "../../assets/images/my4.jpeg",
      boundedBox: [{
        "faceId": 123123,
        "tagged": true,
        "name": "Don't know",
        "Width": 0.16857413947582245,
        "Height": 0.34200599789619446,
        "Left": 0.18879032135009766,
        "Top": 0.2254735231399536
      }, {
        "faceId": 123123,
        "tagged": false,
        "Width": 0.18640722334384918,
        "Height": 0.4353622496128082,
        "Left": 0.4885527789592743,
        "Top": 0.11046215891838074
      }]
    },
    {
      src: "../../assets/images/my5.jpeg",
      boundedBox: [{
        "faceId": 123123,
        "tagged": true,
        "name": "Don't know",
        "Width": 0.16857413947582245,
        "Height": 0.34200599789619446,
        "Left": 0.18879032135009766,
        "Top": 0.2254735231399536
      }, {
        "faceId": 123123,
        "tagged": false,
        "Width": 0.18640722334384918,
        "Height": 0.4353622496128082,
        "Left": 0.4885527789592743,
        "Top": 0.11046215891838074
      }]
    },
    {
      src: "../../assets/images/my6.jpeg",
      boundedBox: [{
        "faceId": 123123,
        "tagged": true,
        "name": "Don't know",
        "Width": 0.16857413947582245,
        "Height": 0.34200599789619446,
        "Left": 0.18879032135009766,
        "Top": 0.2254735231399536
      }, {
        "faceId": 123123,
        "tagged": false,
        "Width": 0.18640722334384918,
        "Height": 0.4353622496128082,
        "Left": 0.4885527789592743,
        "Top": 0.11046215891838074
      }]
    },
    {
      src: "../../assets/images/my7.jpeg",
      boundedBox: [{
        "faceId": 123123,
        "tagged": true,
        "name": "Don't know",
        "Width": 0.16857413947582245,
        "Height": 0.34200599789619446,
        "Left": 0.18879032135009766,
        "Top": 0.2254735231399536
      }, {
        "faceId": 123123,
        "tagged": false,
        "Width": 0.18640722334384918,
        "Height": 0.4353622496128082,
        "Left": 0.4885527789592743,
        "Top": 0.11046215891838074
      }]
    },
    {
      src: "../../assets/images/my8.jpeg",
      boundedBox: [{
        "faceId": 123123,
        "tagged": true,
        "name": "Don't know",
        "Width": 0.16857413947582245,
        "Height": 0.34200599789619446,
        "Left": 0.18879032135009766,
        "Top": 0.2254735231399536
      }, {
        "faceId": 123123,
        "tagged": false,
        "Width": 0.18640722334384918,
        "Height": 0.4353622496128082,
        "Left": 0.4885527789592743,
        "Top": 0.11046215891838074
      }]
    },
    {
      src: "../../assets/images/my9.jpeg",
      boundedBox: [{
        "faceId": 123123,
        "tagged": true,
        "name": "Don't know",
        "Width": 0.16857413947582245,
        "Height": 0.34200599789619446,
        "Left": 0.18879032135009766,
        "Top": 0.2254735231399536
      }, {
        "faceId": 123123,
        "tagged": false,
        "Width": 0.18640722334384918,
        "Height": 0.4353622496128082,
        "Left": 0.4885527789592743,
        "Top": 0.11046215891838074
      }]
    }
  ]


  ngOnInit() {
    Auth.currentSession().then(session => {
      this.user = {
        username: session.getIdToken().payload["cognito:username"],
        email: session.getIdToken().payload['email'],
        phone_number: session.getIdToken().payload['phone_number'],
        cognitoId: session.getIdToken().payload['sub'],
        idToken: session.getIdToken().jwtToken
      };
     
      console.log(this.user);

    });
  }

  getBoxCoordinates(boundedbox,img){

    return {
      left_c: +boundedbox.left * img.width,
      top_c: +boundedbox.top * img.height,
      f_width: +boundedbox.width * img.width,
      f_height: +boundedbox.height * img.height
    }
  }

  makeCanvasRect(image){
    let c = <HTMLCanvasElement>document.getElementById('canvas-' + image.src);
    let ctx = c.getContext("2d");
    let img = <HTMLCanvasElement>document.getElementById('image-' + image.src);

    c.width = img.width;
    c.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.width, c.height);

    let canvas = <HTMLCanvasElement>document.getElementById('canvas-' + image.src);
    let context = canvas.getContext('2d');

    image["boundedBox"].forEach(boundedbox => {
        let boxCoordinates = this.getBoxCoordinates(boundedbox,img);
        context.beginPath();
        context.rect(boxCoordinates.left_c, boxCoordinates.top_c, boxCoordinates.f_width, boxCoordinates.f_height);
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();
        
        if(boundedbox.tagged){
          debugger;
          context.font = "20px Arial";
          context.fillStyle = "red";
          context.fillText(boundedbox.userName, boxCoordinates.left_c, boxCoordinates.top_c);
          
        }
       
    });

    canvas.addEventListener('click', (e) => {
      
      let targetCanvas = <HTMLCanvasElement>e.target || <HTMLCanvasElement>e.srcElement;

      var rect = targetCanvas.getBoundingClientRect();
      
      const clickedPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      const clickedMouse = {
        x: e.pageX,
        y: e.pageY,
      }

      console.log(clickedMouse);

      let context = targetCanvas.getContext('2d');
      context.beginPath();

      context.rect(clickedPos.x, clickedPos.y, 20, 40);
      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();

      function isIntersect(pos, rectangle) {
        return pos.y > rectangle.top_c && pos.y < rectangle.top_c + rectangle.f_height && pos.x > rectangle.left_c && pos.x < rectangle.left_c + rectangle.f_width;
      }

      console.log("Faces");
      console.log("Image clicked", img);

      image["boundedBox"].forEach(image => {
      
          console.log("Face Details", image)
          let boxCoordinates = this.getBoxCoordinates(image, img);

          if (isIntersect(clickedPos, boxCoordinates)) {
            let imageDetails = {
              position: clickedMouse,
              faceId: image.faceId
            }
            this.createComponent(imageDetails);
          }

      })

    });

  } 
  
  signOut() {
    this.amplifyService.auth().signOut();
    this.router.navigate(['/']);
  }

}
