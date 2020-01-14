<template>
  <div class="auth-page">
    <div class="auth-form">
      <h1 class="auth-title">Sign in</h1>
      <p class="auth-other">
        <router-link :to="{ name: 'register' }">
          Need an account?
        </router-link>
      </p>
      <ul v-if="errors" class="error-messages">
        <li v-for="(v, k) in errors" :key="k">{{ k }} {{ v | error }}</li>
      </ul>
      <form v-on:submit.prevent="onSubmit(email, password)">
        <fieldset class="form-group">
          <label>Email:&nbsp;</label>
          <input
            class="form-control"
            type="text"
            v-model="email"
            placeholder="Email"
          />
        </fieldset>
        <fieldset class="form-group">
          <label>Password:&nbsp;</label>
          <input
            class="form-control"
            type="password"
            v-model="password"
            placeholder="Password"
          />
        </fieldset>
        <button class="auth-submit">
          Sign in
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { LOGIN } from "@/store/actions.type";

export default {
  name: "RwvLogin",
  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    onSubmit(email, password) {
      this.$store
        .dispatch(LOGIN, { email, password })
        .then(() => this.$router.push({ name: "home" }));
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
