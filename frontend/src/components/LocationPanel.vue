<template>
  <div class="article-page">
    <div class="header">
      <div class="article-info">
        <h1 class="article-title">{{ article.title }}</h1>
        <p class="article-author">
          <a :href="authorUrl">@{{ article.author.username }}</a>
          |
          <code class="article-date">{{ publishDate }}</code>
        </p>
      </div>
      <div class="article-menu">
        <button v-on:click="exit">
          <i class="ion-md-close"></i>
        </button>
        <br />
        <button v-on:click="onFavorite">
          <i :class="favoriteClass"></i>
        </button>
        <br />
        <button
          v-clipboard:copy="shareableUrl"
          v-clipboard:success="onShare"
          v-clipboard:error="onShareError"
        >
          <i class="ion-md-share-alt"></i>
        </button>
      </div>
    </div>
    <div class="article-tags">
      <TagList :value="tags"></TagList>
    </div>
    <div class="article-description">
      <p>Description:</p>
      <p v-html="parseMarkdown(article.description)"></p>
    </div>
    <hr />
    <div class="network-info">
      <p>
        Network:
        <code>{{ article.networkTitle }}</code>
        <button
          v-clipboard:copy="article.networkTitle"
          v-clipboard:success="onShare"
          v-clipboard:error="onShareError"
        >
          <i class="ion-md-copy"></i>
        </button>
      </p>
    </div>
    <div v-if="!article.requiresPassword">
      <span><i>no password necessary</i></span>
    </div>
    <div class="secret-section" v-else>
      <SecretEditor :slug="slug" v-if="isAuthenticated"></SecretEditor>
      <p v-else>
        <router-link :to="{ name: 'login' }">Sign in</router-link>
        or
        <router-link :to="{ name: 'register' }">sign up</router-link>
        to add secrets on this location.
      </p>
      <SecretList :slug="slug" :secrets="passwords" @update="refreshSecrets" />
    </div>
    <hr />
    <h2>Comments</h2>
    <RwvCommentEditor
      v-if="isAuthenticated"
      :slug="slug"
      :userImage="currentUser.image"
    >
    </RwvCommentEditor>
    <p v-else>
      <router-link :to="{ name: 'login' }">Sign in</router-link>
      or
      <router-link :to="{ name: 'register' }">sign up</router-link>
      to add comments on this location.
    </p>
    <RwvComment
      v-for="(comment, index) in comments"
      :slug="slug"
      :comment="comment"
      :key="index"
    >
    </RwvComment>
    <pre><code v-text="JSON.stringify(article, null, 2)"></code></pre>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import marked from "marked";
import store from "@/store";
import RwvComment from "@/components/Comment";
import RwvCommentEditor from "@/components/CommentEditor";
import SecretList from "@/components/SecretList";
import SecretEditor from "@/components/SecretEditor";
import TagList from "@/components/TagList";
import {
  FETCH_ARTICLE,
  FETCH_COMMENTS,
  FETCH_PASSWORDS,
  FAVORITE_ADD,
  FAVORITE_REMOVE
} from "@/store/actions.type";

export default {
  name: "LocationPanel",
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  components: {
    RwvComment,
    RwvCommentEditor,
    TagList,
    SecretList,
    SecretEditor
  },
  data() {
    const baseUrl =
      location
        .toString()
        .split("#")
        .shift() + "#/";
    return {
      baseUrl,
      shareableUrl: `${baseUrl}locations?l=${this.slug}`,
      authorUrl: "",
      publishDate: "",
      tags: [],
      favoriteClass: "ion-md-heart-empty"
    };
  },
  watch: {
    article(article) {
      if (article !== undefined) {
        this.authorUrl = `${this.baseUrl}@${this.article.author.username}`;
        this.publishDate = this.article.createdAt.split("T").shift();
        this.tags = this.article.tagList;
        this.favoriteClass = `ion-md-${
          this.article.favorited ? "heart" : "heart-empty"
        }`;
      }
    }
  },
  created() {
    Promise.all([
      store.dispatch(FETCH_ARTICLE, this.slug),
      store.dispatch(FETCH_COMMENTS, this.slug),
      store.dispatch(FETCH_PASSWORDS, this.slug)
    ]);
  },
  computed: {
    ...mapGetters([
      "article",
      "currentUser",
      "comments",
      "isAuthenticated",
      "passwords"
    ])
  },
  methods: {
    parseMarkdown(content) {
      return marked(content);
    },
    exit() {
      this.$emit("exit");
    },
    refreshSecrets() {
      this.$store.dispatch(FETCH_PASSWORDS, this.slug);
    },
    onFavorite() {
      this.toggleFavorite();
    },
    toggleFavorite() {
      this.$store.dispatch(
        this.article.favorited ? FAVORITE_REMOVE : FAVORITE_ADD,
        this.slug
      );
      this.favoriteClass = `ion-md-${
        this.article.favorited ? "heart-empty" : "heart"
      }`;
    },
    onShare() {
      this.$notify({
        text: "Copied to clipboard",
        type: "copy-success"
      });
    },
    onShareError() {
      this.$notify({
        text: "Failed to copy to clipboard",
        type: "copy-error"
      });
    }
  }
};
</script>
