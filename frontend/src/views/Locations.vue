<template>
  <div>
    <Map :slug="slug"></Map>
  </div>
</template>

<script>
import Map from "../components/Map";
export default {
  name: "Locations",
  data() {
    return {
      slug: this.$route.query.l || null
    };
  },
  components: { Map }
};
</script>
