import { Component, TemplateRef,OnInit, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import User from './types/user';
import { Filter } from './types/filter';
import { imageTag} from './types/imageTag';

import { InputBoxComponent } from './input-box/input-box.component';
import { DashboardService } from './dashboard.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashBoardComponent implements OnInit {

  @ViewChild("alertContainer", { read: ViewContainerRef }) container;
  componentRef: ComponentRef<any>;
  dashBoardImages:Array<any>;
  imageModalRef;
  imgURL;
  isCollapsedFilter = false;
  showSpinner = false;

  constructor(private modalService: BsModalService,private dashboardService: DashboardService, private resolver: ComponentFactoryResolver, private amplifyService: AmplifyService, public router: Router) { }

  createComponent(imageDetails) {
    
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(InputBoxComponent);

    this.componentRef = this.container.createComponent(factory);

    this.componentRef.instance.imageDetails = imageDetails;

    this.componentRef.instance.tagOutput.subscribe(event => {
      if(event != "error"){
        this.onFilterSearch();
      }
      this.container.clear();
    });

  }
  
  openImageUploadModal(imageModal: TemplateRef<any>) {
    this.imageModalRef = this.modalService.show(imageModal);
  }

  imagetag = new imageTag();

  onFaceImageSelected(event){
   
    this.imagetag.image = <File>event.target.files[0];; 

    var reader = new FileReader();

    reader.readAsDataURL(this.imagetag.image);

    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }

  }

  refershNewFaceModal(){
    this.imageModalRef.hide();
    this.imagetag = new imageTag();
    this.imgURL = null;
  }

  onFaceUpload(){

    if (this.imagetag.tag && this.imagetag.image) {
      this.showSpinner = true;
      this.dashboardService.uploadTaggedImage(this.imagetag, this.user.idToken).subscribe(data => {
          this.refershNewFaceModal();
         
          setTimeout(() => {
            this.onFilterSearch();
            this.showSpinner = false;
          }, 3000);

      },err => {
          this.showSpinner = false;
        if (err.status == 401) {
          this.signOut();
        }
      });
    } else {
      alert("Please Select Image and Tag")
    }

  }

  // refreshImageData(tagDetails){
  //     for (let image in this.dashBoardImages) {
  //       console.log(this.dashBoardImages[image])
  //       this.dashBoardImages[image]["bounding_box"].forEach((box, index) => {
  //         if (box.userId == tagDetails.faceId){
  //           console.log(image, this.dashBoardImages);
  //           box["userName"] = tagDetails.tag;
  //           this.dashBoardImages[image]["bounding_box"][index] = box;
  //           debugger;
  //         }
  //       });
  //     }
  // }
  
  ngOnDestroy() {
    if(this.componentRef){
      this.componentRef.destroy();
    }
  }

  filter = new Filter();

  onFilterSearch(){
    this.showSpinner = true;
    this.dashboardService.filterImages(Object.assign({}, this.filter), this.user.idToken).subscribe(
      data => {
        this.showSpinner = false;
        this.dashBoardImages = data.body;
          if (!this.dashBoardImages.length){
            alert("No Images with the given filter");
          }
      },
      err => {
        this.showSpinner = false;
        if (err.status == 401){
          this.signOut();
        }
      });
  }

  title = 'Chat Bot';
  user: User;

  getFaces(boundingBox){
    return boundingBox.map(e => {
      if (e.taggedTime != -1){
        return `${e.userName} (${new Date(e.taggedTime * 1000).toLocaleDateString("en-US")})`
      }else{
        return `Unknown`
      }
  
    }).join(", ")
  }

  ngOnInit() {
    Auth.currentSession().then(session => {
      this.user = {
        username: session.getIdToken().payload["cognito:username"],
        email: session.getIdToken().payload['email'],
        phone_number: session.getIdToken().payload['phone_number'],
        cognitoId: session.getIdToken().payload['sub'],
        idToken: session.getIdToken()["jwtToken"]
      };
      
      this.onFilterSearch();
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

  getTextCoordinates(boxCoordinates){
    if(boxCoordinates.top_c < 10){
      boxCoordinates.top_c += boxCoordinates.f_height + 20; 
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
    
    console.log("Rectangle Canvas")
    
    
    image["boundedBox"].forEach(boundedbox => {
        let boxCoordinates = this.getBoxCoordinates(boundedbox,img);
        context.beginPath();
        context.rect(boxCoordinates.left_c, boxCoordinates.top_c, boxCoordinates.f_width, boxCoordinates.f_height);
        context.lineWidth = 2;
        context.strokeStyle = '#d7d7d7';
        context.stroke();

        if(boundedbox.tagged){
          context.font = "20px Arial";
          context.fillStyle = "red";
           this.getTextCoordinates(boxCoordinates);

          context.fillText(boundedbox.userName, boxCoordinates.left_c, boxCoordinates.top_c-5);
        }
       
    });

    canvas.addEventListener('click', (e) => {
      
      let targetCanvas = <HTMLCanvasElement>e.target || <HTMLCanvasElement>e.srcElement;

      let rect = targetCanvas.getBoundingClientRect();
      
      const clickedPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      clickedPos.x = (clickedPos.x / rect.width) * 640
      clickedPos.y = (clickedPos.y / rect.height) * 480

      const clickedMouse = {
        x: e.pageX,
        y: e.pageY,
      }

  
      console.log(clickedMouse);

      // let context = targetCanvas.getContext('2d');
      // context.beginPath();

      // context.rect(clickedPos.x, clickedPos.y, 20, 40);
      // context.lineWidth = 2;
      // context.strokeStyle = 'red';
      // context.stroke();


      function isIntersect(pos, rectangle) {
        return pos.y > rectangle.top_c && pos.y < rectangle.top_c + rectangle.f_height && pos.x > rectangle.left_c && pos.x < rectangle.left_c + rectangle.f_width;
      }

      console.log("Faces");
      console.log("Image clicked", img);

      let boxCliked = false;

      image["boundedBox"].forEach(image => {
      
          console.log("Face Details", image)
          let boxCoordinates = this.getBoxCoordinates(image, img);

        if (isIntersect(clickedPos, boxCoordinates)) {
            boxCliked = true;
            let imageDetails = {
              position: clickedMouse,
              faceId: image.userId,
              idToken:this.user.idToken
            }
            this.createComponent(imageDetails);
          }

      })

      if (!boxCliked && this.componentRef){
        this.componentRef.destroy();
      }

    });

  } 
  
  signOut() {
    this.amplifyService.auth().signOut();
    this.router.navigate(['/']);
  }

}
