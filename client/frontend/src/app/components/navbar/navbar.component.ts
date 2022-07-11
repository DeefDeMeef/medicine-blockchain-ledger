import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { TouchSequence } from 'selenium-webdriver';
import { Router } from '@angular/router';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  constructor(private eventService: EventService, private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  isLoggedIn() {
    return this.authService.currentUser != null;
  }

  get username() {
    return this.authService.currentUser.id;
  }

  get role() {
    return this.authService.currentUser.role;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
