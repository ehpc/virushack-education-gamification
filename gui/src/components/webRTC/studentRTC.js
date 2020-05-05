import React, { Component } from 'react';
import firebase from 'firebase';

export default class StudentRTC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: JSON.parse(process.env.REACT_APP_FIREBASE_RTC_SIGNAL_CONFIG),
      database: firebase.database().ref(),
      pc: new RTCPeerConnection(JSON.parse(process.env.REACT_APP_SERVERS)),
      loading: true,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.readMessage = this.readMessage.bind(this);
    this.showMyFace = this.showMyFace.bind(this);
    this.showFriendsFace = this.showFriendsFace.bind(this);
  }

  componentDidMount() {
    const { yourId } = this.props;
    // firebase.initializeApp(this.state.config);
    this.state.database.on('child_added', this.readMessage);
    this.state.pc.onaddstream = ((event) => {
      this.setState({ loading: false });
      this.localVideo.srcObject = event.stream;
    });
    const newPC = this.state.pc;
    newPC.onicecandidate = (event) => (event.candidate
      ? this.sendMessage(yourId, JSON.stringify({ ice: event.candidate }))
      : console.log('Sent All Ice'));
    this.setState({ pc: newPC });
    this.showMyFace();
  }

  sendMessage(senderId, data) {
    const msg = this.state.database.push({ sender: senderId, message: data });
    msg.remove();
  }

  readMessage(data) {
    if (data.val().message && data.val().receiver) {
      const { yourId } = this.props;
      const msg = JSON.parse(data.val().message);
      const { receiver } = data.val();
      if (receiver === yourId) {
        if (msg.ice != undefined) {
          this.state.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        } else if (msg.sdp.type == 'answer') {
          this.state.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          console.log('Got Answer');
        }
      }
    }
  }

  showFriendsFace() {
    const { yourId } = this.props;
    this.state.pc
      .createOffer()
      .then((offer) => this.state.pc.setLocalDescription(offer))
      .then(() => {
        this.sendMessage(
          yourId,
          JSON.stringify({ sdp: this.state.pc.localDescription }),
        );
        console.log('Offer sent');
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
    if (this.state.loading) {
      return <img id="video" className={this.props.className} src="/img/samples/student-webcam-example.jpg" alt="Изображение из камеры" />;
    } return (
      <video id="video" className={this.props.className} autoPlay muted ref={(video) => (this.localVideo = video)} />
    );
  }
}
