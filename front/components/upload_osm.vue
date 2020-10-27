<template>
  <v-btn
    :loading="saving"
    :disabled="saving || elements.length === 0"
    class="contributions-count"
    @click="save"
  >
    <v-icon>mdi-cloud-upload</v-icon>
    {{ elements.length }}
  </v-btn>
</template>

<script>
import { mapState } from 'vuex';
import OsmAuth from 'osm-auth';
import OsmRequest from 'osm-request';

export default {
  data() {
    return {
      saving: false,
    };
  },

  mounted() {
    window.addEventListener('beforeunload', (event) => {
      if (this.elements.length > 0) {
        event.preventDefault();
        event.returnValue = '';
      }
    });
  },

  computed: {
    ...mapState(['elements']),

    osmAuth() {
      return OsmAuth({
        url: process.env.osmUrl,
        oauth_consumer_key: process.env.osmConsumerKey,
        oauth_secret: process.env.osmSecret,
        auto: true,
      });
    },

    osmRequest() {
      return new OsmRequest({
        endpoint: process.env.osmUrl,
        oauthConsumerKey: process.env.osmConsumerKey,
        oauthSecret: process.env.osmSecret,
      });
    },
  },

  methods: {
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
      this.saving = true;
      const changesetId = await this.osmRequest.createChangeset('POIEditor', `Edit ${this.elements.length} bike shops`);
      await Promise.all(this.elements.map((element) => {
        return this.osmRequest.sendElement(element, changesetId);
      }));
      await this.osmRequest.closeChangeset(changesetId);
      this.$store.commit('clearElements');
      this.saving = false;
    },
  },
};
</script>
