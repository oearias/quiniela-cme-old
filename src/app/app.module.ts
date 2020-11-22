import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Route } from '@angular/router';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { NgFallimgModule } from 'ng-fallimg';  //image break 
import { ImgFallbackModule } from 'ngx-img-fallback';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';  //filtro
import { FlashMessagesModule } from 'angular2-flash-messages';

//firebase

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

//firestore

import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';

//storage
import { AngularFireStorageModule } from '@angular/fire/storage';

//components
import { AppComponent } from './app.component';
import { PlanillaComponent } from './components/planilla/planilla.component';
import { EquiposComponent } from './components/equipos/equipos.component';
import { EquipoListComponent } from './components/equipos/equipo-list/equipo-list.component';
import { EquipoComponent } from './components/equipos/equipo/equipo.component';
import { PartidosComponent } from './components/partidos/partidos.component';
import { PartidoComponent } from './components/partido/partido.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

//services

import { EquipoService } from './services/equipo.service';
import { PartidoService } from './services/partido.service';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';

//auth
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { UsersComponent } from './components/users/users.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserComponent } from './components/user/user.component';



const routes: Route[] =[
  {path: '', component : PlanillaComponent}, 
  {path: 'equipos', component: EquiposComponent, canActivate: [AuthGuard]},
  {path: 'equipo', component: EquipoComponent, canActivate: [AuthGuard]},
  {path: 'partidos', component: PartidosComponent, canActivate: [AuthGuard]},
  {path: 'partido', component: PartidoComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], 
  children: [{path:'', redirectTo: 'partidos', pathMatch:'full'},
    {path:'partidos', component:PartidosComponent, canActivate: [AuthGuard]},
    {path:'equipos', component:EquiposComponent, canActivate: [AuthGuard]},
    {path:'partido', component:PartidoComponent, canActivate: [AuthGuard]},
    {path:'equipo', component:EquipoComponent, canActivate: [AuthGuard]},
    {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
    {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]}]
  },
  {path: 'login', component:LoginComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
]

@NgModule({
  declarations: [
    AppComponent,
    PlanillaComponent,
    EquiposComponent,
    EquipoListComponent,
    EquipoComponent,
    PartidosComponent,
    PartidoComponent,
    DashboardComponent,
    SettingsComponent,
    LoginComponent,
    UsersComponent,
    ProfileComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule, 
    RouterModule.forRoot(routes),
    FlashMessagesModule.forRoot(),
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgFallimgModule.forRoot({
      default: 'assets/images/noLogo.png'
    }),
    ImgFallbackModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    AngularFireAuthModule

  ],
  exports: [RouterModule],
  providers: [
    EquipoService,
    PartidoService,
    AuthService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
