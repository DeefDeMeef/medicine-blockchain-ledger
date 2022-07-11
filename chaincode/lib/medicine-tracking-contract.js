/*
 * Medicine ledger Smart Contract
 * Author: MFK
 */

'use strict';

//import Hyperledger Fabric SDK
const { Contract } = require('fabric-contract-api');

const Prescription = require("./model/prescription.js");
const Participant = require('./model/participant.js');

class MedicineTrackingContract extends Contract {
  /**
   * createPrescription
   *
   * This transaction is started by the docotr to prescribe medication to a dedicated patient
   *
   * @param timestamp - current timestamp
   * @param medicineId - the id of the medicine
   * @param quantity - quantity of medicine
   * @param expiration - expiration date
   * @param patientId - patient id
   * @param doctorId - doctor id
   * @param hospitalId - hospital id
   * @param pharmacyId - pharmacy id
   * @returns the new prescription
   */

  async createPrescription(
    ctx,
    timestamp,
    medicineId,
    quantity,
    expiration,
    patientId,
    doctorId,
    hospitalId
  ) {
    let identity = ctx.clientIdentity;
    console.log("id: ", identity);

    let prescription = new Prescription(
      timestamp,
      medicineId,
      quantity,
      expiration,
      patientId,
      doctorId,
      hospitalId
    );

    // generate the key for the prescription
    let key = prescription.getType() + ":" + prescription.getMedicineId() + ":" + prescription.getPatientId() + ":" + prescription.getPharmacyId();

    // check if the shipment already exists in the ledger
    let prescriptionExists = await this.assetExists(ctx, key);

    if (prescriptionExists) {
      throw new Error(`Prescription with key ${key} already exists`);
    }

    // add key to help users finding object
    prescription.prescriptionId = key;

    // update state with new shipment
    await ctx.stub.putState(key, prescription.serialise());

    // create a shipmentCreated event
    const event = {
      eventName: "prescriptionCreated",
      targetAudience: [prescription.getPatientId(), prescription.getDoctorId(), prescription.getPharmacyId()], // suggested targetAudience
      prescriptionId: prescription.prescriptionId,
    };

    await ctx.stub.setEvent(event.eventName, Buffer.from(JSON.stringify(event)));

    // Return the newly created shipment
    return JSON.stringify(prescription);
  }

  /**
   * Utility function checking if a user is an admin
   * @param {*} idString - the identity object
   */
  isAdmin(identity) {
    var match = identity.getID().match(".*CN=(.*)::");
    return match !== null && match[1] === "admin";
  }

  /**
   * Utility function checking if a user is a doctor
   * @param {*} identity - the identity object
   */
  isDoctor(identity) {
    return identity.assertAttributeValue("role", "Doctor");
  }

  /**
   * Utility function checking if a user is a pharmacy
   * @param {*} identity - the identity object
   */
  isPharmacy(identity) {
    return identity.assertAttributeValue("role", "Pharmacy");
  }

  /**
   * Utility function checking if a user is a patient
   * @param {*} identity - the identity object
   */
  isPatient(identity) {
    return identity.assertAttributeValue("role", "Patient");
  }

  /**
   * Utility function to get the id of the participant
   * @param {*} id - the id of the participant
   */
  getParticipantId(identity) {
    return identity.getAttributeValue("id");
  }

  /**
   * Pickup prescription
   *
   * This transaction is executed by the pharmacy
   * when a prescription is picked up by a patient
   *
   * @param prescriptionId - The unique identifier of the prescription record
   * @returns none
   */

  async reportPickedUp(ctx, prescriptionId) {
    const buffer = await ctx.stub.getState(prescriptionId);

    // if prescription is not found
    if (!buffer || buffer.length == 0) {
      throw new Error(`Prescription with ID ${prescriptionId} not found`);
    }
    const prescription = Prescription.deserialise(buffer);

    // should not be already pickedup
    if (prescription.isPickedUp()) {
      throw new Error(`prescription with ID ${prescriptionId} is already pickde up`);
    }

    prescription.setPickedUp();
    prescription.setPharmacyId("Boogaard");

    // update world state
    await ctx.stub.putState(prescriptionId, prescription.serialise());

    return "ok";
  }

  /**
   *
   * assetExists
   *
   * Checks to see if a key exists in the world state.
   * @param assetId - the key of the asset to read
   * @returns boolean indicating if the asset exists or not.
   */
  async assetExists(ctx, assetId) {
    const buffer = await ctx.stub.getState(assetId);
    return !!buffer && buffer.length > 0;
  }

  /**
   * Create Participant
   *
   * This transaction is started by the participant during sign-up
   *
   * @param id - The participant identifier
   * @param bsn - The participant bsn
   * @param name - The participant name
   * @param role - Farmer, Shipper, or Distributor
   * @returns the newly created participant
   */
  async createParticipant(ctx, id, bsn, name, role) {
    let identity = ctx.clientIdentity;

    if (!this.isAdmin(identity)) {
      throw new Error(`Only administrators can create participants`);
    }

    // Generate a participant representation
    let participant = new Participant(id, bsn, name, role);

    // generate the key for the participant
    let key = participant.getType() + ":" + participant.getId();

    // check if the participant already exists
    let exists = await this.assetExists(ctx, key);

    if (exists) {
      throw new Error(`Participant with id ${key} already exists`);
    }

    // update state with new participant
    await ctx.stub.putState(key, participant.serialise());

    // Return the newly created shipment
    return JSON.stringify(participant);
  }

  async queryPrescriptions(ctx, id) {
    // filtering only eggboxes that are in possession or are originated from id
    console.log("this is ctx: ", ctx);

    let queryString = {
      selector: {
        type: "Prescription",
        $or: [{ doctorId: id }, { patientId: id }],
      },
    };

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

    let allResults = [],
      count = 0;

    while (true) {
      let res = await resultsIterator.next();
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        jsonRes.key = res.value.key;
        jsonRes.record = JSON.parse(res.value.value.toString("utf8"));
        allResults.push(jsonRes);
      }

      if (res.done) {
        await resultsIterator.close();
        break;
      }
    }
    return JSON.stringify(allResults);
  }

  /**
   * Get participant
   *
   * This transaction is started by the farmer that collected eggs
   * and stored them in a box
   *
   * @param id - The participant identifier
   * @returns the participant
   */
  async getParticipant(ctx, id) {
    let identity = ctx.clientIdentity;

    if (!id === this.getParticipantId(identity) && !this.isAdmin(identity)) {
      throw new Error(
        `Only administrators can query other participants. Regular participants can get information of their own account`
      );
    }

    // get participant
    const buffer = await ctx.stub.getState("Participant:" + id);

    // if participant was not found
    if (!buffer || buffer.length == 0) {
      throw new Error(`Participant with id ${id} was not found`);
    }

    // get object from buffer
    const participant = Participant.deserialise(buffer);

    // Return the newly created eggbox
    return JSON.stringify(participant);
  }
}

module.exports = MedicineTrackingContract;