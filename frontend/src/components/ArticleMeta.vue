<template>
  <div class="article-meta">
    <router-link
      :to="{ name: 'profile', params: { username: article.author.username } }"
    >
      <img class="author-image" :src="article.author.image" />
    </router-link>
    <span>&nbsp;|&nbsp;</span>
    <router-link
      :to="{ name: 'profile', params: { username: article.author.username } }"
      class="author"
    >
      @{{ article.author.username }}
    </router-link>
    <span>&nbsp;|&nbsp;</span>
    <span class="date">{{ createdAt }}</span>
    <span>&nbsp;|&nbsp;</span>
    <button v-if="!actions" v-on:click="toggleFavorite">
      <i
        :class="{
          'ion-md-heart': article.favorited,
          'ion-md-heart-empty': !article.favorited
        }"
      ></i>
      <br />
      <span class="counter"> {{ article.favoritesCount }} </span>
    </button>
    <router-link v-if="isCurrentUser()" :to="editArticleLink">
      <button><i class="ion-md-create"></i></button>
    </router-link>
    <button v-if="isCurrentUser()" @click="deleteArticle">
      <i class="ion-md-trash"></i>
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvArticleActions from "@/components/ArticleActions";
import {
  FAVORITE_ADD,
  FAVORITE_REMOVE,
  ARTICLE_DELETE
} from "@/store/actions.type";

export default {
  name: "RwvArticleMeta",
  components: {
    RwvArticleActions
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    actions: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    editArticleLink() {
      return { name: "article-edit", params: { slug: this.article.slug } };
    },
    createdAt() {
      return this.article.createdAt !== undefined
        ? new Date(this.article.createdAt)
            .toISOString()
            .split("T")
            .shift()
        : "";
    }
  },
  methods: {
    isCurrentUser() {
      if (this.currentUser.username && this.article.author.username) {
        return this.currentUser.username === this.article.author.username;
      }
      return false;
    },
    toggleFavorite() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      const action = this.article.favorited ? FAVORITE_REMOVE : FAVORITE_ADD;
      this.$store.dispatch(action, this.article.slug);
    },
    async deleteArticle() {
      try {
        await this.$store.dispatch(ARTICLE_DELETE, this.article.slug);
        this.$router.push("/"); // TODO: Just reload page
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
