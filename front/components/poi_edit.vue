<template>
  <div>
    <v-toolbar tile>
      <v-toolbar-title>{{ tags.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="$emit('cancel')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="$emit('save', dataToSend())"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="pa-3">
       <v-text-field
        v-model="name"
        label="Name"
      />
      <v-text-field
        v-model="phone"
        label="Phone"
      />
      <v-text-field
        v-model="website"
        label="Website"
      />
      <v-autocomplete
        v-model="brand"
        :items="brands"
        dense
        chips
        small-chips
        label="Brands"
        multiple
      />
    </div>
  </div>
</template>

<script>
import brands from './brands';

export default {
  props: {
    tags: {
      type: Object,
      required: true,
    }
  },

  data() {
    return {
      name: this.tags.name || null,
      brand: (this.tags.brand || '').split(';').map(s => s.trim()).filter(s => !!s),
      website: this.tags.website || this.tags['contact:website'] || null,
      phone: this.tags.phone || this.tags['contact:phone'] || null,
    };
  },

  computed: {
    brands() {
      return brands.concat(this.brand);
    }
  },

  methods: {
    dataToSend() {
      return {
        name: this.name,
        brand: this.brand.length > 0 ? this.brand.join(';') : null,
        [this.tags['contact:website'] ? 'contact:website' : 'website']: this.website,
        [this.tags['contact:phone'] ? 'contact:phone' : 'phone']: this.phone,
      };
    },
  },
};
</script>
