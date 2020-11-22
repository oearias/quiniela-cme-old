import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Setting } from 'src/app/models/setting';

//services
import { PartidoService } from 'src/app/services/partido.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { SettingService } from 'src/app/services/setting.service';
import { AuthService } from '../../services/auth.service';

import $ from 'jquery';

@Component({
  selector: 'app-planilla',
  templateUrl: './planilla.component.html',
  styleUrls: ['./planilla.component.css']
})
export class PlanillaComponent implements OnInit {

  imageDefault = 'assets/images/noLogo.png';

  title = 'Quiniela Carmen';
  titulo: string;
  fechaCierre: string;
  costo: number;
  telefono: number;

  public partidos = [];
  public userAuth;

  settingsForm: FormGroup;

  constructor(
    public partidoService: PartidoService,
    public equipoService: EquipoService,
    public settingService: SettingService,
    public authService: AuthService
  ) { }

  ngOnInit() {

    //verificamos si existe el usuario logueado
    this.authService.getAuth().subscribe( auth => {
      if(auth){
        
        this.userAuth = auth.uid;
      }
    });
    //

    this.settingService.getSetting().snapshotChanges().subscribe(setting => {
      let st = setting.payload.data() as Setting;
      this.titulo = st.titulo;

      let anio = st.fechaCierre.substring(0, 4);
      let dia = st.fechaCierre.substring(8, 10);
      let mes = st.fechaCierre.substring(5, 7);

      mes = this.devuelveMesLetras(mes);

      this.fechaCierre = (dia + " / " + mes + " / " + anio)

      //let auxFecha = 
      this.costo = st.costo;
      this.telefono = st.telefono
    });

    let incremental = 0;
    let b = new PlanillaComponent(null, null, null, null);

    this.partidoService.getPartidos().subscribe(partidos => {


      partidos.forEach(a => {
        this.equipoService.getEquipos().subscribe(item => {

          item.forEach(equipoLocal => {
            if (a.local == equipoLocal.id) {
              a.local = equipoLocal.nombre;
              a.urlLocal = equipoLocal.url;

            }
          });

          item.forEach(equipoVisitante => {
            if (a.visitante == equipoVisitante.id) {
              a.visitante = equipoVisitante.nombre;
              a.urlVisitante = equipoVisitante.url
            }
          });
        });
      });


      this.partidos = partidos;
      //this.aleatorio(partidos.length)

    })

    $('#campoNombre').keyup(function () {
      //b.validaChecks();
      b.validaChecks2();
      b.validaChecks3();

      console.log();
    })

    $('#addBtn').click(function () {

      let table, table2;

      //let quiniela = '&nbsp;*' + val1 + '&nbsp;' + val2 + '&nbsp;' + val3 + '&nbsp;' + val4 + '&nbsp;' + val5 + '&nbsp;' + val6 + '&nbsp;' + val7 + '&nbsp;' + val8 + '&nbsp;' + val9 + '*%0A';

      let arreglo = [];
      let quiniela = "*";


      let numRecords;
      numRecords = ($('#tableQuiniela2 tr').length) - 4;

      for (let i = 0; i < numRecords; i++) {
        arreglo[i] = (<HTMLInputElement>document.getElementById("val" + [i + 1])).value;
        //quiniela=quiniela+arreglo[i]+"&nbsp;";
        if (i == (numRecords - 1)) {
          quiniela = quiniela + arreglo[i];
        } else {
          quiniela = quiniela + arreglo[i] + "&nbsp;";
        }
      }

      quiniela = quiniela + "* %0A";


      //table = document.getElementById('tableRes');
      table2 = document.getElementById('tableRes2');
      //var rowCount = table.rows.length;
      let rowCount2 = parseInt(table2.rows.length);
      //var row = table.insertRow(rowCount);
      var row2 = table2.insertRow(rowCount2);

      //var cell1 = row.insertCell(0);
      var cell2 = row2.insertCell(0);

      let htmlTd = "<td><div class='row'>"
      let htmlInput = "<input id=input" + incremental + " type='hidden' value='" + quiniela + "'>";
      let htmlDivArray = [];
      let textoDiv = "";
      let htmlTd2 = "<div id=divErase" + incremental + " class='col' style='text-align:center; display:flex; justify-content:center; align-items:center; font-size:20px; overflow:hidden;'></div></div><td>";



      for (let i = 0; i < arreglo.length; i++) {
        htmlDivArray[i] = "<div class='col' style='text-align:center; display:flex; justify-content:center; align-items:center; font-size:20px;'>" + arreglo[i] + "</div>"
        textoDiv = textoDiv + htmlDivArray[i];
      }

      let htmlFinal = htmlTd + htmlInput + textoDiv + htmlTd2;

      cell2.innerHTML = htmlFinal;



      let divV = document.getElementById('divErase' + incremental);
      var element11 = document.createElement("button");
      element11.type = "button";
      var btnName = "button" + (rowCount2 + 1);
      element11.name = btnName;
      element11.setAttribute('value', "Eliminar"); // or element1.value = "button";  
      element11.className = 'btn btn-danger';
      element11.id = btnName;
      element11.onclick = function () { b.deleteRow(this); }


      divV.appendChild(element11);
      element11.innerHTML = "<span'><i class='fas fa-times-circle'></i></span>";

      incremental++;


      //borramos todos los verificadores
      let a = new PlanillaComponent(null, null, null, null);
      a.resetPlanilla();

      //debo validar que campo nombre este lleno
      a.validaChecks2();

      //actualizmos costo
      let costo = (<HTMLInputElement>document.getElementById("valCosto")).value; //campo oculto bindeado ya que no pude obtener el costo directo de this.costo y a.costo
      //puedo intentar con las comitas de javascpript inversas...
      let total = ((rowCount2 + 1) * parseInt(costo));


      $("#total").text("TOTAL: $ " + total);

    })

    $('#clearBtn').click(function () {

      let a = new PlanillaComponent(null, null, null, null);
      a.resetPlanilla();
      a.resetCampoName();

      $("#tableRes2 tr").remove()
      a.seteaTotal();
    })

    $('#sendBtn').click(function () {

      let a = new PlanillaComponent(null, null, null, null);

      var nombre = (<HTMLInputElement>document.getElementById("campoNombre")).value;
      nombre = nombre.toLocaleUpperCase();
      var titulo = (<HTMLInputElement>document.getElementById("valTitulo")).value;
      var telefono = (<HTMLInputElement>document.getElementById("valTelefono")).value;

      var mensajewa = "Hola, deseo inscribir esta quiniela:%0A%0A" + "Nombre: " + nombre + "%0A%0A" + titulo + "%0A%0A";
      let texto;

      for (let i = 0; i <= incremental; i++) {

        let aux = (<HTMLInputElement>document.getElementById("input" + i));

        if (aux != null) {
          texto += aux.value;
          texto = texto.replace('undefined', '');
        }

        //texto.replace(/undefined/gi, '');

      }

      let asa = "https://api.whatsapp.com/send?phone=529381522998&text=hola%20camaron"

      window.open("https://api.whatsapp.com/send?phone=52" + telefono + "&text=" + mensajewa + texto, "_blank");

      a.resetPlanilla();
    })

    $('#randomBtn').click(function () {

      let numRecords;
      numRecords = ($('#tableQuiniela2 tr').length) - 4;

      let a = new PlanillaComponent(null, null, null, null);
      a.aleatorio(numRecords);
    })

  }

  ngAfterViewInit() {
    //$("#local" + 1).prop('disabled', true);
  }

  validaCheckDinamico() {
    var numRows = $('#tableQuiniela2 tr').length;
    numRows = numRows - 4;

    let arreglo = new Array(numRows);
    var suma = 0;


    for (let i = 1; i <= numRows; i++) {

      arreglo[i - 1] = parseInt((<HTMLInputElement>document.getElementById("check" + i)).value);

      if (arreglo[i - 1] != 1) {
        arreglo[i - 1] = 0;
      }

      suma += arreglo[i - 1];
    }

    if (suma == numRows) {
      $('#addBtn').prop('disabled', false);
    }

  }

  validaChecks2() {
    var numRows = $('#tableRes2 tr').length;
    var nombre = (<HTMLInputElement>document.getElementById("campoNombre")).value;

    if ((numRows > 0) && (nombre.length > 0)) {
      $('#sendBtn').prop('disabled', false);
    }else{
      $('#sendBtn').prop('disabled', true);
    }
  }

  validaChecks3() {

    //valida si hay quinielas en la canasta
    var numRows = $('#tableRes2 tr').length;
    var nombre = (<HTMLInputElement>document.getElementById("campoNombre")).value;

    if (( (numRows == 0) && (nombre.length > 0)) ||  ((numRows == 0) && (nombre.length == 0) )) {
      $('#sendBtn').prop('disabled', true);
    }

  }

  resetPlanilla() {

    let numRows;
    numRows = ($('#tableQuiniela2 tr').length) - 4;

    for (let i = 1; i <= numRows; i++) {

      $("#local" + i).prop('disabled', false);
      $("#empate" + i).prop('disabled', false);
      $("#visitante" + i).prop('disabled', false);

      $("#res" + i).text('-');

      //limpia checks verificadores
      $("#check" + i).val(null);

      //desactiva button enviar

      $('#sendBtn').prop('disabled', true);
      $('#addBtn').prop('disabled', true);
      //$('#campoNombre').val("");
    }

    //necesito borrar todas lasa quinielas ya seleccionadas
  }

  resetCampoName() {
    $('#campoNombre').val("");
  }

  deleteRow(btnName) {
    try {
      var index = $(btnName).closest("tr").index()
      $(btnName).closest("tr").remove();
    }
    catch (e) {
      alert(e);
    }

    let a = new PlanillaComponent(null, null, null, null);
    a.validaChecks3();
    a.seteaTotal();

  }

  devuelveInputRes(aux) {
    let texto;
    let texto2;

    try {

      texto = (<HTMLInputElement>document.getElementById("input" + aux));

      if (texto != null) {
        texto2 = texto.value;
      } else {
        texto2 = "";
      }
    }
    catch (e) {
    }


    return texto2;
  }

  seteaTotal() {

    let numRows;

    numRows = $('#tableRes tr').length;

    let total = (numRows) * this.costo;

    if (numRows >= 1) {
      $('#total').text("TOTAL: $" + total);
    } else {
      $('#total').text("TOTAL: $" + 0);
    }

  }

  public marcaCasillasLocales(indice: number): void {

    $("#res" + indice).text('L');
    $("#local" + indice).prop('disabled', true);
    $("#empate" + indice).prop('disabled', false);
    $("#visitante" + indice).prop('disabled', false);

    //put value hidden
    $("#check" + indice).val(1);
    $("#val" + indice).val("L");

    this.validaCheckDinamico();

  }

  public marcaCasillasEmpates(indice: number): void {
    $("#res" + indice).text('E');
    $("#empate" + indice).prop('disabled', true);
    $("#local" + indice).prop('disabled', false);
    $("#visitante" + indice).prop('disabled', false);

    //put value hidden
    $("#check" + indice).val(1);
    $("#val" + indice).val("E");

    this.validaCheckDinamico();
  }

  public marcaCasillasVisitantes(indice: number): void {
    $("#res" + indice).text('V');
    $("#visitante" + indice).prop('disabled', true);
    $("#local" + indice).prop('disabled', false);
    $("#empate" + indice).prop('disabled', false);

    //put value hidden
    $("#check" + indice).val(1);
    $("#val" + indice).val("V");

    this.validaCheckDinamico();
  }

  devuelveMesLetras(mes: string) {
    switch (mes) {
      case "01": mes = "Ene";
        break;

      case "02": mes = "Feb";
        break;

      case "03": mes = "Mar";
        break;

      case "04": mes = "Abr";
        break;

      case "05": mes = "May";
        break;

      case "06": mes = "Jun";
        break;

      case "07": mes = "Jul";
        break;

      case "08": mes = "Ago";
        break;

      case "09": mes = "Sept";
        break;

      case "10": mes = "Oct";
        break;

      case "11": mes = "Nov";
        break;

      case "12": mes = "Dic";
        break;
    }

    return mes;
  }

  aleatorio(numRows) {

    for (let i = 1; i <= numRows; i++) {
      let a = this.getRandomInt();

      this.selectWinner(a, i);
    }
  }

  getRandomInt() {

    let min = 1;
    let max = 4;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  selectWinner(opc, indice) {
    switch (opc) {
      case 1: this.marcaCasillasLocales(indice);
        break;

      case 2: this.marcaCasillasEmpates(indice);
        break;

      case 3: this.marcaCasillasVisitantes(indice);
        break;
    }


  }



}
