<template>
  <div>
    <Map></Map>
    <!-- <component id="full_div" :is="currentView" /> -->
  </div>
</template>

<script>
import Map from "../components/Map";

export default {
  name: "MapView",
  components: {
    Map
  },
  data() {
    return {
      currentView: "Map"
    };
  }
};
</script>
