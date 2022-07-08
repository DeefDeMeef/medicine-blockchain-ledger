import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Participant } from 'src/app/model/participant';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  participant:Participant = new Participant();
  
  loginUrl: string;

  @ViewChild('f', null)
  myForm: NgForm;

  constructor(private authService: AuthService, private router:Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.authService.getIssuerAuthURL().subscribe( (data) => {
      this.loginUrl = data['url'];
    })
  }

}
