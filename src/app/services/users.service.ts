import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  userDoc: AngularFirestoreDocument<User>;

  constructor(public db: AngularFirestore) { 
    this.usersCollection = this.db.collection('users', ref => ref.orderBy('nombre', 'asc'));
    this.users = this.usersCollection.snapshotChanges().pipe(map(function (actions) {
      return actions.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;

        return data;
      });
    }));
  }

  getUsers() {
    return this.users;
  }

  insertaUser(user: User) {

    if(!user.url){
      user.url="asdf"
    }


    this.db.collection("users").add({
      nombre: user.nombre,
      apellido: user.apellido,
      uid: user.uid,
      url: user.url
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);

      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      })
  }

  updateUser(user: User) {
    this.userDoc = this.db.doc(`users/${user.id}`);
    user.nombre = user.nombre;
    user.apellido = user.apellido;
    this.userDoc.update(user);
  }

  updateUserByUrl(user: User){
    console.log(user.url);
  }

  deleteUser(user: User) {

    this.userDoc = this.db.doc(`users/${user.id}`);
    this.userDoc.delete();
  }

  getUser(uid: string){
    console.log(uid);
    return this.db.collection('users', ref => ref.where('uid','==',uid));
    //`partidos/${partido.id}`
  }
}
