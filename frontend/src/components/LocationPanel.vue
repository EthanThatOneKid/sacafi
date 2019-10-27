<template>
  <div class="article-page">
    <h1>{{ article.title }}</h1>
    <i class="ion-md-close" v-on:click="exit"></i>
    <i><div v-html="parseMarkdown(article.description)"></div></i>
    <TagList :value="article.tagList"></TagList>
    <pre><code v-text="JSON.stringify(article, null, 2)"></code></pre>
    <hr />
    <div v-if="article.isOpenAccess">
      <i>no password necessary</i>
    </div>
    <div v-else>
      <h2>Passwords</h2>
      <SecretEditor :slug="slug"></SecretEditor>
      <Secret
        v-for="(secretData, index) in passwords"
        :slug="slug"
        :secret="secretData"
        :key="index"
      >
      </Secret>
      <SecretList :slug="slug"></SecretList>
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
    TagList
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
    }
  }
};
</script>
