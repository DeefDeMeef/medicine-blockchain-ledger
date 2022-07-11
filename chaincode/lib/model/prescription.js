/*
 * Representation of an Egg Box Asset
 * Author: MFK
 */

'use strict';

const medicineStatus = {
  READY_FOR_PICKUP: "READY",
  PICKED_UP: "PICKED_UP"
};


const State = require('./state.js');

class Prescription extends State {
  constructor(timestamp, medicineId, quantity, expiration, patientId, doctorId, hospitalId, pharmacyId) {
    super("Prescription");
    this.setTimestamp(timestamp);
    this.setMedicineId(medicineId);
    this.setQuantity(quantity);
    this.setExpiration(expiration);
    this.setPatientId(patientId);
    this.setDoctorId(doctorId);
    this.setHospitalId(hospitalId);
    this.setPharmacyId("null");
    this.setReadyForPickup();
  }

  /* Basic Getters */

  getTimestamp() {
    return this.timestamp;
  }

  getMedicineId() {
    return this.medicineId;
  }

  getQuantity() {
    return this.quantity;
  }

  getExpiration() {
    return this.expiration;
  }

  getPatientId() {
    return this.patientId;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getHospitalId() {
    return this.hospitalId;
  }

  getPharmacyId() {
    return this.pharmacyId;
  }

  /** basic setters */

  setTimestamp(timestamp) {
    this.timestamp = timestamp;
  }

  setMedicineId(medicineId) {
    this.medicineId = medicineId;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  setExpiration(expiration) {
    this.expiration = expiration;
  }

  setPatientId(patientId) {
    this.patientId = patientId;
  }

  setDoctorId(doctorId) {
    this.doctorId = doctorId;
  }

  setHospitalId(hospitalId) {
    this.hospitalId = hospitalId;
  }

  setPharmacyId(pharmacyId) {
    this.pharmacyId = pharmacyId;
  }

  // setters and getters for status
  setReadyForPickup() {
    this.currentState = medicineStatus.READY_FOR_PICKUP;
  }

  setPickedUp() {
    this.currentState = medicineStatus.PICKED_UP;
  }

  isReadyForPickup() {
    return this.currentState === medicineStatus.READY_FOR_PICKUP;
  }

  isPickedUp() {
    return this.currentState === medicineStatus.PICKED_UP;
  }

  /**
   * Returns an object from a buffer. Normally called after a getState
   * @param {*} buffer
   */
  static deserialise(buffer) {
    const values = JSON.parse(buffer.toString());
    const prescription = new Prescription();
    Object.assign(prescription, values);
    return prescription;
  }
}

module.exports = Prescription;