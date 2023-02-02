// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAmXX9Z2gRT3pDF5LpV-mDNlOQLeUuGKA",
    authDomain: "grey-1a5e6.firebaseapp.com",
    projectId: "grey-1a5e6",
    storageBucket: "grey-1a5e6.appspot.com",
    messagingSenderId: "913849587315",
    appId: "1:913849587315:web:e51d80891a6ae79878bc06",
    measurementId: "G-5ZY8SB37L3"
};

// Initialize Firebase
const appdb = initializeApp(firebaseConfig);
const analytics = getAnalytics(appdb);
const db = getFirestore(appdb);



app.get('/', (req, res) => {
    res.send(`<h1>hello</h1>`);
});

app