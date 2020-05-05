import React, { Component } from 'react';
import predict from './predict';
import db from '../../models/db'

import * as tf from '@tensorflow/tfjs';
import * as handTrack from 'handtrackjs';
import * as faceapi from 'face-api.js';

const { updateUserState, onUsers } = db;
const actions = [
  'ask',
  'ask',
  'yes',
  'yes',
  'no',
  'no',
  'here',
  'left',
];

// const actions = [
//   'Поднял руку(л)',
//   'Поднял руку(п)',
//   'Всё понятно(л)',
//   'Всё понятно(п)',
//   'Ничё не понятно(л)',
//   'Ничё не понятно(п)',
//   'Не вижу ваши ручки',
//   'Отошёл',
// ];

export default class TeacherRTC extends Component {
  constructor() {
    super();
    this.state = {
      localStream: {},
      imgName: '',
      action: '',
    };
  }

  async componentDidMount() {
    faceapi.nets.ssdMobilenetv1.loadFromUri('/face-models')
    faceapi.loadFaceDetectionModel('/face-models');
    // faceapi.loadFaceExpressionModel('/face-models');
    
    let mobilenet = await tf.loadLayersModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    mobilenet = tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
    const model = await tf.loadLayersModel('http://localhost:3000/gest-model/model.json');
  

    // navigator.mediaDevices
    //   .getUserMedia({
    //     audio: true,
    //     video: {
    //       width: { min: 160, ideal: 640, max: 640}, //640, max: 1280 },
    //       height: { min: 120, ideal: 540, max: 540}, //360, max: 720 },
    //     },
    //   })
    //   .then((stream) => {
        console.log('stream');
        setInterval(() => {
          const src = this.snapshot();
          predict(src, mobilenet, model, tf, handTrack, faceapi)
            .then((prediction) => {
              if(prediction !== 6) {
                updateUserState('user_6am0979eykqw4cc', actions[prediction]);
              }
              // console.log(actions[prediction])
            });
        }, 3300);
        setTimeout(() => this.localVideo.src ='1.webm', 100)
        // return this.localVideo.srcObject = stream;
      // })
  }

  snapshot() {
    var video = this.localVideo; //document.querySelector('video');
    var canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    const src = canvas.toDataURL('image/jpg');
    return src;
  }

  render() {
    return <div>
      <video autoPlay muted ref={(video) => (this.localVideo = video)} videowidth='640' videoheight='540' />
      {/* <video autoPlay muted ref={(video) => (this.localVideo = video)} /> */}
    </div>
  }
}
