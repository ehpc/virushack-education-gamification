import React, { Component } from 'react';
import firebase from 'firebase';

export default class TeacherRTC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // config: JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG),
      database: firebase.database().ref(),
      connections: {},
      yourId: this.props.yourId,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.readMessage = this.readMessage.bind(this);
    this.showMyFace = this.showMyFace.bind(this);
  }

  componentDidMount() {
    // firebase.initializeApp(this.state.config);
    console.log(this.props);

    this.state.database.on('child_added', (data) => {
      if (data.val()) {
        this.readMessage(data);
      }
    });

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
    console.log(data.val());
    if (data.val().message && data.val().sender) {
      const msg = JSON.parse(data.val().message);
      const { sender } = data.val();
      if (sender !== this.state.yourId) {
        if (msg.ice !== undefined) {
          const { pc } = this.state.connections[sender];
          pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        } else if (msg.sdp.type === 'offer') {
          const newConnections = this.state.connections;
          newConnections[sender] = {
            pc: new RTCPeerConnection(JSON.parse(process.env.REACT_APP_SERVERS)),
            stream: null,
          };
          this.setState({ connections: newConnections });
          const { pc } = this.state.connections[sender];
          pc.onicecandidate = (event) => {
            event.candidate
              ? this.sendMessage(
                this.state.yourId,
                sender,
                JSON.stringify({ ice: event.candidate }),
              )
              : console.log('Sent All Ice');
          };
          pc.onaddstream = (event) => {
            const newConnections = this.state.connections;
            newConnections[sender].stream = event.stream;
            this.setState({ connections: newConnections });
            this.localVideo.srcObject = event.stream;
          };
          pc.addStream(this.localVideo.srcObject);
          pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
            .then(() => pc.createAnswer())
            .then((answer) => pc.setLocalDescription(answer))
            .then(() => {
              this.sendMessage(
                this.state.yourId,
                sender,
                JSON.stringify({ sdp: pc.localDescription }),
              );
              console.log('Got offer');
            });
        }
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
