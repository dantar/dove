import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Html5Qrcode } from "html5-qrcode"

@Component({
  selector: '[app-qr-code-popup]',
  templateUrl: './qr-code-popup.component.html',
  styleUrls: ['./qr-code-popup.component.scss']
})
export class QrCodePopupComponent implements OnInit, OnDestroy {

  cameraId: string;
  scanner: any;
  devices: CameraDevice[];
  device: CameraDevice;
  code: string;
  ratio = 1.0;
  emergency = '';
  noCamera: boolean;

  @Output() qrcode = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.noCamera = false;
    this.initCamera();
  }

  private initCamera() {
    this.noCamera = false;
    Html5Qrcode.getCameras().then((devices:any) => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        this.devices = devices;
        if (this.devices.length === 1) {
          this.startCamera(this.devices[0]);
        }
        // .. use this to start scanning.
      }
    }).catch((err:any) => {
      this.handleErrors();
      console.log(err);
      // handle err
    });
  }

  handleErrors() {
    this.stopCamera();
    this.noCamera = true;
  }

  clickNoCamera() {
    if (this.scanner) {
      this.stopCamera();
    }
    this.noCamera = true;
  }

  clickCancel() {
    this.cancel.emit();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  startCamera(device: CameraDevice) {
    this.device = device;
    if (this.scanner) {
      this.stopCamera();
    };
    this.scanner = new Html5Qrcode("reader");
    this.scanner.start(
      device.id,     // retreived in the previous step.
      {
        fps: 2,     // sets the framerate to 10 frame per second
        qrbox: 250,
        aspectRatio: this.ratio,
        //qrbox: Math.min(window.innerHeight, window.innerWidth),  // sets only 250 X 250 region of viewfinder to
                    // scannable, rest shaded.
      },
      (qrCodeMessage:any) => {
        // do something when code is read. For example:
        this.code = qrCodeMessage;
        this.stopCamera();
        this.okCode(qrCodeMessage);
      },
      (errorMessage:any) => {
        // parse error, ideally ignore it. For example:
        // console.log(`QR Code no longer in front of camera.`);
      })
    .catch((err:any) => {
      // Start failed, handle it. For example,
      console.log(`Unable to start scanning, error: ${err}`);
    });
  }

  clickDevice(device: CameraDevice) {
    this.noCamera = false;
    this.startCamera(device);
  }

  stopCamera() {
    if (this.scanner) {
      this.scanner.stop()
      .then((ignore:any) => {
      })
      .catch((error:any) => {
        console.log('stop error', error);
      })
      this.scanner.clear();
    }
    this.scanner = null;
  }

  readerStyle() {
    let h = window.innerHeight;
    let w = window.innerWidth;
    let lower = Math.min(h, w);
    let upper = Math.max(h, w);
    return {width: `${0.9 * Math.min(upper, lower * this.ratio)}px`};
  }

  emergencyCode(code: string) {
    this.okCode(code);
  }

  okCode(code: string) {
    console.log(code);
    this.qrcode.emit(code);
  }

}

class CameraDevice {
  id: string;
  label: string;
}