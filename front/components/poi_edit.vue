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
        @click="$emit('save')"
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
      name: this.tags.name,
      brand: this.tags.brand.split(';').map(s => s.trim()),
      website: this.tags.website,
      phone: this.tags.phone,
    };
  },

  computed: {
    brands() {
      return brands.concat(this.brand);
    }
  }
};
</script>
