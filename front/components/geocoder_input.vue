<template>
  <v-autocomplete
    v-model="selected"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    :error="!!error"
    autofocus
    hide-no-data
    hide-details
    no-filter
    clearable
    placeholder="Search"
    background-color="white"
    prepend-inner-icon="mdi-magnify"
  >
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title v-text="item.text"></v-list-item-title>
        <v-list-item-subtitle v-text="item.region"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  data() {
    return {
      isLoading: false,
      items: [],
      search: '',
      selected: null,
      error: null
    };
  },

  watch: {
    search: debounce(function (val) {
      if (this.controller) {
        this.controller.abort();
        this.controller = null;
      }
      if (!val || val.trim().length < 3) return;

      // Direct coordinates input ?
      let directCoordinates = null;
      if(/^-?\d+\.\d+[,;/]-?\d+\.\d+$/.test(val.trim().replace(/ /g, ''))) {
        const separator = val.includes(',') ? ',' : (val.includes('/') ? '/' : ';');
        const coordsLatLng = val.split(separator).map(c => parseFloat(c.trim()));
        const bbox = [ coordsLatLng[1] - 0.0005, coordsLatLng[0] - 0.0005, coordsLatLng[1] + 0.0005, coordsLatLng[0] + 0.0005 ];
        directCoordinates = {
          text: this.$t('coordinates'),
          region: coordsLatLng.join(', '),
          value: bbox
        };
        this.items = [ directCoordinates ];
      }

      this.error = null;
      this.isLoading = true;
      this.controller = new AbortController();
      const signal = this.controller.signal;
      const url = `https://api.jawg.io/places/v1/search?text=${encodeURIComponent(this.search)}&access-token=${process.env.accessToken}`;

      fetch(url, { signal })
        .then(res => res.json())
        .then(body => {
          this.error = null;
          this.items = body.features.map((feature) => {
            return {
              text: feature.properties.label,
              region: feature.properties.region,
              value: feature.bbox ? feature.bbox : feature.geometry.coordinates.concat(feature.geometry.coordinates)
            };
          });
          if (directCoordinates) { this.items.unshift(directCoordinates); }
        })
        .catch(err => {
          this.error = err;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }, 350, { maxWait: 500 }),
    selected(val) {
      if (Array.isArray(val)) {
        this.$emit('select', val);
      }
    }
  }
}
</script>

