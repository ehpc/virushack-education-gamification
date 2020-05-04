import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import predict from './predict';

const actions = [
  'Поднял руку(л)',
  'Поднял руку(п)',
  'Всё понятно(л)',
  'Всё понятно(п)',
  'Ничё не понятно(л)',
  'Ничё не понятно(п)',
  'Не вижу ваши ручки',
  'Отошёл',
];

export default class TeacherRTC extends Component {
  constructor() {
    super();
    this.state = {
      localStream: {},
      imgName: '',
      action: '',
    };
  }

  componentDidMount() {
    faceapi.nets.ssdMobilenetv1.loadFromUri('/face-models')
    faceapi.loadFaceDetectionModel('/face-models');
    // faceapi.loadFaceExpressionModel('/face-models');
  

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: { min: 160, ideal: 640, max: 1280 },
          height: { min: 120, ideal: 360, max: 720 },
        },
      })
      .then((stream) => {
        // console.log(stream);
        setInterval(() => {
          const src = this.snapshot();
          predict(src).then((prediction) => console.log(actions[prediction]));
        }, 5000);
        return this.localVideo.srcObject = stream;
      })
  }

  snapshot() {
    var video = document.querySelector("video");
    var canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    context.drawImage(video, 0, 0, width, height);
  
    const src = canvas.toDataURL('image/jpg');
    // const img = new Image();
    // img.src = src;
    return src;
  }

  render() {
    return <div>
      <video autoPlay muted ref={(video) => (this.localVideo = video)} />
      <button onClick={this.snapshot}>SNAPSHOT!</button>
      <div id='x'></div>
    </div>
  }
}
