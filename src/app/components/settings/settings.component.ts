import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

//models
import { Setting } from 'src/app/models/setting';

import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  createFormGroup() {
    return new FormGroup({
      id: new FormControl(''),
      titulo: new FormControl('', [Validators.required, Validators.minLength(5)]),
      fechaCierre: new FormControl('', [Validators.required]),
      costo: new FormControl('', [Validators.required, Validators.minLength(2)]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  settingsForm: FormGroup;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public settingService: SettingService,
  ) { 
    this.settingsForm = this.createFormGroup();
  }

  ngOnInit() {

    this.settingService.getSetting().snapshotChanges().subscribe(setting =>{
      let st = setting.payload.data() as Setting;
      this.titulo.setValue(st.titulo);
      this.fechaCierre.setValue(st.fechaCierre);
      this.costo.setValue(st.costo);
      this.telefono.setValue(st.telefono);
    });
  }

  onSaveForm() {

    console.log(this.settingsForm.value);

    if (this.settingsForm.valid) { //VALIDA EL FORMULARIO SEA CORRECTO
      //siempre inserta sobre el mismo registro
      this.settingService.insertaSetting(this.settingsForm.value);
    }

    this.onResetForm();
    this.router.navigate(['/dashboard/partidos']);
  }

  onResetForm() {
    this.settingsForm.reset();
  }

  get id() { return this.settingsForm.get('id'); }
  get titulo() { return this.settingsForm.get('titulo'); }
  get fechaCierre() { return this.settingsForm.get('fechaCierre'); }
  get costo() { return this.settingsForm.get('costo'); }
  get telefono() { return this.settingsForm.get('telefono'); }


  volver() {
    this.router.navigate(['/dashboard/partidos']);
  }

}
