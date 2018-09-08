var admin = require('firebase-admin');

var serviceAccount = require("./../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-8d0fa.firebaseio.com"
});

// var config = {
//     apiKey: "AIzaSyCYuYL3wu9f4J82GjGxwJZHxgLUAEwQtHk",
//     authDomain: "test-8d0fa.firebaseapp.com",
//     databaseURL: "https://test-8d0fa.firebaseio.com",
//     projectId: "test-8d0fa",
//     storageBucket: "test-8d0fa.appspot.com",
//     messagingSenderId: "1007637328815"
//   };
//   admin.initializeApp(config);

  // const messaging=admin.messaging();

//  messaging.requestPermission().then(() =>{
//     console.log('data',messaging.gettoken());
//  }).catch(err =>{
//      console.log(err)
//  })
 
 
 
var registrationToken = '9bfda2442bf2d5e0';

// See documentation on defining a message payload.
var message = {
  data: {
    score: '850',
    time: '2:45'
  },
  token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.
console.log('aaaaaa',message)
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    // admin.messaging.gettoken();
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });