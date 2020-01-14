<template>
  <div class="home-page">
    <div class="splash">
      <img class="logo" src="logo.svg" />
      <h1 class="title">Sacafi</h1>
    </div>
    <div class="home-info">
      <p class="about">
        Welcome to Sacafi! This platform allows you to locate and discover new
        places local to you that provide wifi access. Help your community by
        posting about locations that you visit and by verifying other users'
        findings by upvoting useful secrets. The more positive upvotes that you
        receive on your secrets the more points will appear by your profile
        picture on your profile page.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvTag from "@/components/VTag";
import { FETCH_TAGS } from "@/store/actions.type";

export default {
  name: "home",
  components: {
    RwvTag
  },
  mounted() {
    this.$store.dispatch(FETCH_TAGS);
  },
  computed: {
    ...mapGetters(["isAuthenticated", "tags"]),
    tag() {
      return this.$route.params.tag;
    }
  }
};

// Reference this when reimplementing feed system:
// <div class="feed-toggle">
//   <ul class="nav">
//     <li v-if="isAuthenticated" class="nav-item">
//       <router-link
//         :to="{ name: 'home-my-feed' }"
//         class="nav-link"
//         active-class="active"
//       >
//         Your Feed
//       </router-link>
//     </li>
//     <li class="nav-item">
//       <router-link
//         :to="{ name: 'home' }"
//         exact
//         class="nav-link"
//         active-class="active"
//       >
//         Global Feed
//       </router-link>
//     </li>
//     <li class="nav-item" v-if="tag">
//       <router-link
//         :to="{ name: 'home-tag', params: { tag } }"
//         class="nav-link"
//         active-class="active"
//       >
//         <i class="ion-pound"></i> {{ tag }}
//       </router-link>
//     </li>
//   </ul>
// </div>
// <router-view></router-view>
// <div class="sidebar">
//   <p>Popular Tags</p>
//   <div class="tag-list">
//     <RwvTag v-for="(tag, index) in tags" :name="tag" :key="index"> </RwvTag>
//   </div>
// </div>
</script>
