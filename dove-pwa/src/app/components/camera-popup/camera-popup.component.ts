import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: '[app-camera-popup]',
  templateUrl: './camera-popup.component.html',
  styleUrls: ['./camera-popup.component.scss']
})
export class CameraPopupComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("capture") capture: ElementRef;
  @ViewChild("photo") photo: ElementRef;
  @ViewChild("videocontainer") videocontainer: ElementRef;
  @Output() picture = new EventEmitter<string>();
  @Output() exit = new EventEmitter<string>();

  stream: MediaStream;
  deviceId: string;
  jpg: string;
  clicked: boolean;
  devices: MediaDeviceInfo[];
  videoelement: HTMLVideoElement;
  trimmer: VideoTrimmer;
  style: {[prop: string]: string};

  constructor(
    private shared: SharedDataService,
  ) { }

  ngOnInit(): void {
    this.style = {};
    this.devices = [];
  }

  ngOnDestroy(): void {
    if (this.stream) {
      let tracks = this.stream.getTracks();
      tracks.forEach(t => t.stop());
    }
  }

  ngAfterViewInit(): void {
    this.clicked = false;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        this.devices = devices.filter(d => d.kind === 'videoinput');
        if (this.devices.length > 0) {
          let match = this.devices.filter(d => d.deviceId === this.shared.settings.camera);
          if (match.length > 0) {
            this.startCamera(match[0]);
          } else {
            this.startCamera(this.devices[0]);
          }
        }
      })
      ;
      return;
    }
  }

  removeVideo() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    let div = this.videocontainer.nativeElement as HTMLDivElement;
    while(div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }

  startCamera(device: MediaDeviceInfo) {
    this.shared.settings.camera = device.deviceId;
    this.shared.updateSettings(this.shared.settings);
    this.removeVideo();
    this.videoelement = document.createElement('video');
    (this.videocontainer.nativeElement as HTMLDivElement).appendChild(this.videoelement);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      //let c: MediaTrackConstraints = {deviceId: device.deviceId};
      navigator.mediaDevices.getUserMedia({video: {deviceId: device.deviceId}}).then((stream) => {
        this.startStream(stream);
      });
    }
  }

  startStream(stream: MediaStream) {
    this.stream = stream;
    this.videoelement.srcObject = stream;
    this.videoelement.autoplay = true;
    this.trimmer = new VideoTrimmer(stream.getVideoTracks()[0]);
    this.style = this.trimmer.style();
    this.trimmer.fixVideo(this.videoelement);
    console.log("style", this.style);
  }

  snapshot() {
    let canvas = this.trimmer.drawImage(this.videoelement);
    this.jpg = canvas.toDataURL("image/jpeg");
    this.picture.emit(this.jpg);
  }

  clickVideo(event: any) {
    this.snapshot();
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

  toggleDevice() {
    let index = this.devices.map(d => d.deviceId).indexOf(this.shared.settings.camera);
    if (index >= 0) {
      this.startCamera((index >= this.devices.length-1) ? this.devices[0] : this.devices[index + 1]);
    }
  }

  clickNoCamera() {
    this.exit.emit();
  }

}

export class VideoTrimmer {

  pictureSize = 300;

  track: MediaStreamTrack;
  settings: MediaTrackSettings;
  layout: 'portrait' | 'landscape';
  ts: number;
  top: number;
  left: number;
  th: number;
  tw: number;
  vh: number;
  vw: number;
  vs: number;
  scale: number;
  shift: number;

  constructor(track: MediaStreamTrack) {
    this.track = track;
    this.vh = window.innerHeight;
    this.vw = window.innerWidth;
    this.vs = Math.min(this.vh, this.vw);
    this.settings = this.track.getSettings();
    if (this.settings.height && this.settings.width) {
      this.th = this.settings.height;
      this.tw = this.settings.width;
      this.ts = Math.min( this.th, this.tw);
      this.scale = this.vs / this.ts;
      this.shift = this.vs / 2;
      if (this.settings.height > this.settings.width) {
        this.layout = 'portrait';
        this.top = (this.vh - this.vs) / 2;
        this.left = 0;
      } else {
        this.layout = 'landscape';
        this.top = 0;
        this.left = (this.vw - this.vs) / 2;
      }
    }
  }

  style(): {[prop: string]: string} {
    return {
      'margin-left': `${this.left}px`, 
      'margin-top': `${this.top}px`, 
      width: `${this.vs}px`, 
      height: `${this.vs}px`, 
      overflow: 'hidden',
    }; 
  }

  fixVideo(video: HTMLVideoElement) {
    video.style.marginLeft = `${-this.left}px`;
    video.style.marginTop = `${-this.top}px`;
  }

  drawImage(videoelement: HTMLVideoElement): HTMLCanvasElement {
    let canvas = document.createElement('canvas');
    canvas.width = this.pictureSize;
    canvas.height = this.pictureSize;
    let c2d = canvas.getContext("2d");
    if (c2d) {
      c2d.drawImage(videoelement, (this.tw - this.ts) / 2, (this.th - this.ts) / 2, this.ts, this.ts, 0,0,this.pictureSize,this.pictureSize);
    }
    return canvas;
  }

}