<template>
  <div class="profile-page">
    <div class="profile-panel">
      <div class="profile-info">
        <img
          :src="profile.image"
          :data-score="profile.score"
          class="user-img"
        />
        <p class="score-circle">{{ profile.score }}</p>
        <h1>{{ profile.username }}</h1>
        <p v-html="parseMarkdown(profile.bio)"></p>
      </div>
      <div class="locations-toggle">
        <ul class="nav">
          <li class="nav-item">
            <router-link
              class="nav-link"
              active-class="active"
              exact
              :to="{ name: 'profile' }"
            >
              <i class="ion-md-person"></i>
              Locations
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              active-class="active"
              exact
              :to="{ name: 'profile-favorites' }"
            >
              <i class="ion-md-heart"></i>
              Favorites
            </router-link>
          </li>
          <li v-if="isCurrentUser()" class="nav-item">
            <router-link
              class="nav-link settings-link"
              :to="{ name: 'settings' }"
            >
              <i class="ion-md-cog"></i>
              Edit Profile
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import marked from "marked";
import {
  FETCH_PROFILE,
  FETCH_PROFILE_FOLLOW,
  FETCH_PROFILE_UNFOLLOW
} from "@/store/actions.type";

export default {
  name: "RwvProfile",
  mounted() {
    this.$store.dispatch(FETCH_PROFILE, this.$route.params);
  },
  computed: {
    ...mapGetters(["currentUser", "profile", "isAuthenticated"])
  },
  methods: {
    isCurrentUser() {
      if (this.currentUser.username && this.profile.username) {
        return this.currentUser.username === this.profile.username;
      }
      return false;
    },
    parseMarkdown(content = "") {
      return marked(content);
    },
    follow() {
      if (!this.isAuthenticated) return;
      this.$store.dispatch(FETCH_PROFILE_FOLLOW, this.$route.params);
    },
    unfollow() {
      this.$store.dispatch(FETCH_PROFILE_UNFOLLOW, this.$route.params);
    }
  },
  watch: {
    $route(to) {
      this.$store.dispatch(FETCH_PROFILE, to.params);
    }
  }
};

/* Reference this template when re-implementing the follow system:
<div v-else>
  <button
    v-if="profile.following"
    @click.prevent="unfollow()"
  >
    <i class="ion-plus-round"></i> &nbsp;Unfollow
    {{ profile.username }}
  </button>
  <button
    v-if="!profile.following"
    @click.prevent="follow()"
  >
    <i class="ion-plus-round"></i> &nbsp;Follow
    {{ profile.username }}
  </button>
</div>
*/
</script>
