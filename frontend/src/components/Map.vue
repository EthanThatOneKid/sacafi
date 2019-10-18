<template>
  <div style="height: 100%; width: 100%">
    <div class="info" style="height: 15%">
      <span>Center: {{ center }}</span>
      <span>Zoom: {{ zoom }}</span>
      <span>Bounds: {{ bounds }}</span>
    </div>
    <l-map
      style="height: 50vh; width: 50vw"
      :zoom="zoom"
      :center="center"
      :minZoom="minZoom"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <v-geosearch :options="geosearchOptions"></v-geosearch>
      <l-tile-layer :url="url"></l-tile-layer>
			<l-marker
        v-for="article in articles"
        :lat-lng="article.location"
        :key="article.slug"
      ></l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";
import { mapGetters } from "vuex";
import { FETCH_ARTICLES } from '../store/actions.type';

/*
Location Panel
tags
user; badge
date published; date edited
open access
closed access; available reveals (paid = ♾)
  list of password components
    password reveal with bubbles for 2 seconds cross eye ball thing
    upvotes; downvotes; percent
add password option button
  type a password out
open in google maps link
*/
export default {
  name: "Map",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    VGeosearch
  },
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 12,
      center: [47.41322, -1.219482],
      minZoom: 12,
      bounds: null,
      geosearchOptions: {
        provider: new OpenStreetMapProvider()
      },
      isSelecting: false
    };
  },
  created() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        this.center = [latitude, longitude];
        this.zoom = 16;
      });
    }
  },
  mounted() {
    this.fetchLocationList();
  },
  computed: {
    listConfig() {
      const west = this.bounds._southWest.lng;
      const south = this.bounds._southWest.lat;
      const east = this.bounds._northEast.lng;
      const north = this.bounds._northEast.lat;
      const bbox = [west, south, east, north].join(",");
      return {
        filters: { bbox }
      };
    },
    ...mapGetters(["articles"])
  },
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
      this.fetchLocationList();
      console.log(this.articles)
    },
    fetchLocationList() {
      this.$store.dispatch(FETCH_ARTICLES, this.listConfig);
    }
  }
};
</script>

<style>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet-geosearch/assets/css/leaflet.css";
.leaflet-fake-icon-image-2x {
  background-image: url(../../node_modules/leaflet/dist/images/marker-icon-2x.png);
}
.leaflet-fake-icon-shadow {
  background-image: url(../../node_modules/leaflet/dist/images/marker-shadow.png);
}
</style>
