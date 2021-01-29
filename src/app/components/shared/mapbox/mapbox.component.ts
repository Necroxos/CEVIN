// Angular
import { Component, Input, OnInit } from '@angular/core';
// Módulos
import * as Mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// Variables globales
import { environment } from '../../../../environments/environment';
// Constantes por defecto (coordenadas de Coquimbo)
export const DEFAULT_LATITUDE = -29.941198811;
export const DEFAULT_LONGITUDE = -71.238034411;
export const DEFAULT_ZOOM = 9;

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.css']
})
export class MapboxComponent implements OnInit {

  // Inicialización de variables
  map: Mapboxgl.Map;
  geocoder: MapboxGeocoder;
  marker: Mapboxgl.Marker;
  // Variables recibidas del componente padre
  @Input() lat = DEFAULT_LATITUDE;
  @Input() lon = DEFAULT_LONGITUDE;
  @Input() zoom = DEFAULT_ZOOM;
  @Input() coors = [];
  @Input() drag = false;
  @Input() mark = false;
  @Input() search = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.iniciarMapa();
      if (this.coors.length > 0) {
        this.agregarMarcadores();
      } else if (this.mark) {
        this.agregarMarcador();
      } else if (this.search) {
        this.agregarBuscador();
      }
    }, 0);
  }

  /**
   * Función que inicializa el mapa de Mapbox
   * usando el apiKey puesta en enviroments
   * y usa coordenadas por defecto de Coquimbo
   */
  iniciarMapa(): void {
    (Mapboxgl as any).accessToken = environment.mapboxKey;
    this.map = new Mapboxgl.Map({
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lon, this.lat],
      zoom: this.zoom
    });
  }

  /**
   * Si el componente recibe 'mark=true', entonces muestra un marcador en el mapa
   * también puede recibir un 'lat' y 'lon' para definir el marcador.
   * Por último recibe el parámetro 'drag' para saber si el marcador es movible
   */
  agregarMarcador(): void {
    this.marker = new Mapboxgl.Marker({
      draggable: this.drag
    })
      .setLngLat([this.lon, this.lat])
      .addTo(this.map);

    this.marker.on('dragend', () => {
      this.onDragEnd();
    });
  }

  /**
   * Si el componente recibe un array de coordenadas
   * entonces genera marcadores por el mapa
   * estos son estáticos en el mapa
   */
  agregarMarcadores(): void {
    this.coors.forEach(coor => {
      this.marker = new Mapboxgl.Marker()
        .setLngLat([coor.longitud, coor.latitud])
        .addTo(this.map);
    });
  }

  /**
   * Función para poder mover un marcador en el mapa
   * y genera un cuadro bajo el mapa mostarndo las coordenadas
   */
  onDragEnd(): void {
    if (this.marker) {
      const lngLat = this.marker.getLngLat();
      this.lon = lngLat.lng;
      this.lat = lngLat.lat;
    }
    document.getElementById('coordinates').style.display = 'block';
    document.getElementById('coordinates').innerHTML =
      'Longitud: ' + this.lon + '<br />Latitud: ' + this.lat;
  }

  /**
   * Función que usa la configuración del buscador
   * y la implementa en el mapa,
   * además maneja el resultado
   */
  agregarBuscador(): any {
    this.configBuscador();
    this.map.addControl(this.geocoder);
    this.geocoder.on('result', (e: any) => {
      const coordinates = e.result.center;
      // Usar emiter
      this.lon = coordinates[0];
      this.lat = coordinates[1];
      console.log(coordinates);
    });
  }

  /**
   * Función que inicializa el buscador de MapboxGeocoder
   * Está definido para la región de Coquimbo (IV Región)
   */
  configBuscador(): void {
    this.geocoder = new MapboxGeocoder({
      accessToken: Mapboxgl.accessToken,
      mapboxgl: Mapboxgl,
      placeholder: 'Buscar ubicación',
      bbox: [-71.73034, -30.75290, -70.44739, -29.70370],
      proximity: {
        longitude: DEFAULT_LONGITUDE,
        latitude: DEFAULT_LATITUDE
      }
    });
  }

}
