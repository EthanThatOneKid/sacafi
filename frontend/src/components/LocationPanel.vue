<template>
  <div class="article-page">
    <h1>{{ article.title }}</h1>
    <button
      v-clipboard:copy="shareableUrl"
      v-clipboard:success="onShare"
      v-clipboard:error="onShareError"
    >
      <i class="ion-md-share-alt"></i>
    </button>
    <button v-on:click="exit">
      <i class="ion-md-close"></i>
    </button>
    <div v-html="parseMarkdown(article.description)"></div>
    <TagList :value="article.tagList"></TagList>
    <pre><code v-text="JSON.stringify(article, null, 2)"></code></pre>
    <hr />
    <div v-if="!article.requiresPassword">
      <span><i>no password necessary</i></span>
    </div>
    <div v-else>
      <h2>Secrets</h2>
      <SecretEditor :slug="slug" v-if="isAuthenticated"></SecretEditor>
      <p v-else>
        <router-link :to="{ name: 'login' }">Sign in</router-link>
        or
        <router-link :to="{ name: 'register' }">sign up</router-link>
        to add secrets on this location.
      </p>
      <SecretList
        :slug="slug"
        :secrets="passwords"
        @update="refreshSecrets"
      />
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
  FETCH_PASSWORDS
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
    const currUrl = location.toString().split("?").shift();
    return {
      shareableUrl: `${currUrl}?l=${this.slug}`
    };
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
    onShare(event) {
      console.log("share", {event});
    },
    onShareError(event) {
      console.log("share error", {event});
    }
  }
};
</script>
