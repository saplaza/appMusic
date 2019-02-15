import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ANIMALES} from './data.animales'

/**
 * Generated class for the MusicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-music',
  templateUrl: 'music.html',
})
export class MusicPage {
  public canciones: any;
  public myaudio: any;
  public Animal: any;
  audio = new Audio();
  tiempoAudio: any;
  public oneplay: number;
  public contadorProgress: 0;
  public micancion: any;
  public miloop: 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  this.canciones = ANIMALES.slice(0);
  this.oneplay = 0;
  this.contadorProgress = 0;
  this.micancion = [];
  this.miloop = 0;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MusicPage');
  }

  reproducir (animal) {
    this.oneplay = 1;
    document.querySelector("#play-pause").setAttribute("cancion_actual", animal.id);

    this.pausarAudio(animal);

    document.querySelector("#play-pause").setAttribute("cancion_count", animal.duracion);

    document.querySelector("#play-pause").setAttribute("cancion_contador", '0');

    document.querySelector("#play-pause").setAttribute("cancion_contadora", '0');

    document.querySelector("#play-pause").setAttribute("cancion_cuentaminutes", '0');

    document.querySelector("#play-pause").setAttribute("cancion_contador_progressbar_2", '0');

    this.reproducirarriba(animal);

      let play_pause = document.getElementById("play-pause");
    if (animal.reproduciendo) {
      animal.reproduciendo = false;
      play_pause.className = "amplitude-paused";
      return;
    }else{
      play_pause.className = "amplitude-playing";
    }
    this.audio.src = animal.audio;
    animal.reproduciendo = true;
    this.audio.load();
    this.audio.play();
  }

  private pausarAudio(animalSeleccionado) {
    this.audio.pause();
    this.audio.currentTime = 0;

    for (let cancion of this.canciones) {
      if (cancion.nombre != animalSeleccionado.nombre) {
        cancion.reproduciendo = false;
      }
    }
  }

  public reproducirarriba(cancion){
    this.micancion = cancion;
    this.playcancion(cancion);
    var presentacion = document.querySelector("#cover_art_url");
    presentacion = cancion.imagen;
    document.querySelector("#name_song").innerHTML = cancion.nombre;
    document.querySelector("#album").innerHTML = cancion.album;

    var time = cancion.duracion;
    var minutes = '0';
    var seconds = '0';
    minutes = Math.floor( time / 60 );
    seconds = time % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    document.querySelector(".amplitude-duration-minutes").innerHTML = minutes;
    document.querySelector(".amplitude-current-minutes").innerHTML = '00';
    document.querySelector(".amplitude-duration-seconds").innerHTML = seconds;
    document.querySelector(".amplitude-current-seconds").innerHTML = '00';
  }

  public playcancion(cancion){

    if(this.oneplay == 0){
      this.oneplay = 1;
      this.playoneCacion();
    }

    if(cancion == undefined){
      cancion = this.micancion;
    }

    let play_pause = document.getElementById("play-pause");
    if(play_pause.className === 'amplitude-playing'){
      play_pause.className = "amplitude-paused";
      this.audio.pause();
      clearInterval(this.contadorProgress);
    }else{

    let cancion_contador = document.querySelector("#play-pause").attributes.cancion_contador.value;

    let cancion_contadora = document.querySelector("#play-pause").attributes.cancion_contadora.value;

    let cancion_cuentaminutes = document.querySelector("#play-pause").attributes.cancion_cuentaminutes.value;

    let cancion_contador_progressbar_2 = document.querySelector("#play-pause").attributes.cancion_contador_progressbar_2.value;

    let cancion_count = document.getElementById("play-pause").attributes.cancion_count.value;
      
      play_pause.className = "amplitude-playing";
      this.audio.play();
      this.progressBar(cancion_count,cancion_contador,cancion_contadora,cancion_cuentaminutes,cancion_contador_progressbar_2,cancion)
    }
    
  }

  public mostrarMinutesSeconds(duracion){
    var time = duracion;
    var minutes = Math.floor( time / 60 );
    var seconds = time % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var result = minutes + ':' + seconds;
    return result;
  }

  public nextCancion(cancionnext){
    let numberCanciones = 0;
    let numberCancion = 0;
    for (let cancion of this.canciones) {
      numberCanciones++;
      if (cancion.id == cancionnext.id) {
        numberCancion = numberCanciones;
        cancion.reproduciendo = false;
      }
    }
    if (numberCancion == numberCanciones){
      numberCancion = 0;
    }
    this.reproducir(this.canciones[numberCancion]);
  }

  public loopCancion(){
    let repeat_norepeat = document.getElementById("repeat");
    if(repeat_norepeat.className === 'amplitude-repeat-on'){
      repeat_norepeat.className = "amplitude-repeat-off";
      this.audio.loop = false;
      this.miloop = 0;
    }else{
      repeat_norepeat.className = "amplitude-repeat-on";
      this.audio.loop = true;
      this.miloop = 1;
    }
  }

  public randomCamcion(){
    var miNumberRandom = Math.floor((Math.random() * 10) + 1);
    console.log(miNumberRandom);
  }

  public siguenteCancion(){
    clearInterval(this.contadorProgress);
    let play_pause = document.getElementById("play-pause");
    play_pause.className = "amplitude-paused";

    let nombre_cancion = document.querySelector("#play-pause").attributes.cancion_actual;
    let numberCanciones = 0;
    let numberCancion = 0;
    for (let cancion of this.canciones) {
      numberCanciones++;
      if (cancion.id == nombre_cancion.value) {
        numberCancion = numberCanciones;
        cancion.reproduciendo = false;
      }
    }
    if (numberCancion == numberCanciones){
      numberCancion = 0;
    }
    let indice = numberCancion;
    this.reproducir(this.canciones[indice]);
  }

  public anteriorCancion(){
    clearInterval(this.contadorProgress);
    let play_pause = document.getElementById("play-pause");
    play_pause.className = "amplitude-paused";

    let nombre_cancion = document.querySelector("#play-pause").attributes.cancion_actual;
    let numberCanciones = 0;
    let numberCancion = 0;
    for (let cancion of this.canciones) {
      if (cancion.id == nombre_cancion.value) {
        numberCancion = numberCanciones;
        cancion.reproduciendo = false;
      }
      numberCanciones++;
    }
    if (numberCancion == numberCanciones){
      numberCancion = 0;
    }
    let indice = numberCancion - 1;

    if(indice == -1){
      indice = numberCanciones - 1;
    }

    this.reproducir(this.canciones[indice]);
  }

  public playoneCacion(){
    this.reproducir(this.canciones[0]);
  }

  public progressBar(count,contador = 0,contadora = 0,cuentaminutes = 0,contador_progressbar_2 = 0,cancion){


      var seconds = contadora;
      var minutes = cuentaminutes;
      var contador_progressbar_1 = 0;

      this.contadorProgress = setInterval(data => {
        if(contadora == 60){
          contadora = 0;
          cuentaminutes++;
          minutes = cuentaminutes < 10 ? '0' + cuentaminutes : cuentaminutes;
          document.querySelector(".amplitude-current-minutes").innerHTML = minutes;
        }
        seconds = contadora < 10 ? '0' + contadora : contadora;
        document.querySelector(".amplitude-current-seconds").innerHTML = seconds;

        contador_progressbar_1 = 100 / count;
        contador_progressbar_2 = Number(contador_progressbar_2) + contador_progressbar_1;

        document.querySelector(".amplitude-song-slider").value = contador_progressbar_2;

        contador++;
        contadora++;
        if (count == contador) {
          clearInterval(this.contadorProgress);
          console.log("Se terminó");

          let play_pause = document.getElementById("play-pause");
          play_pause.className = "amplitude-paused";
          
          if(this.miloop == 0){
            this.nextCancion(cancion);
          }else{
            this.reproducir(cancion);
          }

        }
        document.querySelector("#play-pause").setAttribute("cancion_contador", contador);

        document.querySelector("#play-pause").setAttribute("cancion_contadora", contadora);

        document.querySelector("#play-pause").setAttribute("cancion_cuentaminutes", cuentaminutes);

        document.querySelector("#play-pause").setAttribute("cancion_contador_progressbar_2", contador_progressbar_2);

      }, 1000);
  }

}
