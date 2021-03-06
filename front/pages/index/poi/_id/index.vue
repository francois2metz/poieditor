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
import { mapState } from 'vuex';

export default {
  data() {
    return {
      editing: false,
      element: null,
      tags: {},
    };
  },

  computed: {
    ...mapState(['elements']),

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

  mounted() {
    this.beforeUnload = () => {
      this.preventLeavingIfEditing((result) => {
        if (!result) {
          event.preventDefault();
          event.returnValue = '';
        }
      });
    };
    window.addEventListener('beforeunload', this.beforeUnload);
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeUnload);
  },

  fetch() {
    this.fetchElement();
  },

  beforeDestroy() {
    this.$store.commit('setPlace', null);
  },

  beforeRouteUpdate(to, from, next) {
    this.preventLeavingIfEditing(next);
  },

  beforeRouteLeave(to, from, next) {
    this.preventLeavingIfEditing(next);
  },

  methods: {
    async fetchElement() {
      this.element = await (this.findPreviouslyEditedElement() || this.fetchRemoteElement());
      this.tags = this.osm.getTags(this.element);
      const { lat, lon } = this.element.$;
      this.$store.commit('setPlace', { lat, lon });
    },

    findPreviouslyEditedElement() {
      const [type, id] = this.id.split(':');
      return this.elements.find((element) => {
        return element._type === type && element._id === id;
      });
    },

    fetchRemoteElement() {
      return this.osm.fetchElement(this.id.replace(':', '/'));
    },

    preventLeavingIfEditing(next) {
      let result = true;
      if (this.editing) {
        result = window.confirm('Do you really want to cancel your edit?');
      }
      next(result);
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
      this.fetchElement();
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
