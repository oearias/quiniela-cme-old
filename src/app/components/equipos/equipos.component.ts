import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

//models
import { Equipo } from '../../models/equipo';

//service
import { EquipoService } from '../../services/equipo.service';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {

  public equipos = [];
  public p;
  public searchText;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public equipoService: EquipoService,
    public flashMensaje: FlashMessagesService
  ) {

  }

  ngOnInit() {

    this.equipoService.getEquipos().subscribe(equipos => {
      this.equipos = equipos;
    })
  }

  createEquipo() {
    this.router.navigate(['/dashboard/equipo']);
  }

  editEquipo(equipo: Equipo) {
    this.router.navigate(['/dashboard/equipo', equipo]);
  }

  onDelete(event, equipo) {
    var r = confirm("¿Está ud. seguro que desea eliminar este Equipo?")
    if (r == true) {
      this.equipoService.deleteEquipo(equipo);
      this.flashMensaje.show('<i class="fas fa-trash-alt"></i> Equipo <strong>eliminado</strong> correctamente',{cssClass : 'alert-danger', timeOut: 3000});
    }
  }

  public metodoP(p){
    return p;
  }


}
