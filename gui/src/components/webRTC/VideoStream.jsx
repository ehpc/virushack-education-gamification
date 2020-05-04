import React, { Component } from "react";

export default class VideoStream extends Component {
  constructor() {
    super();
    this.state = {
      localStream: {},
    };
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: { min: 160, ideal: 640, max: 1280 },
          height: { min: 120, ideal: 360, max: 720 },
        },
      })
      .then((stream) => (this.localVideo.srcObject = stream));
  }

  render() {
    return <video autoPlay muted ref={(video) => (this.localVideo = video)} />;
  }
}
