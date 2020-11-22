import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service'; 
import { PartidoService} from '../../services/partido.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  imageDefault = '/assets/images/noUser.jpg';

  public nombreUsuario: string;
  public emailUsuario: string;
  public uid: string;
  public url: string;
  public numPartidos;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    public userService: UsersService,
    public partidoService: PartidoService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe( auth => {
      if(auth){

        //obtenemos los datos de autenticacion
        this.emailUsuario = auth.email;
        this.uid = auth.uid;

        this.userService.getUsers().subscribe(item => {
          item.forEach(user =>{
            if(auth.uid==user.uid){

              this.nombreUsuario=user.nombre+" "+user.apellido;
              this.url=user.url;


            }
          })
        })
      }
    });

    this.partidoService.getPartidos().subscribe(partidos => {
      this.numPartidos = partidos.length;
    });


  }

  goToPartidos() {
    this.router.navigate(['/partidos']);
  }

  goToEquipos() {
    this.router.navigate(['/equipos']);
  }

  onClickLogOut() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  onClickProfile(uid:string){
    this.router.navigate(['/dashboard/profile',{uid:uid}]);
  }

}

