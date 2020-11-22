import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { map, filter, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData$: Observable<firebase.User>

  constructor(
    public afAuth: AngularFireAuth
  ) {
    this.userData$ = afAuth.authState;
   }

  loginUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email,pass)
      .then( userData => resolve(userData),
      err => reject(err));
    })
  }

  getAuth() {

    //return this.afAuth.authState.pipe(map(auth => auth))
    return this.afAuth.authState.pipe(map(auth => auth));

    
  }

  logout() {
    return this.afAuth.auth.signOut();
  }
}
