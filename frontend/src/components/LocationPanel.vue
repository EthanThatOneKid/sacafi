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
        <button v-on:click="onFavorite">
          <i :class="favoriteClass"></i>
        </button>
        <button
          v-clipboard:copy="shareableUrl"
          v-clipboard:success="onShare"
          v-clipboard:error="onShareError"
        >
          <i class="ion-md-share-alt"></i>
        </button>
        <router-link v-if="isCurrentUser()" :to="editArticleLink">
          <button><i class="ion-md-create"></i></button>
        </router-link>
        <button v-if="isCurrentUser()" @click="deleteArticle">
          <i class="ion-md-trash"></i>
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
          v-clipboard:success="onCopyNetwork"
          v-clipboard:error="onCopyNetworkError"
        >
          <i class="ion-md-copy"></i>
        </button>
      </p>
    </div>
    <div v-if="!article.requiresPassword">
      <span><i>no password necessary</i></span>
    </div>
    <div class="secret-section" v-else>
      <div v-if="isAuthenticated">
        <SecretEditor :slug="slug"></SecretEditor>
        <SecretList
          :slug="slug"
          :secrets="passwords"
          @update="refreshSecrets"
        />
      </div>
      <p v-else class="signin-warning">
        <router-link :to="{ name: 'login' }">Sign in</router-link>
        or
        <router-link :to="{ name: 'register' }">sign up</router-link>
        to view add secrets to this location.
      </p>
    </div>
    <hr />
    <h2>Comments</h2>
    <RwvCommentEditor
      v-if="isAuthenticated"
      :slug="slug"
      :userImage="currentUser.image"
    >
    </RwvCommentEditor>
    <p v-else class="signin-warning">
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
  FAVORITE_REMOVE,
  ARTICLE_DELETE
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
        this.tags = this.article.tagList;
        this.favoriteClass = `ion-md-${
          this.article.favorited ? "heart" : "heart-empty"
        }`;
        if (this.article.createdAt !== undefined) {
          this.publishDate = this.article.createdAt.split("T").shift();
        }
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
    ]),
    editArticleLink() {
      return { name: "article-edit", params: { slug: this.article.slug } };
    }
  },
  methods: {
    parseMarkdown(content) {
      return marked(content);
    },
    isCurrentUser() {
      if (this.currentUser.username && this.article.author.username) {
        return this.currentUser.username === this.article.author.username;
      }
      return false;
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
      if (this.article.favorited) {
        this.$store.dispatch(FAVORITE_REMOVE);
        this.favoriteClass = "ion-md-heart-empty";
      } else {
        this.$store.dispatch(FAVORITE_ADD);
        this.favoriteClass = "ion-md-heart";
      }
    },
    onShare() {
      const message = `Copied sharable link for '${this.article.title}'`;
      this.showCopySuccess({ message });
    },
    onShareError() {
      const message = "Failed to copy sharable link";
      this.showCopyError({ message });
    },
    onCopyNetwork() {
      const message = "Copied network name";
      this.showCopySuccess({ message });
    },
    onCopyNetworkError() {
      const message = "Failed to copy network name";
      this.showCopyError({ message });
    },
    async deleteArticle() {
      try {
        await this.$store.dispatch(ARTICLE_DELETE, this.article.slug);
        this.showDeleteSuccess();
        this.$router.push({
          name: "profile",
          username: this.currentUser.username
        });
      } catch (err) {
        console.error(err);
      }
    }
  },
  notifications: {
    showCopySuccess: {
      title: "Copied!",
      type: "success"
    },
    showCopyError: {
      title: "Copy Failed!",
      type: "error"
    },
    showDeleteSuccess: {
      title: "Removed Location!",
      message: "Removed this location from Sacafi!",
      type: "success"
    }
  }
};
</script>
