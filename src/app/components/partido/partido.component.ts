import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

//models
import { Partido } from 'src/app/models/partido';

//service
import { PartidoService } from 'src/app/services/partido.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { NgOption } from '@ng-select/ng-select';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.css']
})
export class PartidoComponent implements OnInit {

  //public equipos = Equipo[0];

  uid: string;

  //variables que reciben los parámetros
  private sub: any;

  //no image
  imageDefault = 'assets/images/noLogo.png';
  equipos = [];
  editingPartido: Partido;


  createFormGroup() {
    return new FormGroup({
      id: new FormControl(''),
      numero: new FormControl('', [Validators.required, Validators.minLength(1)]),
      local: new FormControl('', [Validators.required, Validators.minLength(3)]),
      visitante: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  partidoForm: FormGroup;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public equipoService: EquipoService,
    public partidoService: PartidoService,
    public flashMensaje: FlashMessagesService
  ) {
    this.partidoForm = this.createFormGroup();


  }

  ngOnInit() {

    this.equipoService.getEquipos().subscribe(equipos => {
      this.equipos = equipos;
    })

    /*

    this.equipoService.getEquipos()
      .snapshotChanges()
      .subscribe(equipos => {
        this.equipos = [];
        equipos.forEach(item => {
          let z = item.payload.toJSON();


          z['$key'] = item.key;
          this.equipos.push(z as Equipo);

        })
      })


    //-----------

    */

    //aqui leo los params




    this.sub = this.route.params.subscribe(params => {

      let numero = parseInt(params.numero);  //nos aseguramos que sea un valor numérico

      this.editingPartido = params;
      if (params.id) {
        this.id.setValue(params.id);
      }
      this.numero.setValue(numero),
        this.local.setValue(params.local),
        this.visitante.setValue(params.visitante)
    })

  }

  onResetForm() {
    this.partidoForm.reset();
  }

  onSaveForm() {

    if (this.partidoForm.valid) { //VALIDA EL FORMULARIO SEA CORRECTO
      if ((this.partidoForm.value.id != null && (this.partidoForm.value.id.length > 0))) {

        this.partidoService.updatePartido(this.partidoForm.value);
        this.flashMensaje.show('<i class="fas fa-check-circle"></i> Partido <strong>modificado</strong> correctamente',{cssClass : 'alert-info', timeOut: 3000});
      } else {
        console.log(this.partidoForm.value);
        this.partidoService.insertaPartido(this.partidoForm.value);
        this.flashMensaje.show('<i class="fas fa-check-circle"></i> Partido <strong>insertado</strong> correctamente',{cssClass : 'alert-success', timeOut: 3000});
      }
    }

    this.onResetForm();
    this.router.navigate(['/dashboard/partidos']);
  }

  volver() {
    this.router.navigate(['/dashboard/partidos']);
  }

  get id() { return this.partidoForm.get('id'); }
  get numero() { return this.partidoForm.get('numero'); }
  get local() { return this.partidoForm.get('local'); }
  get visitante() { return this.partidoForm.get('visitante'); }

}
