import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { EggBox } from 'src/app/model/eggbox';
import { PrescriptionRecord } from "src/app/model/prescription";
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: "app-prescription-list",
  templateUrl: "./prescription-list.component.html",
  styleUrls: ["./prescription-list.component.css"],
})
export class PrescriptionRecordComponent implements OnInit {
  prescriptions: PrescriptionRecord[];
  errorMessage = null;

  constructor(private service: PrescriptionService, private eventService: EventService) {}

  ngOnInit() {
    this.load();
    this.eventService.subject.subscribe(
      (msg) => this.load(),
      (err) => console.log(err),
      () => console.log("complete")
    );
  }

  load() {
    this.service.getPrescriptions().subscribe(
      (data) => {
        this.prescriptions = data;
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
      }
    );
  }
}
