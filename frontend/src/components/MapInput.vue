<template>
  <div style="height: 100%; width: 100%">
    <l-map
      style="height: 50vh; width: 100%"
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
        :lat-lng="center"
        :draggable="true"
        @dragend="markerDragged"
      ></l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";

export default {
  name: "MapInput",
  props: {
    value: {
      type: Object,
      required: false
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    VGeosearch
  },
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 12,
      center: [40.83583, -73.923692], // Joker Stairs
      minZoom: 12,
      bounds: null,
      geosearchOptions: {
        provider: new OpenStreetMapProvider()
      }
    };
  },
  created() {
    if (!!this.value && !!this.value.lat && !!this.value.lng) {
      const { lat, lng } = this.value;
      this.center = { lat, lng };
      this.zoom = 16;
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        this.center = [latitude, longitude];
        this.zoom = 16;
      });
    }
  },
  methods: {
    markerDragged(event) {
      this.center = event.target._latlng;
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
      this.changeMarkerPosition();
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    changeMarkerPosition() {
      // BUG: This method gets called twice
      const { lat, lng } = this.center;
      const data = {
        type: "Point",
        coordinates: [lng, lat]
      };
      this.$emit("input", data);
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
