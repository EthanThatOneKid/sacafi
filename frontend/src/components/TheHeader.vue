<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'home' }">
        Sacafi
      </router-link>
      <ul class="nav navbar-nav">
        <li class="nav-item">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{ name: 'home' }"
          >
            <i class="ion-md-home"></i>
            &nbsp;Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            active-class="active"
            :to="{ name: 'locations' }"
          >
            <i class="ion-md-pin"></i>
            &nbsp;Locations
          </router-link>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <router-link
            class="nav-link"
            active-class="active"
            :to="{ name: 'article-edit' }"
          >
            <i class="ion-md-add"></i>
            &nbsp;New Location
          </router-link>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{
              name: 'profile',
              params: { username: currentUser.username }
            }"
          >
            <i class="ion-md-person"></i>
            &nbsp;{{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item" v-if="!isAuthenticated">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{ name: 'login' }"
          >
            <i class="ion-md-log-in"></i>&nbsp;Sign in
          </router-link>
        </li>
        <li class="nav-item" v-if="!isAuthenticated">
          <router-link
            class="nav-link"
            active-class="active"
            exact
            :to="{ name: 'register' }"
          >
            <i class="ion-md-person-add"></i>&nbsp;Sign up
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "RwvHeader",
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  }
};
</script>
