export class PrescriptionRecord {
  key: string;
  record: Prescription;
}

export class Prescription {
  currentState: string;
  doctorId: string;
  expiration: string;
  hospitalId: string;
  medicineId: string;
  patientId: string;
  pharmacyId: string;
  prescriptionId: string;
  quantity: string;
  timestamp: string;
  type: string;
}


            // "currentState": "READY",
            // "doctorId": "daveyzaal93@gmail.com",
            // "expiration": "12/07/2022",
            // "hospitalId": "WKZ",
            // "medicineId": "pcmol",
            // "patientId": "davey@flatlineagency.com",
            // "pharmacyId": "Boogaard",
            // "prescriptionId": "Prescription:pcmol:davey@flatlineagency.com",
            // "quantity": "30",
            // "timestamp": "08/07/2022",
            // "type": "Prescription"