/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import * as functions from "firebase-functions";
import * as cors from "cors";
import * as admin from "firebase-admin";

admin.initializeApp();
const corsHandler = cors({origin: true});

exports.helloWorld = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    response.send("Hello from Firebase!");
  });
});

// Credits

exports.initCreditsOnSignUp = functions.auth.user().onCreate(async (user) => {
  const firestore = admin.firestore();
  const creditsRef = firestore.collection("credits").doc(user.uid);
  const doc = await creditsRef.get();
  if (!doc.exists) {
    await creditsRef.set({
      num_credits: 25,
      email: user.email,
    });
  }
});

exports.decrementCredit = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const firestore = admin.firestore();
    // @ts-ignore
    const idToken = request.headers.authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const creditsRef = firestore.collection("credits").doc(uid);
    const doc = await creditsRef.get();
    const creditsToDecrement = request.body.credits;
    await creditsRef.update({
      num_credits: doc.get("num_credits") - creditsToDecrement,
    });
  });
});
