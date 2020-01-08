<template>
  <div class="profile-page">
    <div class="user-info">
      <div>
        <div>
          <div class="profile-info">
            <img :src="profile.image" class="user-img" />
            <h1>{{ profile.username }}</h1>
            <p>{{ profile.bio }}</p>
            <div v-if="isCurrentUser()">
              <router-link class="settings-link" :to="{ name: 'settings' }">
                <i class="ion-md-cog"></i>
                Edit Profile
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div>
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'profile' }"
                >
                  My Articles
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'profile-favorites' }"
                >
                  Favorited Articles
                </router-link>
              </li>
            </ul>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
