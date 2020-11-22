import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Setting } from '../models/setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(public db: AngularFirestore) { }

  insertaSetting(setting: Setting) {

    let id = "setting-1"

    this.db.collection('setting').doc(id).set({
      titulo: setting.titulo.toUpperCase(),
      fechaCierre: setting.fechaCierre,
      costo: setting.costo,
      telefono: setting.telefono
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", id);

      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      })

    //equipo.nombre = equipo.nombre.toUpperCase();
    //this.equiposCollection.add(equipo);
  }

  getSetting(){
    return this.db.collection('setting').doc('setting-1');
  }
}
