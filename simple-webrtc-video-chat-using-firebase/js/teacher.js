//Create an account on Firebase, and use the credentials they give you in place of the following
const config = {
  apiKey: "AIzaSyCEy_Mh-mM4CevqQ2Au7JGealnndtirj4c",
  authDomain: "uchilka-5e065.firebaseapp.com",
  databaseURL: "https://uchilka-5e065.firebaseio.com",
  projectId: "uchilka-5e065",
  storageBucket: "uchilka-5e065.appspot.com",
  messagingSenderId: "460642119976",
  appId: "1:460642119976:web:de89ed0d1a9e7b8e65e01d",
  measurementId: "G-W5MVK1GE24",
};
firebase.initializeApp(config);

var database = firebase.database().ref();
var yourVideo = document.getElementById("yourVideo");
var yourId = Math.floor(Math.random() * 1000000000);
var servers = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:numb.viagenie.ca",
      credential: "BrhAySAeBwlQ",
      username: "mitrafantos@gmail.com",
    },
  ],
};
var connections = {};

function sendMessage(senderId, receiverId, data) {
  var msg = database.push({
    sender: senderId,
    receiver: receiverId,
    message: data,
  });
  msg.remove();
}

function readMessage(data) {
  var msg = JSON.parse(data.val().message);
  var sender = data.val().sender;
  if (sender != yourId) {
    if (msg.ice != undefined) {
      var pc = connections[sender];
      pc.addIceCandidate(new RTCIceCandidate(msg.ice));
    } else if (msg.sdp.type == "offer") {
      connections[sender] = new RTCPeerConnection(servers);
      var pc = connections[sender];
      //   navigator.mediaDevices
      //     .getUserMedia({ audio: true, video: true })
      //     .then((stream) => pc.addStream(stream))
      //     .then(() =>
      //       pc
      //         .setRemoteDescription(new RTCSessionDescription(msg.sdp))
      //         .then(() => pc.createAnswer())
      //         .then((answer) => pc.setLocalDescription(answer))
      //         .then(function () {
      //           sendMessage(yourId, sender, JSON.stringify({ sdp: pc.localDescription }));
      //           console.log("Got offer");
      //         })
      //   );
      pc.onicecandidate = (event) => {
        console.log("in ice candidate");
        event.candidate
          ? sendMessage(
              yourId,
              sender,
              JSON.stringify({ ice: event.candidate })
            )
          : console.log("Sent All Ice");
      };
      pc.addStream(yourVideo.srcObject);
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        .then(() => pc.createAnswer())
        .then((answer) => pc.setLocalDescription(answer))
        .then(function () {
          sendMessage(
            yourId,
            sender,
            JSON.stringify({ sdp: pc.localDescription })
          );
          console.log("Got offer");
        });
    }
  }
}

database.on("child_added", readMessage);

function showMyFace() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => (yourVideo.srcObject = stream));
}
