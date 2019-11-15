<template>
  <div>
    <RwvListErrors :errors="errors" />
    <form class="card comment-form" @submit.prevent="onSubmit(slug, password)">
      <div class="card-block">
        <VuePassword
          v-model="password"
          :disableStrength="true"
          type="password"
          new-password
        />
      </div>
      <div class="card-footer">
        <button class="btn btn-sm btn-primary">Post Secret</button>
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
