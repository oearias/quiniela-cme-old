import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

//services
import { EquipoService } from 'src/app/services/equipo.service';

import $ from 'jquery';
import { NgForm, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { Equipo } from 'src/app/models/equipo';

import { FlashMessagesService } from 'angular2-flash-messages';



@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {

  equipo = {} as Equipo;

  uid: string;

  //variables que reciben los parámetros
  //public uid: string;
  private sub: any;


  createFormGroup() {
    return new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      url: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  equipoForm: FormGroup;
  equipos = [];
  editingEquipo: Equipo;



  constructor(
    public equipoService: EquipoService,
    public router: Router,
    public route: ActivatedRoute,
    public flashMensaje: FlashMessagesService
  ) {
    this.equipoForm = this.createFormGroup();

    this.equipoForm.setValue({
      id: '',
      nombre: '',
      url: ''
    })
  }

  ngOnInit() {
    
    //aqui leo los params
    this.sub = this.route.params.subscribe(params => {


      this.editingEquipo = params;
      if(params.id){
        this.id.setValue(params.id);
      }
      this.nombre.setValue(params.nombre);
      this.url.setValue(params.url);
    })
  }

  onResetForm() {
    this.equipoForm.reset();
  }

  onSaveForm() {

    if (this.equipoForm.valid) { //VALIDA EL FORMULARIO SEA CORRECTO
      
      
      if ((this.equipoForm.value.id!= null && (this.equipoForm.value.id.length > 0))) {
        this.equipoService.updateEquipo(this.equipoForm.value);
        this.flashMensaje.show('<i class="fas fa-check-circle"></i> Equipo <strong>modificado</strong> correctamente',{cssClass : 'alert-info', timeOut: 3000});
      } else {
        this.equipoService.insertaEquipo(this.equipoForm.value);
        this.flashMensaje.show('<i class="fas fa-check-circle"></i> Equipo <strong>insertado</strong> correctamente',{cssClass : 'alert-success', timeOut: 3000});

      }
    }


    this.onResetForm();
    this.router.navigate(['/dashboard/equipos']);

  }


  get id() { return this.equipoForm.get('id'); }
  get nombre() { return this.equipoForm.get('nombre'); }
  get url() { return this.equipoForm.get('url'); }

  volver() {
    this.router.navigate(['/dashboard/equipos']);
  }





}
