<template>
  <div class="secret">
    <div class="header">
      <div class="secret-info">
        <code class="secret-value">New Secret</code>
      </div>
    </div>
    <RwvListErrors :errors="errors" />
    <form @submit.prevent="onSubmit(slug, password)">
      <div>
        <VuePassword
          class="secret-input"
          v-model="password"
          :disableStrength="true"
          type="password"
          new-password
        />
      </div>
      <div class="card-footer">
        <button class="secret-submit">Post Secret</button>
      </div>
    </form>
  </div>
</template>

<script>
import RwvListErrors from "./ListErrors.vue";
import { PASSWORD_CREATE } from "../store/actions.type.js";
import { VuePassword } from "vue-password";

export default {
  name: "SecretEditor",
  components: { RwvListErrors, VuePassword },
  props: {
    slug: { type: String, required: true },
    content: { type: String, required: false }
  },
  data() {
    return {
      password: this.content || null,
      errors: {}
    };
  },
  methods: {
    onSubmit(slug, password) {
      this.$store
        .dispatch(PASSWORD_CREATE, { slug, password })
        .then(() => {
          this.password = null;
          this.errors = {};
        })
        .catch(({ response }) => {
          this.errors = response.data.errors;
        });
    }
  }
};
</script>
