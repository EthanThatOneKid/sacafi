<template>
  <div class="article-preview">
    <div class="article-heading">
      <span v-if="!article.requiresPassword"></span>
      <router-link :to="articleLink" class="preview-link">
        <h1 v-text="abbreviate(article.title, 40)" />
        <p v-text="abbreviate(article.description, 100)" />
      </router-link>
    </div>
    <RwvArticleMeta isPreview :article="article" />
  </div>
</template>

<script>
import RwvArticleMeta from "./ArticleMeta";

export default {
  name: "RwvArticlePreview",
  components: {
    RwvArticleMeta
  },
  props: {
    article: { type: Object, required: true }
  },
  methods: {
    abbreviate(message, limit = 100) {
      const isNecessary = message.length > limit;
      const ellipses = "...";
      return isNecessary
        ? [...message].slice(0, limit + ellipses.length).join("") + ellipses
        : message;
    }
  },
  computed: {
    articleLink() {
      return {
        name: "locations",
        query: {
          l: this.article.slug
        }
      };
    }
  }
};
</script>
