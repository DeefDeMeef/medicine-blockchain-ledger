import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionRecordComponent } from "./prescription-list.component";

describe('PrescriptionRecordComponent', () => {
  let component: PrescriptionRecordComponent;
  let fixture: ComponentFixture<PrescriptionRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
