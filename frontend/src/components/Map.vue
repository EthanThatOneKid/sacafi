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

export default {
  name: "Map",
  props: {
    slug: {
      type: String,
      required: false
    }
  },
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
      }
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
      if (this.bounds === null) {
        return {
          filters: null
        };
      }
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
