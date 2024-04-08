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

export const helloWorld = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    response.send("Hello from Firebase!");
  });
});

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
