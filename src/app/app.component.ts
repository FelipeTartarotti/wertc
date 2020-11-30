import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  srcObject
  title = 'web-rtc';

  async ngOnInit(): Promise<void> {

    console.log(navigator);


    const cameras = await this.getConnectedDevices('videoinput');
    console.log("Cameras connected:", cameras);

    if (cameras && cameras.length > 0) {
      const stream = await this.openCamera(cameras[0].deviceId, 640, 480);
      //this.playVideoFromCamera();
      this.playVideoFromDisplay();
    }

    this.listenDeviceChange();
  }

  //Get list of devices connected to the computer
  async getConnectedDevices(type){
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
  }

  // Listen for changes to media devices and update the list accordingly
  listenDeviceChange() {
    navigator.mediaDevices.addEventListener('devicechange', event => {
      console.log(event);
    });
  }

  // Open camera with at least minWidth and minHeight capabilities
  async openCamera(cameraId, minWidth, minHeight) {
    const constraints = {
      'audio': {'echoCancellation': true},
      'video': {
          'deviceId': cameraId,
          'width': {'min': minWidth},
          'height': {'min': minHeight}
          }
      }

  return await navigator.mediaDevices.getUserMedia(constraints);
  }

  // Play Video From Camera
  async playVideoFromCamera() {
    try {
      const constraints = {'video': true, 'audio': true};
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.srcObject = stream

      console.log(stream)

      //Get settings of video
      console.log(stream.getVideoTracks()[0].getSettings())



    } catch(error) {
        console.error('Error opening video camera.', error);
    }
  }


  async playVideoFromDisplay() {
    try {
      const constraints = {
        video: {
          cursor: 'always',
          displaySurface: 'application'
        },
      };

      const mediaDevices = navigator.mediaDevices as any;
      const stream = await mediaDevices.getDisplayMedia(constraints);

      this.srcObject = stream

      console.log(stream)

      //Get settings of video
      //console.log(navigator.mediaDevices)



    } catch(error) {
        console.error('Error opening video camera.', error);
    }
  }

  //https://webrtc.org/getting-started/media-devices


}
