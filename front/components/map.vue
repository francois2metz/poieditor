<template>
  <div>
    <client-only>
      <MglMap
        :map-style="mapStyle"
        :zoom="13"
        :center="[2.32, 48.6]"
        hash="map"
        class="map"
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
      </MglMap>
    </client-only>
    <nuxt-child />
    <v-chip @click="save">{{ elements.length }}</v-chip>
  </div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MglMap,
  MglNavigationControl,
  MglGeolocateControl,
  MglVectorLayer,
} from 'vue-mapbox/dist/vue-mapbox.umd';
import { mapState } from 'vuex';
import OsmAuth from 'osm-auth';
import OsmRequest from 'osm-request';

export default {
  components: {
    MglMap,
    MglNavigationControl,
    MglGeolocateControl,
    MglVectorLayer,
  },

  data() {
    return {
      mapStyle: this.$config.mapStyle,
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
        tiles: [`${this.$config.poiSource}/public.poi/{z}/{x}/{y}.pbf`],
      },
    };
  },

  computed: {
    ...mapState(['elements']),

    osmAuth() {
      return OsmAuth({
        url: this.$config.osmUrl,
        oauth_consumer_key: this.$config.osmConsumerKey,
        oauth_secret: this.$config.osmSecret,
        auto: true,
      });
    },

    osmRequest() {
      return new OsmRequest({
        endpoint: this.$config.osmUrl,
        oauthConsumerKey: this.$config.osmConsumerKey,
        oauthSecret: this.$config.osmSecret,
      });
    },
  },

  methods: {
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

    async save() {
      if (this.osmAuth.authenticated()) {
        this.saveElements();
      } else {
        this.osmAuth.authenticate(async (...args) => {
          this.saveElements();
        });
      }
    },

    async saveElements() {
      const changesetId = await this.osmRequest.createChangeset('POIEditor', `Edit ${this.elements.length} bike shops`);
      this.elements.forEach(async (element) => {
        await this.osmRequest.sendElement(element, changesetId);
      });
      await this.osmRequest.closeChangeset(changesetId);
      this.$store.commit('clearElements');
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
  height: 500vh;
}
</style>
