# Medicine Blockchain Ledger
This is a blockchain-based client application to fight against the medicines black market. To read our report follow this [link]()

![](https://imgur.com/X4QACuJ.png)

## 🚀 Fast travel
1. [🛠 Forging the fabric network](https://github.com/DeefDeMeef/medicine-blockchain-ledger#-forging-the-fabric-network)
2. [🎬 Part 1: before we start](https://github.com/DeefDeMeef/medicine-blockchain-ledger#-part-1-before-we-start)
3. [🏎 Part 2: Starting up the engine](https://github.com/DeefDeMeef/medicine-blockchain-ledger#-part-2-starting-up-the-engine)
4. [✍🏼 Part 3: OAuth2.0 configuaration](https://github.com/DeefDeMeef/medicine-blockchain-ledger#-part-3-oauth20-configuaration)
5. [📦 Part 4: Install dependencies](https://github.com/DeefDeMeef/medicine-blockchain-ledger#-part-4-install-dependencies)
6. [👽 Part 5: Adding the first user to the wallet](https://github.com/DeefDeMeef/medicine-blockchain-ledger#-part-5-adding-the-first-user-to-the-wallet)
7. [🔮 Part 6: See the magic work](https://github.com/DeefDeMeef/medicine-blockchain-ledger#-part-6-see-the-magic-work)
8. [📧 Part 7: Use the API to interact with the blockchain](https://github.com/DeefDeMeef/medicine-blockchain-ledger#-part-7-use-the-api-to-interact-with-the-blockchain)
9. [🪪 License](https://github.com/DeefDeMeef/medicine-blockchain-ledger#-license)


## 🛠 Forging the fabric network
To make the private blockchain work we need a local Fabric network to test on. We'll start right away but before that can happen you need to clone the repository on your machine.

### 🎬 Part 1: before we start
Clone this repo with git, if you don't have git installed use the following commands first.
```
sudo apt update
sudo apt install git
```
Check if the installation succeeded.
```
git --version
Example output: git version 2.17.1
```
If all this is correct, we can clone the application repo with the following command.
```
git clone https://github.com/DeefDeMeef/medicine-blockchain-ledger.git
```

To work with the [Fabric Network](https://github.com/hyperledger/fabric-samples) we also need their repo. clone this repo with the following comment.
```
git clone https://github.com/hyperledger/fabric-samples.git
```

The last part we need for a succesfull installation is [Docker](https://www.docker.com/). Follow [this](https://www.docker.com/get-started/) link to download it from their website.


#### 🤨 What is in my package?
This repo contains 3 folders with the following components of the ledger.

1. **Chaincode:** the logic of the blockchain network.
2. **Client/backend:** a backend application (REST API) that allows users to interact with the blockchain network.
3. **Client/frontend:** An Angular application that interacts with the backend.

### 🏎 Part 2: Starting up the engine
In this step we will start the blockchain network. Make sure you execute the following commands correctly.
First go to the <code>fabric-samples</code> folder that we cloned in part 1 of the installation and go into the
<code>fabric-samples/test-network</code> folder.

Execute the following command to setup a network:
```
./network.sh up createChannel -ca -s couchdb 
```

If you want to stop this network at any time simply use this command:
```
./network.sh down 
```

#### ⛓ Deploying the chaincode
A chaincode is a container to deploy code on the Hyperledger Fabric blockchain network. This must be done in the 
<code>fabric-samples/test-network</code> folder.
```
./network.sh deployCC -ccn medicine-tracking -ccp [base-folder]/medicine-blockchain-ledger/chaincode -ccv 1 -ccs 1 -ccl javascript 
```

Where [base-folder] is the location where you cloned the repositories, medicine-tracking is the name of the chaincode, the parameter -ccl javascript is the language used to write the chaincode. The parameter -ccv 1 and -ccs 1 refers to the version and sequence. **If you change something in your chaincode and wants to redeploy, you should increment these values.**

### ✍🏼 Part 3: OAuth2.0 configuaration
For this part you need a Google account. 

1. Open the [Google APIs & Services Console](https://console.cloud.google.com/projectselector2/apis/dashboard?supportedpurview=project)
2. To access the OAuth2.0 feature, you should create a project. You can click the "create project" button to inform your project details
3. Go to **Credentials**
4. Select *Create Credentials* > *OAuth Client ID*. To use this feature, you should configure a consent screen. You can choose for an external account, and fill basic information such as the application name, and contact information.
4. Select Web Application
5. Give a name to the Web Application
6. Inform *http://localhost:4200* in Authorised JavaScript origins field
7. Inform *http://localhost:4200/auth/google/callback* in the Authorised redirect URIs field
8. A new configuration will be created and shown in the table
9. Select the download option of the newly created config. A JSON file will be generated
10. Move this file to the */client/backend/src/auth* folder with the name **oauth2.keys.json**

### 📦 Part 4: Install dependencies
Using the terminal window, execute the following command in the **client/backend** folder:

```
npm --logevel=error install
```

Do the same command in the **client/frontend** folder. This should install all the required dependencies in node_modules.

### 👽 Part 5: Adding the first user to the wallet

The administrator of an organisation can issue certificates to new users. You will need that to create the participants of the medicine tracking network such as doctors, pharmacies and ofcourse patients. Thus, you should export the admin certificate to the **client/backend/wallet** folder. To do so, execute the following operation:

```
node src/enrollAdmin.js
```

This command logs in to the certificate authority of organisation 1 and download the certificate of the administrator of org1, and add it to the *wallet* folder. 

Note: If you run this command again, you should manually remove the previous certificate file of the admin user(*admin.id*). Otherwise, the system will generate an error message telling that the certificate already exists.

### 🔮 Part 6: See the magic work
Now you are ready to run the actual application. To do so run the following command in **client/backend**:
```
npm start
```
Expected output:
```
> backend@1.0.0 start
> ./node_modules/nodemon/bin/nodemon.js src/app.js

[nodemon] 2.0.18
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node src/app.js`
listening on port 8080
Done connecting to network.
```

#### 🎨 Run the frontend application
You should install Angular first. If you do not have it yet, run the following command in your terminal:

```
npm install -g @angular/cli
```

To run the application, you should first install dependencies if you didn't do it yet in the root folder of the front-end application.

```
npm --logevel=error install
```

Then, you can start a local server, by running this command in the root folder of the front-end application.

```
ng serve
```

After start-up you can access the application from [http://localhost:4200](http://localhost:4200).

After login the home page will show the generated Json Web Token from Google. It should be used in the postman calls.

### 📧 Part 7: Use the API to interact with the blockchain
If everything is running correctly and installed as explained then we should be able to make requests to the server to interact with the blockchain. Dont forget to give the auth token with every request you do.

A handy tool to make these request is [Postman](https://www.postman.com/downloads/)
You can import the requests by the following link in Postman
```
https://www.getpostman.com/collections/7498393f09417a317def
```

```json
Creating prescription

POST http://localhost:8080/rest/prescription
{
    "timestamp": "11/07/2022",
    "medicineId": "TEST",
    "quantity": "10",
    "expiration": "12/07/2022",
    "patientId": "patient@gmail.com",
    "doctorId": "doctor@gmail.com",
    "hospitalId": "WKZ"
}
```

```json
Getting prescriptions

GET http://localhost:8080/rest/participants/daveyzaal93@gmail.com/prescriptions
{}
```

```json
Getting prescriptions

PUT http://localhost:8080/rest/prescription/:prescriptionId/pickedup
{
  "participantId": "doctor@gmail.com"
}
```

## 🪪 License
[MIT]()
