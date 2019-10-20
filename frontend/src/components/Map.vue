<template>
  <div class="map-content">
    <div class="map-container">
      <l-map
        style="height: 100%; width: 100%"
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
          @click="selectLocation(article.slug)"
        ></l-marker>
      </l-map>
    </div>
    <div class="location-panel-container" v-if="selectedLocation !== null">
      <LocationPanel
        :slug="selectedLocation"
        @exit="exitLocationPanel"
      >
      </LocationPanel>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";
import LocationPanel from "@/components/LocationPanel";
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
    VGeosearch,
    LocationPanel
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
      selectedLocation: null
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
    },
    fetchLocationList() {
      this.$store.dispatch(FETCH_ARTICLES, this.listConfig);
    },
    selectLocation(slug) {
      this.selectedLocation = slug;
    },
    exitLocationPanel() {
      this.selectedLocation = null;
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
