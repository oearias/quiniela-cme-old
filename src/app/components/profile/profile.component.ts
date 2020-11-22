import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { NgForm, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import $ from 'jquery';

import * as firebase from 'firebase/app';
import 'firebase/storage' 

//services
import { UsersService } from 'src/app/services/users.service';
import { FotoService } from '../../services/foto.service';

//models
import { User } from 'src/app/models/user';
import { Foto } from 'src/app/models/foto';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  imageDefault = '/assets/images/noUser.jpg';

  user = {} as User;

  labelInputFile = "Seleccionar Archivo...";

  selectedFiles: FileList;
  fotoActual: Foto;

  uid: string;
  private sub: any;
  urlCircle: string;
  public file: any;

  uploadPercent: Observable<number>;
  urlImage: Observable<string>;

  progress: number;
  finalizado: boolean;

  modoEditable = false;



  createFormGroup() {
    return new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
      url: new FormControl('')
    });
  }

  userForm: FormGroup;

  users = [];
  editingUser: User;

  constructor(
    public userService: UsersService,
    public fotoService: FotoService,
    public router: Router,
    public route: ActivatedRoute,
    public flashMensaje: FlashMessagesService,
    private storage: AngularFireStorage
  ) {
    this.userForm = this.createFormGroup();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {

      this.userService.getUser(params.uid).snapshotChanges().subscribe(user => {
        user.forEach(item => {
          const dt = item.payload.doc.data() as User;

          this.id.setValue(dt.id);
          this.uid = params.uid;
          this.nombre.setValue(dt.nombre);
          this.apellido.setValue(dt.apellido);
          this.url.setValue(dt.url);
          this.urlCircle = dt.url;
          this.modoEditable = true;
        })
      })
    })
    

  }

  onSaveForm() {

    console.log(this.userForm.value)

    
    if (this.userForm.valid) { //VALIDA EL FORMULARIO SEA CORRECTO
      if ((this.userForm.value.id != null && (this.userForm.value.id.length > 0))) {

        if (this.urlImage) {
          console.log("entra a validacion");
          let urlAux = (<HTMLInputElement>document.getElementById("urlInput")).value;
          this.userForm.value.url = this.urlImage;

          console.log(this.userForm.value)
          //this.url.setValue(urlAux);
        }

        this.userService.updateUser(this.userForm.value);
        this.flashMensaje.show('<i class="fas fa-check-circle"></i> Perfil <strong>modificado</strong> correctamente', { cssClass: 'alert-info', timeOut: 3000 });

      }
    }

    //this.onResetForm();
    this.router.navigate(['/dashboard/profile',{uid:this.uid}]);
  }

  onResetForm() {
    this.userForm.reset();
  }

  volver() {
    this.router.navigate(['/dashboard/partidos']);
  }

  detectFiles(event) {

    const file = event.target.files[0];
    if (file) {

      //this.loading=true;
      this.file = file;
      $("#uploadBtn").prop("disabled", false);
      this.labelInputFile = file.name;

      this.onUpload();
      //this.loading=false;

    }
  }

  onUpload() {

    const uid = this.uid;
    //const file = this.file.target.files[0];
    const fileName = this.file.name;
    const fileNameNew = this.fotoService.setName(fileName, uid);
    const filePath = "fotos/" + fileNameNew;
    const ref = this.storage.ref(filePath);
   
   
    //const task = this.storage.upload(filePath, this.file);
    //this.uploadPercent = task.percentageChanges();
    //task.percentageChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();

    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(filePath).put(this.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        //foto.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        var snapshotRef = snapshot as firebase.storage.UploadTaskSnapshot;
        var bytesTransferred;
        bytesTransferred = (snapshotRef).bytesTransferred;
        var totalBytes = (snapshotRef).totalBytes;
        this.progress = Math.round((bytesTransferred / totalBytes) * 100); //redondeamos el progress

        if(totalBytes==bytesTransferred){
          this.finalizado=true;
        }
      
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success


        uploadTask.snapshot.ref.getDownloadURL().then(snap =>{
          return snap;
        }).then(url =>{
          const urla = url;

          console.log(url);

          this.urlImage=url;
          
          this.flashMensaje.show('<i class="fas fa-check-circle"></i> Imágen <strong>cargada</strong> correctamente, por favor ahora presione GUARDAR.', {cssClass : 'alert-success', timeout: 7000});
          $("#subir").prop("disabled", true);

        }).catch();
        
        
      }
    );
  }

  

  get id() { return this.userForm.get('id'); }
  get nombre() { return this.userForm.get('nombre'); }
  get apellido() { return this.userForm.get('apellido'); }
  get url() { return this.userForm.get('url'); }

}
