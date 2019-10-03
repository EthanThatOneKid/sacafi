<template>
  <div>
    <component id="full_div" :is="currentView" />
  </div>
</template>

<script>
import Simple from "../components/Simple";

export default {
  name: "Map",
  components: {
    Simple
  },
  data() {
    return {
      currentView: "simple"
    };
  }
};
</script>

<style>
/* @import "../../node_modules/leaflet/dist/leaflet.css";

.leaflet-fake-icon-image-2x {
  background-image: url(../../node_modules/leaflet/dist/images/marker-icon-2x.png);
}
.leaflet-fake-icon-shadow {
  background-image: url(../../node_modules/leaflet/dist/images/marker-shadow.png);
} */
</style>
