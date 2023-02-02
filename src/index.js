const express = require('express');
const res = require('express/lib/response');
var bodyParser = require('body-parser');
const app = express();
const fetch = require('node-fetch');
global.Headers = fetch.Headers;
// firebase
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const { addDoc, collection, getFirestore, getDocs } = require("firebase/firestore");
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
const db = getFirestore(appdb);
// firebase

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());;
const serverless = require("serverless-http");
const router = express.Router();
router.get('/', (req, res) => {
    (async() => {
        await getDocs(collection(db, "talent")).then(resp => {
            var list = [];
            resp.forEach(doc => {
                list.push(doc.data());
            });
            return list
                // res.setHeader('Content-Type', 'application/json');

        }).then(list => {
            res.json({ list });
        })


    })();

});

router.get('/update/:name/:surname/:email/:company_name/:e_name_surname/:occupation/:date_booked', (req, res) => {
    let name = req.params.name;
    let surname = req.params.surname;
    let email = req.params.email;
    let company_name = req.params.company_name;
    let e_name_surname = req.params.e_name_surname;
    let occupation = req.params.occupation;
    let date_booked = req.params.date_booked;

    var fromd = (date_booked).replace('-', '/').replace('-', '/').replace('-', '/').replace('-', '/').replace('-', '/');
    var full = fromd.replace('=', '-');
    console.log('full date >' + full);

    (async() => {
        try {
            const docRef = await addDoc(collection(db, "talent"), {
                talent: [
                    { name, surname, email, company_name, client_name: e_name_surname, occupation, date_booked: full }
                ]
            });

            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    })()

    res.json({ status: 200, status_text: 'success' });
});

app.use(`/.netlify/functions/index`, router);

module.exports = app;
module.exports.handler = serverless(app);