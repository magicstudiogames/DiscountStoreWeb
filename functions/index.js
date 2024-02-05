const admin = require("firebase-admin");
const serviceAccountKey = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: "https://discount-store-android-default-rtdb.firebaseio.com"
});