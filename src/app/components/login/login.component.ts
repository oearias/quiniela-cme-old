import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;

  constructor(
    public authService : AuthService,
    public router : Router,
    public flashMensaje : FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onLoginUser(){
    this.authService.loginUser(this.email, this.password)
    .then((res) => {
      //this.flashMensaje.show('<strong>¡Bien hecho! </strong><i>Usuario logueado correctamente</i>', {cssClass : 'alert-success', timeout: 3000});
      this.router.navigate(['/dashboard']);
    }).catch((err) => {
      console.log(err);
      //this.flashMensaje.show(err.message, {cssClass : 'alert-danger', timeout: 4000});
    });
  }

}

