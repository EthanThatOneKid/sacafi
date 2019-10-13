<template>
  <div>
    <map></map>
    <!-- <component id="full_div" :is="currentView" /> -->
  </div>
</template>

<script>
import Map from "../components/Map";

export default {
  name: "locations",
  components: {
    Map
  },
  data() {
    return {
      currentView: "map"
    };
  }
};
</script>
