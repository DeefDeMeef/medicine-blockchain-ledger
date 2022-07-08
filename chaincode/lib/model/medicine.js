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

class Medicine extends State {
  constructor(doctorId, medicineId, medicineName, quantity) {
    super("Medicine");
    this.setDoctorId(doctorId);
    this.setMedicineId(medicineId);
    this.setMedicineName(medicineName);
    this.setQuantity(quantity);
    this.setReadyForPickup();
  }

  /* Basic Getters */

  getDoctorId() {
    return this.doctorId;
  }

  getMedicineId() {
    return this.medicineId;
  }

  getMedicineName() {
    return this.medicineName;
  }

  getQuantity() {
    return this.quantity;
  }

  /** basic setters */

  setDoctorId(doctorId) {
    this.doctorId = doctorId;
  }

  setMedicineId(medicineId) {
    this.medicineId = medicineId;
  }

  setMedicineName(medicineName) {
    this.medicineName = medicineName;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
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
    const medicine = new Medicine();
    Object.assign(medicine, values);
    return medicine;
  }
}

module.exports = Medicine;