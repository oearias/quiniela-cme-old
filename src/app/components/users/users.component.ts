import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

//models
import { User } from '../../models/user';

//service
import { UsersService } from '../../services/users.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public users = [];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public userService: UsersService,
    public flashMensaje: FlashMessagesService
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  createUser() {
    this.router.navigate(['/dashboard/user']);
  }

  editUser(user: User) {
    this.router.navigate(['/dashboard/user', user]);
  }

  onDelete(event, user) {
    var r = confirm("¿Está ud. seguro que desea eliminar este Usuario?")
    if (r == true) {
      this.userService.deleteUser(user);
      this.flashMensaje.show('<i class="fas fa-trash-alt"></i> Usuario <strong>eliminado</strong> correctamente',{cssClass : 'alert-danger', timeOut: 3000});
    }
  }

}
