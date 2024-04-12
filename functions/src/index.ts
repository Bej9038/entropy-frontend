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
import axios from "axios";

admin.initializeApp();
const corsHandler = cors({origin: true});

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

exports.consumeCredit = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const firestore = admin.firestore();
    const idToken = request.headers.authorization?.slice(7) ?? "";
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

exports.sendGenReq = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer JZTOUADUXNL7BBELM84Y6INBGDHANBEOR81NU5TF",
    };
    const url = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/run";
    const req = request.body.req;
    const axiosResponse = await axios.post(url, req, {headers});
    const currentReqId = axiosResponse.data.id;
    response.send({currentReqId: currentReqId});
  });
});
