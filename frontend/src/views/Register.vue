<template>
  <div class="auth-page">
    <div class="auth-form">
      <h1 class="auth-title">Sign up</h1>
      <p class="auth-other">
        <router-link :to="{ name: 'login' }">
          Have an account?
        </router-link>
      </p>
      <ul v-if="errors" class="error-messages">
        <li v-for="(v, k) in errors" :key="k">{{ k }} {{ v | error }}</li>
      </ul>
      <form v-on:submit.prevent="onSubmit">
        <fieldset class="form-group">
          <label>Username:&nbsp;</label>
          <input
            class="form-control"
            type="text"
            v-model="username"
            placeholder="Username"
          />
        </fieldset>
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
          Sign up
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { REGISTER } from "@/store/actions.type";

export default {
  name: "RwvRegister",
  data() {
    return {
      username: "",
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch(REGISTER, {
          email: this.email,
          password: this.password,
          username: this.username
        })
        .then(() => this.$router.push({ name: "home" }));
    }
  }
};
</script>
