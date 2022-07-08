/*
 * Representation of an Egg Box Asset
 * Author: MFK
 */

'use strict';

const State = require('./state.js');

class Participant extends State {
  constructor(id, bsn, name, role) {
    super("Participant");
    this.setId(id);
    this.setBsn(bsn);
    this.setName(name);
    this.setRole(role);
  }

  /* Basic Getters */

  getId() {
    return this.id;
  }

  getBsn() {
    return this.bsn;
  }

  getName() {
    return this.name;
  }

  getRole() {
    return this.role;
  }

  /** basic setters */

  setId(id) {
    this.id = id;
  }

  setBsn(bsn) {
    this.bsn = bsn;
  }

  setName(name) {
    this.name = name;
  }

  setRole(role) {
    this.role = role;
  }

  /**
   * Returns an object from a buffer. Normally called after a getState
   * @param {*} buffer
   */
  static deserialise(buffer) {
    const values = JSON.parse(buffer.toString());
    const participant = new Participant();
    Object.assign(participant, values);
    return participant;
  }
}

module.exports = Participant;