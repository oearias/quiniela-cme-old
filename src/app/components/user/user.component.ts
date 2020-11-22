import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormControl, FormGroup, Validators } from '@angular/forms';

//services
import { UsersService } from 'src/app/services/users.service';

//models
import { User } from '../../models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private sub: any;

  createFormGroup() {
    return new FormGroup({
      id: new FormControl(''),
      uid: new FormControl('', [Validators.required, Validators.minLength(3)]),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  userForm: FormGroup;
  users = [];
  editingUser: User;

  constructor(
    public userService: UsersService,
    public router: Router,
    public route: ActivatedRoute,
    public flashMensaje: FlashMessagesService) {
      
      this.userForm = this.createFormGroup();
     }

  ngOnInit() {
    //aqui leo los params
    this.sub = this.route.params.subscribe(params => {


      this.editingUser = params;
      if(params.id){
        this.id.setValue(params.id);
      }
      this.uid.setValue(params.uid);
      this.nombre.setValue(params.nombre);
      this.apellido.setValue(params.apellido);
    })
  }

  onResetForm() {
    this.userForm.reset();
  }

  onSaveForm() {

    console.log(this.userForm.value);

    if (this.userForm.valid) { //VALIDA EL FORMULARIO SEA CORRECTO
      
      
      if ((this.userForm.value.id!= null && (this.userForm.value.id.length > 0))) {
        this.userService.updateUser(this.userForm.value);
        this.flashMensaje.show('<i class="fas fa-check-circle"></i> Usuario <strong>modificado</strong> correctamente',{cssClass : 'alert-info', timeOut: 3000});
      } else {
        this.userService.insertaUser(this.userForm.value);
        this.flashMensaje.show('<i class="fas fa-check-circle"></i> Usuario <strong>insertado</strong> correctamente',{cssClass : 'alert-success', timeOut: 3000});

      }
    }


    this.onResetForm();
    this.router.navigate(['/dashboard/users']);

  }

  get id() { return this.userForm.get('id'); }
  get nombre() { return this.userForm.get('nombre'); }
  get apellido() { return this.userForm.get('apellido'); }
  get uid() { return this.userForm.get('uid'); }

  volver() {
    this.router.navigate(['/dashboard/users']);
  }

}
