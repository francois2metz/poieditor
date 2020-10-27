<template>
  <div :class="{ 'sidebar-opened': $route.name !== 'index' }">
    <MglMap
      :map-style="mapStyle"
      :zoom.sync="zoom"
      :center.sync="center"
      hash="map"
      class="map"
      @load="load"
    >
      <MglNavigationControl />
      <MglGeolocateControl />
      <MglVectorLayer
        :layer-id="layer.id"
        :layer="layer"
        :source="poiSource"
        source-id="poi"
        @mouseenter="mouseenter"
        @click="clickPoi"
        @mouseleave="mouseleave"
      />
      <MglMarker
        v-if="place"
        :key="place.lat + place.lon"
        :coordinates="[ place.lon, place.lat ]"
      />
    </MglMap>
    <nuxt-child />
    <v-toolbar class="toolbar ml-5 mt-5">
      <geocoder-input @select="select" />
    </v-toolbar>
    <upload-osm />
  </div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MglGeolocateControl,
  MglMap,
  MglMarker,
  MglNavigationControl,
  MglVectorLayer,
} from 'vue-mapbox/dist/vue-mapbox.umd';
import debounce from 'lodash.debounce';
import { mapState } from 'vuex';

const SETTINGS_STORAGE = 'settings';

export default {
  components: {
    MglGeolocateControl,
    MglMap,
    MglMarker,
    MglNavigationControl,
    MglVectorLayer,
  },

  data() {
    const { center, zoom } = this.restoreSavedPosition();
    return {
      mapStyle: process.env.mapStyle,
      layer: {
        id: 'poi',
        type: "circle",
        'source-layer': 'public.poi',
        paint: {
          'circle-color': 'white',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#FAA300',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12, 1,
            19, 13
          ]
        }
      },
      poiSource: {
        minzoom: 12,
        maxzoom: 17,
        tiles: [`${process.env.poiSource}/public.poi/{z}/{x}/{y}.pbf`],
      },
      zoom,
      center,
    };
  },

  computed: mapState(['place']),

  methods: {
    load({ map }) {
      this.map = map;
    },

    mouseenter(e) {
      e.map.getCanvas().style.cursor = 'pointer';
    },

    mouseleave(e) {
      e.map.getCanvas().style.cursor = '';
    },

    clickPoi(e) {
      const id = e.mapboxEvent.features[0].properties.osm_id;
      this.$router.push({ path: `/poi/${id}` });
    },

    select(bbox) {
      this.map.fitBounds(bbox, { duration: 0 });
    },

    restoreSavedPosition() {
      const settings = this.getSavedSettings();
      if (settings) {
        return settings.position;
      } else {
        return {
          zoom: 13,
          center: [2.32, 48.6],
        };
      }
    },

    getSavedSettings() {
      try {
        const settings = localStorage.getItem(SETTINGS_STORAGE);
        if (settings) {
          return JSON.parse(settings);
        }
      } catch (e) {}
    },

    savePosition: debounce(function() {
      const position = { zoom: this.zoom, center: this.center };
      const settings = JSON.stringify({ position });
      localStorage.setItem(SETTINGS_STORAGE, settings);
    }, 1000),
  },

  watch: {
    zoom() {
      this.savePosition();
    },

    center() {
      this.savePosition();
    },
  },
};
</script>

<style scoped>
.map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.map >>> .mapboxgl-map {
  width: 100vw;
  height: 100vh;
}
.map >>> .mapboxgl-ctrl-top-right {
  top: 50px;
}
.contributions-count {
  position: absolute;
  right: 10px;
  top: 10px;
}
.toolbar {
  position: absolute;
  z-index: 4;
}
.sidebar-opened .toolbar {
  transform: translateX(400px);
}
</style>
