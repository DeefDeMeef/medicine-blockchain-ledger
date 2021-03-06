'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const OAuth2Data = require('./auth/oauth2.keys.json');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let eventHandler = require('./event-handler.js');
let network = require('./fabric/network.js');

const oAuth2Client = new google.auth.OAuth2(OAuth2Data.web.client_id, 
    OAuth2Data.web.client_secret,
    OAuth2Data.web.redirect_uris[0]);

// Creating an Google OAuth2 client object

/**
 * Register a participant
 * An authentication token is mandatory
 * 
 * {"id":"F1","name":"Farmer 1","role":"Farmer"}
 */
app.post('/rest/participants', async (req, res) => {

    const validToken = await network.validateToken(req,oAuth2Client,OAuth2Data);

    if(!validToken) {
        res.status(401).json({ message: 'invalid token'} );
        return;
    }
    
    // creating the identity for the user and add it to the wallet
    let response = await network.registerUser(req.body.id,req.body.bsn, req.body.name, req.body.role);

    if (response.error) {
        res.status(400).json({ message: response.error });
    } else {

        
        let adminUser = await network.getAdminUser();

        let networkObj = await network.connectToNetwork(adminUser);

        if (networkObj.error) {
            res.status(400).json({ message: networkObj.error });
        }

        let invokeResponse = await network.createParticipant(
          networkObj,
          req.body.id,
          req.body.bsn,
          req.body.name,
          req.body.role
        );

        if (invokeResponse.error) {
            res.status(400).json({ message: invokeResponse.error });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).send(invokeResponse);
        }
    }
});

/**
 * An authentication
 */
app.post('/rest/participants/auth', async (req, res) => {

    const validToken = await network.validateToken(req,oAuth2Client,OAuth2Data);

    if(!validToken) {
        res.status(401).json({ message: 'invalid token'} );
        return;
    }

    let networkObj = await network.connectToNetwork(req.body.id);

    if (networkObj.error) {
        res.status(400).json({ message: networkObj.error });
        return;
    }

    let invokeResponse = await network.getParticipant(networkObj, req.body.id);

    if (invokeResponse.error) {
        res.status(400).json({ message: invokeResponse.error });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(invokeResponse);
    }
});

// prescriptions ophalen voor een specifieke patient
app.get("/rest/participants/:participantId/prescriptions", async (req, res) => {
  const validToken = await network.validateToken(req, oAuth2Client, OAuth2Data);

  if (!validToken) {
    res.status(401).json({ message: "invalid token" });
    return;
  }

  let networkObj = await network.connectToNetwork(req.params.participantId);

  if (networkObj.error) {
    res.status(400).json({ message: networkObj.error });
    return;
  }

  let invokeResponse = await network.query(networkObj, req.params.participantId, "queryPrescriptions");

  if (invokeResponse.error) {
    res.status(400).json({ message: invokeResponse.error });
  } else {
    console.log("res: ", invokeResponse);
    console.log("networkObj: ", networkObj);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(invokeResponse);
  }
});

app.post("/rest/medicineboxes", async (req, res) => {
  const validToken = await network.validateToken(req, oAuth2Client, OAuth2Data);

  if (!validToken) {
    res.status(401).json({ message: "invalid token" });
    return;
  }

  let networkObj = await network.connectToNetwork(req.body.doctorId);

  if (networkObj.error) {
    res.status(400).json({ message: networkObj.error });
  }

  let invokeResponse = await network.medicine(
    networkObj,
    req.body.doctorId,
    req.body.medicineId,
    req.body.medicineName,
    req.body.quantity
  );

  if (invokeResponse.error) {
    res.status(400).json({ message: invokeResponse.error });
  } else {
    res.setHeader("Content-Type", "application/json");
    res.status(201).send(invokeResponse);
  }
});

app.post("/rest/prescription", async (req, res) => {
  const validToken = await network.validateToken(req, oAuth2Client, OAuth2Data);

  if (!validToken) {
    res.status(401).json({ message: "invalid token" });
    return;
  }

  let networkObj = await network.connectToNetwork(req.body.doctorId);

  if (networkObj.error) {
    res.status(400).json({ message: networkObj.error });
  }

  let invokeResponse = await network.prescription(
    networkObj,
    req.body.timestamp,
    req.body.medicineId,
    req.body.quantity,
    req.body.expiration,
    req.body.patientId,
    req.body.doctorId,
    req.body.hospitalId
    );

  if (invokeResponse.error) {
    res.status(400).json({ message: invokeResponse.error });
  } else {
    res.setHeader("Content-Type", "application/json");
    res.status(201).send(invokeResponse);
  }
});

/**
 * Report damaged
 * An authentication token is mandatory
 *
 * {"participantId":"F1"}
 */
app.put('/rest/eggboxes/:precriptionId/damaged', async (req, res) => {

    const validToken = await network.validateToken(req,oAuth2Client,OAuth2Data);

    if(!validToken) {
        res.status(401).json({ message: 'invalid token'} );
        return;
    }

    let networkObj = await network.connectToNetwork(req.body.participantId);

    if (networkObj.error) {
        res.status(400).json({ message: networkObj.error });
    }

    let invokeResponse = await network.reportPickedUp(networkObj, req.params.precriptionId);

    if (invokeResponse.error) {
        res.status(400).json({ message: invokeResponse.error });
    } else {
        res.status(200).json({ message: invokeResponse });
    }
});

app.get('/rest/issuer/auth-url', async (req,res) => {

    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.email'
    });

    const result = {
        url: url
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(result));

});

app.post('/rest/issuer/validate-code', async (req,res) => {

    oAuth2Client.getToken(req.body.code, function (err, tokens) {

        if (err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ error: 'invalid token - ' + err});
        } else {

            const tokenInfo = oAuth2Client.getTokenInfo(tokens.access_token).then(
                (value) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).send({ 'email' : value.email, 'id-token': tokens.id_token });
                });
        }
    });

});

const port = process.env.PORT || 8080; 
app.listen(port);

console.log(`listening on port ${port}`);

eventHandler.createWebSocketServer();
eventHandler.registerListener(network);
