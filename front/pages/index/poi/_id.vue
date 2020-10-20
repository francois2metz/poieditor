<template>
  <v-card
    light
    class="sidebar"
  >
    <v-toolbar tile>
      <v-toolbar-title>{{ tags.name }}</v-toolbar-title>
      <v-btn
        icon
      >
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="close"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list>
      <v-list-item v-if="tags.phone || tags['contact:phone']">
        <v-list-item-title>{{ tags.phone || tags['contact:phone'] }}</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="tags.brand">
        <v-list-item-title>{{ tags.brand.split(';').join(' ') }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="tags.website || tags['contact:website']"
        :href="tags.website || tags['contact:website']"
        target="_blank"
        rel="noopener"
      >
        <v-list-item-title>{{ tags.website || tags['contact:website'] }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import OsmRequest from 'osm-request';

export default {
  data() {
    return {
      tags: {},
    };
  },

  computed: {
    id() {
      return this.$route.params.id;
    },
    osm() {
      return new OsmRequest({
        endpoint: 'https://www.openstreetmap.org',
        oauthConsumerKey: this.$config.osmConsumerKey,
      });
    }
  },

  async fetch() {
    const element = await this.osm.fetchElement(this.id.replace('node', 'node/'));
    this.tags = this.osm.getTags(element);
  },

  methods: {
    close() {
      this.$router.push({ path: '/' });
    }
  },
}
</script>

<style scoped>
.sidebar {
  width: 400px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  overflow-y: auto;
}
</style>
