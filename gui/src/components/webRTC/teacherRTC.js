import React, { Component } from "react";
import firebase from "firebase";

export default class TeacherRTC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG),
      database: firebase.database().ref(),
      connections: {},
    };
  }

  componentDidMount() {
    firebase.initializeApp(this.state.config);
    this.state.database.on("child_added", this.readMessage);
    this.showMyFace();
  }

  sendMessage(senderId, receiverId, data) {
    const msg = this.state.database.push({
      sender: senderId,
      receiver: receiverId,
      message: data,
    });
    msg.remove();
  }

  readMessage(data) {
    const { yourId } = this.props;
    const msg = JSON.parse(data.val().message);
    const { sender } = data.val();
    if (sender !== yourId) {
      if (msg.ice !== undefined) {
        const { sender } = this.state.connections;
        const { pc } = sender;
        pc.addIceCandidate(new RTCIceCandidate(msg.ice));
      } else if (msg.sdp.type === "offer") {
        const newConnections = this.state.connections;
        const { sender } = this.state.connections;
        const { pc } = sender;
        newConnections[sender] = {
          pc: new RTCPeerConnection(JSON.parse(process.env.REACT_APP_SERVERS)),
          stream: null,
        };
        this.setState({ connections: newConnections });
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
          const newConnections = this.state.connections;
          newConnections[sender].stream = event.stream;
          this.setState({ connections: newConnections });
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
