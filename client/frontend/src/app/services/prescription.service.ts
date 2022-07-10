import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrescriptionRecord } from "../model/prescription";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getPrescriptions() {

    const currentUser = this.authService.currentUser;
    console.log(currentUser)
    if(!currentUser) {
      return null;
    }

    return this.httpClient.get<PrescriptionRecord[]>(
      `http://localhost:8080/rest/participants/${currentUser.id}/prescriptions`
    );
  }
}
