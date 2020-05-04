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
var friendsVideo = document.getElementById("friendsVideo");
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
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event) =>
  event.candidate
    ? sendMessage(yourId, JSON.stringify({ ice: event.candidate }))
    : console.log("Sent All Ice");
// pc.onicecandidate = (event) => console.log(event.candidate);
pc.onaddstream = function (event) {
  friendsVideo.srcObject = event.stream;
};

function sendMessage(senderId, data) {
  var msg = database.push({ sender: senderId, message: data });
  msg.remove();
}

function readMessage(data) {
  var msg = JSON.parse(data.val().message);
  var receiver = data.val().receiver;
  if (receiver === yourId) {
    if (msg.ice != undefined) {
      pc.addIceCandidate(new RTCIceCandidate(msg.ice));
    } else if (msg.sdp.type == "answer") {
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      console.log("Got Answer");
    }
  }
}

database.on("child_added", readMessage);

function showFriendsFace() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => pc.addStream(stream))
    .then(
      pc
        .createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          sendMessage(yourId, JSON.stringify({ sdp: pc.localDescription }));
          console.log("Offer sent");
        })
    );
}
