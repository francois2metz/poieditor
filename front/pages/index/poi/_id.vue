<template>
  <v-card
    light
    class="sidebar"
  >
    <poi-edit
      v-if="editing"
      :tags="tags"
      @cancel="cancel"
    />
    <poi-view
      v-else
      :tags="tags"
      @edit="edit"
      @close="close"
    />
  </v-card>
</template>

<script>
import OsmRequest from 'osm-request';

export default {
  data() {
    return {
      editing: false,
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
    edit() {
      this.editing = true;
    },

    cancel() {
      this.editing = false;
    },

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
