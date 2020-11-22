import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

//models
import { Partido } from '../models/partido';
import { Equipo } from '../models/equipo';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { DocumentReference } from '@firebase/firestore-types';
import { compileDirectiveFromRender2 } from '@angular/compiler/src/render3/view/compiler';


@Injectable({
  providedIn: 'root'
})
export class PartidoService {

  partidoList: AngularFireList<any>;
  document: DocumentReference;

  partidosCollection: AngularFirestoreCollection<Partido>;
  partidos: Observable<Partido[]>;
  partidoDoc: AngularFirestoreDocument<Partido>;

  equiposCollection: AngularFirestoreCollection<Equipo>;
  equipos: Observable<Equipo[]>;


  constructor(public db: AngularFirestore) {

    this.partidosCollection = this.db.collection('partidos', ref => ref.orderBy('numero'));

    this.partidos = this.partidosCollection.snapshotChanges().pipe(
      map (function (actions) {
      return actions.map(a => {

        const data = a.payload.doc.data() as Partido;
        data.id = a.payload.doc.id;



        return data;
      });
    }));

  }

  getPartidos() {
    return this.partidos;
  }


  getPartidosComplete() {


    let collectionRef = this.db
      .collection('partidos');

    collectionRef.get().toPromise().then(snapshot => {
      snapshot.forEach(partido => {
        const userDocData = partido.data() as Partido;


        console.log(userDocData);


        return userDocData;

        /*Object.keys(data).forEach(userDocId => {
      
          let ref2 = this.db.collection('equipos', ref => ref.where('id','==',userDocData.local))
          ref2.get().toPromise().then(equiposSnapshot => {
            equiposSnapshot.forEach(item =>{
              var equipoDocData = item.data() as Equipo;
              data['local']=equipoDocData.nombre;
              data['urlLocal']=equipoDocData.url;
            })
          });
        })*/

      })


      /*Object.keys(data).forEach(userDocId => {
        let ref2 = this.db.collection('equipos', ref => ref.where('local', '==', userDocId));

        ref2.get().toPromise().then(eventsForUserSnapshot => {
          eventsForUserSnapshot.forEach((eventDoc => {
            var eventDocData = eventDoc.data;

            console.log(eventDocData);

          }))
        })
      });*/




    });

  }


  insertaPartido(partido: Partido) {

    this.db.collection("partidos").add({
      numero: partido.numero,
      local: partido.local,
      visitante: partido.visitante
    })
      .then(function (docRef) {
        console.log("Partido written with ID: ", docRef.id);

      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      })
  }

  updatePartido(partido: Partido) {

    this.partidoDoc = this.db.doc(`partidos/${partido.id}`);
    this.partidoDoc.update(partido);
  }

  deletePartido(partido: Partido) {

    this.partidoDoc = this.db.doc(`partidos/${partido.id}`);
    this.partidoDoc.delete();
  }


}

