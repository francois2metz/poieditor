<template>
  <div>
    <v-toolbar tile>
      <v-toolbar-title>{{ tags.name }}</v-toolbar-title>
      <v-btn
        icon
        @click="$emit('edit')"
      >
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="$emit('close')"
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
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Object,
      required: true,
    }
  }
};
</script>
