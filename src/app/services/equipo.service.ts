
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Equipo } from '../models/equipo';


@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  equiposCollection: AngularFirestoreCollection<Equipo>;
  equipos: Observable<Equipo[]>;
  equipoDoc: AngularFirestoreDocument<Equipo>;
  //equipoSelected: Equipo;

  equiposCollection2: AngularFirestoreCollection<Equipo>;
  equipos2: Observable<Equipo[]>;
  equipoDoc2: AngularFirestoreDocument<Equipo>;
  equipo: Equipo[];

  constructor(public db: AngularFirestore) {

    this.equiposCollection = this.db.collection('equipos', ref => ref.orderBy('nombre', 'asc'));
    this.equipos = this.equiposCollection.snapshotChanges().pipe(map(function (actions) {
      return actions.map(a => {
        const data = a.payload.doc.data() as Equipo;
        data.id = a.payload.doc.id;

        return data;
      });
    }));
  }

  getEquipos() {
    return this.equipos;
  }

  deleteEquipo(equipo: Equipo) {

    this.equipoDoc = this.db.doc(`equipos/${equipo.id}`);
    this.equipoDoc.delete();
  }

  updateEquipo(equipo: Equipo) {
    this.equipoDoc = this.db.doc(`equipos/${equipo.id}`);
    equipo.nombre = equipo.nombre.toUpperCase();
    this.equipoDoc.update(equipo);
  }
  

  insertaEquipo(equipo: Equipo) {


    this.db.collection("equipos").add({
      nombre: equipo.nombre.toUpperCase(),
      url: equipo.url
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);

      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      })

    //equipo.nombre = equipo.nombre.toUpperCase();
    //this.equiposCollection.add(equipo);
  }

  getEquipo(uid: string) {

    const docRef = this.db.collection('equipos').doc(uid);


    /*docRef.get().toPromise().then(documentSnapshot => {
      if(documentSnapshot.exists){
        //return documentSnapshot.data() as Equipo;

        const data =documentSnapshot.data() as Equipo;
        console.log(data.nombre);
        console.log(data.url);

        return data;

      } 
    })*/

    return docRef;


    /*docRef.toPromise().then(function (doc) {
      if (doc) {
        console.log('doc here->>>');
        let aux = doc.payload.data() as Equipo;
        console.log(doc.payload.data() as Equipo);


        return aux;
      } else {
        console.log('No such document');
      }
    }).catch(function (error) {
      console.log('Error getting document ', error);
      return null;
    })*/

  }

  public getNombre(uid: string){

   this.equipoDoc2 = this.db.collection('equipos').doc(uid);

   this.equipoDoc2.valueChanges();



    
  }

  getNombre2(uid: string){
    this.equiposCollection2 = this.db.collection('equipos', ref => ref.where('id','==',uid));
    let a = this.equiposCollection.snapshotChanges().pipe(map(function (actions) {
      return actions.map(a => {
        const data = a.payload.doc.data() as Equipo;

        data.id = a.payload.doc.id;

        console.log(data.nombre)

        return data.nombre as Equipo;
      });
    }));

  }

  


}

