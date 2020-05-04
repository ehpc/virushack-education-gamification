import React, { Component } from "react";
import firebase from "firebase";

export default class studentRTC extends Component {
  constructor(props) {
    super(props);
    state = {
      config: JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG),
      database: firebase.database().ref(),
      connections: {},
    };
  }

  componentDidMount() {
    const yourId = this.props.yourId;
    firebase.initializeApp(this.state.config);
    this.state.database.on("child_added", this.readMessage);
    showMyFace();
  }

  sendMessage(senderId, receiverId, data) {
    const msg = database.push({
      sender: senderId,
      receiver: receiverId,
      message: data,
    });
    msg.remove();
  }

  readMessage(data) {
    const yourId = this.props.yourId;
    const msg = JSON.parse(data.val().message);
    const sender = data.val().sender;
    if (sender != yourId) {
      if (msg.ice != undefined) {
        const { pc } = this.state.connections[sender];
        pc.addIceCandidate(new RTCIceCandidate(msg.ice));
      } else if (msg.sdp.type == "offer") {
        this.state.connections[sender] = {
          pc: new RTCPeerConnection(JSON.parse(process.env.REACT_APP_SERVERS)),
          stream,
        };
        const { pc, stream } = this.state.connections[sender];
        pc.onicecandidate = (event) => {
          event.candidate
            ? this.sendMessage(
                yourId,
                sender,
                JSON.stringify({ ice: event.candidate })
              )
            : console.log("Sent All Ice");
        };
        pc.onaddstream = function (event) {
          stream = event.stream;
        };
        pc.addStream(this.localVideo.srcObject);
        pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
          .then(() => pc.createAnswer())
          .then((answer) => pc.setLocalDescription(answer))
          .then(function () {
            this.sendMessage(
              yourId,
              sender,
              JSON.stringify({ sdp: pc.localDescription })
            );
            console.log("Got offer");
          });
      }
    }
  }

  showMyFace() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => (this.localVideo.srcObject = stream));
  }

  render() {
    return <video autoPlay muted ref={(video) => (this.localVideo = video)} />;
  }
}
