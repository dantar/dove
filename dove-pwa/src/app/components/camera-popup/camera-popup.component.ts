import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: '[app-camera-popup]',
  templateUrl: './camera-popup.component.html',
  styleUrls: ['./camera-popup.component.scss']
})
export class CameraPopupComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("capture") capture: ElementRef;
  @ViewChild("photo") photo: ElementRef;
  @Output() picture = new EventEmitter<string>();

  stream: MediaStream;
  jpg: string;
  clicked: boolean;

  constructor() { }

  ngOnDestroy(): void {
    if (this.stream) {
      let tracks = this.stream.getTracks();
      tracks.forEach(t => t.stop());
    }
  }

  ngAfterViewInit(): void {
    this.clicked = false;
    console.log(this.capture);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: { facingMode: "environment" }}).then((stream) => {
        this.stream = stream;
        this.capture.nativeElement.srcObject = stream;
        let streamh = stream.getVideoTracks()[0].getSettings().height;
        let captureh = this.capture.nativeElement.clientHeight;
        console.log (captureh, streamh);
        let cam = this.capture.nativeElement as HTMLVideoElement;
        console.log(cam, cam.clientHeight, cam.clientWidth);
      });
    }
  }

  ngOnInit(): void {
  }

  clickVideo(event: any) {
    //this.clicked = true;
    let selfie = document.createElement('canvas');
    let video = this.capture.nativeElement;
    selfie.width = 300;
    selfie.height = 300;
    //selfie.width = video.videoWidth;
    //selfie.height = video.videoHeight;
    let c2d = selfie.getContext("2d");
    if (c2d) {
      c2d.drawImage(video, 100, 100, 300, 300, 0,0,300,300);
      //selfie.getContext("2d").drawImage(this.alice.nativeElement, 0, 0);
      //this.photo.nativeElement.src = selfie.toDataURL("image/webp");
      this.jpg = selfie.toDataURL("image/jpeg");
      console.log(this.jpg);
      //this.savePicture();
      this.picture.emit(this.jpg);
    }
  }

  clickImage(event: any) {
    this.savePicture();
  }

  savePicture() {
    let anchor = document.createElement('a'); // new HTMLAnchorElement();
    anchor.href = this.jpg;
    //anchor.href = this.photo.nativeElement.src;
    anchor.download = 'selfie.jpeg';
    anchor.click();
  }

}
