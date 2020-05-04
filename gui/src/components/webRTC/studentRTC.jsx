import React, { Component } from "react";
import firebase from "firebase";

export default class studentRTC extends Component {
  constructor(props) {
    super(props);
    state = {
      config: JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG),
      database: firebase.database().ref(),
      pc: new RTCPeerConnection(JSON.parse(process.env.REACT_APP_SERVERS)),
    };
  }

  componentDidMount() {
    const yourId = this.props.yourId;
    firebase.initializeApp(this.state.config);
    this.state.database.on("child_added", this.readMessage);
    this.state.pc.onicecandidate = (event) =>
      event.candidate
        ? this.sendMessage(yourId, JSON.stringify({ ice: event.candidate }))
        : console.log("Sent All Ice");
    showMyFace();
  }

  sendMessage(senderId, data) {
    const msg = this.state.database.push({ sender: senderId, message: data });
    msg.remove();
  }

  readMessage(data) {
    const yourId = this.props.yourId;
    const msg = JSON.parse(data.val().message);
    const receiver = data.val().receiver;
    if (receiver === yourId) {
      if (msg.ice != undefined) {
        this.state.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
      } else if (msg.sdp.type == "answer") {
        this.state.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        console.log("Got Answer");
      }
    }
  }

  showFriendsFace() {
    const yourId = this.props.yourId;
    this.state.pc
      .createOffer()
      .then((offer) => this.state.pc.setLocalDescription(offer))
      .then(() => {
        sendMessage(
          yourId,
          JSON.stringify({ sdp: this.state.pc.localDescription })
        );
        console.log("Offer sent");
      });
  }

  showMyFace() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => this.state.pc.addStream(stream))
      .then(() => {
        this.showFriendsFace();
      });
  }

  render() {
    return <video autoPlay muted ref={(video) => (this.localVideo = video)} />;
  }
}
