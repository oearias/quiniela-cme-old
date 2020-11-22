import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Foto } from '../models/foto';

import $ from 'jquery';

import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  constructor(
    private firebase: AngularFireDatabase,
    public flashMensaje: FlashMessagesService
  ) { }

  private basePath: string = '/fotos';
  fotoList: AngularFireList<Foto[]>;

  pushUpload(foto: Foto, id: string) {

    let storageRef = firebase.storage().ref();

    console.log("store:   " + storageRef);
    let filename = this.setName(foto.file.name,null);
    let uploadTask = storageRef.child(`${this.basePath}/${filename}`).put(foto.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // upload in progress
        //foto.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        var snapshotRef = snapshot as firebase.storage.UploadTaskSnapshot;
        var bytesTransferred;
        bytesTransferred = (snapshotRef).bytesTransferred;
        var totalBytes = (snapshotRef).totalBytes;
        foto.progress = Math.round((bytesTransferred / totalBytes) * 100); //redondeamos el progress

      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        //el nombre original de la imagen es foto.nombre = foto.file.name;
        foto.nombre = filename; //el nombre con el que se guarda en la RealTime DB no puede ser generado por la funcion ya que sería otro por el momento en que fue creado
        foto.uid = id;

        uploadTask.snapshot.ref.getDownloadURL().then(snap => {
          return snap;
        }).then(url => {
          foto.url = url;

          foto.createdAt = this.formatDate();

          this.saveFileData(foto);
          console.log("File available at: " + foto.url);
          console.log("Guardado");
          this.flashMensaje.show('<i class="fas fa-check-circle"></i> Imágen <strong>subida</strong> correctamente.', { cssClass: 'alert-success', timeout: 3000 });
          $("#subir").prop("disabled", true);
        }).catch();


      }
    );
  }

  

  private saveFileData(foto: Foto) {
    console.log(foto);
    this.firebase.list(`${this.basePath}/`).push(foto);
  }

  setName(nombre: string, uid:string) {

    console.log(nombre);

    var fileName = nombre;
    var now = new Date();
    var anio = now.getFullYear().toString(); // 2011
    var mes = (now.getMonth() < 10 ? '0' : '') + now.getMonth().toString();
    var dia = (now.getDay() < 10 ? '0' : '') + now.getDay().toString();
    var hora = (now.getHours() < 10 ? '0' : '') + now.getHours().toString();
    var minutos = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes().toString();
    var segundos = (now.getSeconds() < 10 ? '0' : '') + now.getSeconds().toString();
    var mili = now.getMilliseconds().toString();

    var fecha = "IMG-" + anio + "-" + mes + "-" + dia + "-" + hora + minutos + segundos + mili;

    var ext = fileName.substr(fileName.lastIndexOf('.') + 1);

    //fileName = fecha + "." + ext;
    fileName = uid + "." + ext

    return fileName;
  }

  formatDate(): string {

    const now = new Date();
    const anio = now.getFullYear().toString(); // 2011
    const mes = (now.getMonth() < 10 ? '0' : '') + now.getMonth().toString();
    const dia = (now.getDay() < 10 ? '0' : '') + now.getDay().toString();

    var hora = (now.getHours() < 10 ? '0' : '') + now.getHours().toString();
    var minutos = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes().toString();
    var segundos = (now.getSeconds() < 10 ? '0' : '') + now.getSeconds().toString();

    //var fecha = dia+"-"+mes+"-"+anio+" "+hora+":"+minutos+":"+segundos+":"+mili;

    return `${dia}-${mes}-${anio} ${hora}:${minutos}:${segundos}`;
  }
}
