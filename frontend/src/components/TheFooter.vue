<template>
  <footer class="the-footer">
    <div class="container">
      <router-link class="logo-font" :to="{ name: 'home', params: {} }">
        Sacafi
      </router-link>
      <span>&nbsp;|&nbsp;</span>
      <span class="attribution">
        Code &amp; design licensed under MIT.
      </span>
    </div>
  </footer>
</template>

<script>
export default {
  name: "RwvFooter"
};
</script>
