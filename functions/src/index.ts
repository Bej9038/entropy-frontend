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

const apiKey = "JZTOUADUXNL7BBELM84Y6INBGDHANBEOR81NU5TF";
const runAsync = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/run";
const cancel = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/cancel/";
const status = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/status/";
const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + apiKey,
};

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

exports.sendGenReq = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const firestore = admin.firestore();
    const req = request.body.req;
    const idToken = request.headers.authorization?.slice(7) ?? "";
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const creditsRef = firestore.collection("credits").doc(uid);
    const doc = await creditsRef.get();
    await creditsRef.update({
      num_credits: doc.get("num_credits") - req.input.num_audio/2,
    });

    // send req, send back id

    const url = runAsync;
    const axiosResponse = await axios.post(url, req, {headers});
    const currentReqId = axiosResponse.data.id;

    response.send({currentReqId: currentReqId});
  });
});

exports.checkReq = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const url = status + request.body.reqId;
    const req = {"input": {}};
    const axiosResponse = await axios.post(url, req, {headers});
    const statusResult = axiosResponse.data;
    response.send(statusResult);
  });
});

exports.cancelReq = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const req = {"input": {}};
    const url = cancel + request.body.reqId;
    await axios.post(url, req, {headers});
  });
});
