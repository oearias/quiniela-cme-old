import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

//models
import { Partido } from 'src/app/models/partido';
import { Equipo } from 'src/app/models/equipo';

//service
import { PartidoService } from 'src/app/services/partido.service';
import { EquipoService } from 'src/app/services/equipo.service';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css']
})
export class PartidosComponent implements OnInit {

  public partidos = [];
  public equipos = []
  public nombre;
  public numPartidos;


  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public partidoService: PartidoService,
    public equipoService: EquipoService,
    public flashMensaje: FlashMessagesService
  ) { }

  ngOnInit() {

    this.partidoService.getPartidos().subscribe(partidos => {

      partidos.forEach(a => {
        this.equipoService.getEquipos().subscribe(item => {

          item.forEach(equipoLocal => {
            if (a.local == equipoLocal.id) {
              a.local=equipoLocal.id;
              a.nombreLocal = equipoLocal.nombre;
              a.urlLocal = equipoLocal.url


            }
          });

          item.forEach(equipoVisitante => {
            if (a.visitante == equipoVisitante.id) {
              a.visitante = equipoVisitante.id;
              a.nombreVisitante = equipoVisitante.nombre;
              a.urlVisitante = equipoVisitante.url
            }
          });
        });
      });


      this.partidos = partidos;

      this.numPartidos = partidos.length;


    })


    /*this.equipos = this.equiposCollection.snapshotChanges().pipe(map(function (actions) {
      return actions.map(a => {
        const data = a.payload.doc.data() as Equipo;
        data.id = a.payload.doc.id;
        return data; 
      });
    }));*/

    /*
    this.partidoService.getPartidos()
      .snapshotChanges()
      .subscribe(partidos => {
        this.partidos = [];
        partidos.forEach(item => {
          let z = item.payload.toJSON();
          z['$key']=item.key;

          this.equipoService.getEquipo2(z['local'])
          .snapshotChanges()
          .subscribe( equipos => {
            let b = equipos.payload.toJSON();
            z['nombreEquipoLocal']=b['nombre'];

          })

          this.equipoService.getEquipo2(z['visitante'])
          .snapshotChanges()
          .subscribe( equipos => {
            let c = equipos.payload.toJSON();
            z['nombreEquipoVisitante']=c['nombre'];

          })

          this.partidos.push(z as Partido);

        })
      })*/
  }

  createPartido() {
    console.log('entra');
    this.router.navigate(['/dashboard/partido']);
  }

  editPartido(partido: Partido) {
    this.router.navigate(['/dashboard/partido', partido]);

  }

  onDelete(event, partido) {

    console.log(partido);
    var r = confirm("¿Está ud. seguro que desea eliminar este Partido? ");
    if (r == true) {
      this.partidoService.deletePartido(partido);
      this.flashMensaje.show('<i class="fas fa-check-circle"></i> Partido <strong>eliminado</strong> correctamente',{cssClass : 'alert-danger', timeOut: 3000});
    }
  }

  getNombre$(uid: string) {

  }

  getPrueba(nombre) {
    return nombre;
  }

}
