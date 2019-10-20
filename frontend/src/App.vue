<template>
  <div id="app">
    <RwvHeader class="the-header" />
    <router-view class="the-content" />
    <RwvFooter class="the-footer" />
  </div>
</template>

<script>
import RwvHeader from "@/components/TheHeader";
import RwvFooter from "@/components/TheFooter";

export default {
  name: "App",
  components: {
    RwvHeader,
    RwvFooter
  }
};
</script>
