<template>
  <v-card class="sidebar">
    <poi-edit
      v-if="editing"
      :tags="tags"
      @save="save"
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
      element: null,
      tags: {},
    };
  },

  computed: {
    id() {
      return this.$route.params.id;
    },

    osm() {
      return new OsmRequest({
        endpoint: process.env.osmUrl,
        oauthConsumerKey: process.env.osmConsumerKey,
        oauthSecret: process.env.osmSecret,
      });
    },
  },

  fetch() {
    this.fetchElement();
  },

  methods: {
    async fetchElement() {
      this.element = await this.osm.fetchElement(this.id.replace(':', '/'));
      this.tags = this.osm.getTags(this.element);
    },

    edit() {
      this.editing = true;
    },

    cancel() {
      this.editing = false;
    },

    close() {
      this.$router.push({ path: '/' });
    },

    save(data) {
      const [tagsToRemove, toUpdate] = Object.entries(data).reduce(([toRemove, toUpdate], [key, value]) => {
        if (value === null || value.trim() === '') {
          toRemove.push(key);
        } else {
          toUpdate[key] = value;
        }
        return [toRemove, toUpdate];
      }, [[], {}]);
      let element = tagsToRemove.reduce((element, tagToRemove) => {
        return this.osm.removeTag(element, tagToRemove);
      }, this.element);
      const newElement = this.osm.setTags(element, toUpdate);
      this.$store.commit('saveElement', newElement);
      this.editing = false;
    },
  },

  watch: {
    id() {
      this.fetchElement();
    }
  },
};
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
