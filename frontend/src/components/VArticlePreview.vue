<template>
  <div class="article-preview">
    <div class="article-heading">
      <span v-if="!article.requiresPassword"></span>
      <router-link :to="articleLink" class="preview-link">
        <h1 v-text="article.title" />
        <p v-text="article.description" />
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
