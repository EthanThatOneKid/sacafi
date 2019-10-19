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
      slug: this.$route.query.slug || null
    };
  },
  components: { Map }
};
</script>
