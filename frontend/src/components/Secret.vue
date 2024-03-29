<template>
  <div class="secret">
    <div class="header">
      <div class="secret-info">
        <code class="secret-value">{{ secret.secret }}</code>
        &nbsp;
        <code class="secret-published">{{
          secret.createdAt.split("T")[0]
        }}</code>
      </div>
      <div class="secret-copy-container">
        <button
          v-clipboard:copy="secret.secret"
          v-clipboard:success="onCopy"
          v-clipboard:error="onCopyError"
        >
          <i class="ion-md-copy"></i>
        </button>
      </div>
    </div>
    <div class="secret-options">
      <button class="approval-button" v-on:click="approve(slug, secret.id)">
        <i class="ion-md-thumbs-up"></i>
        <br />
        <span class="approvals">{{ secret.approvals.length }}</span>
      </button>
      <button
        class="disapproval-button"
        v-on:click="disapprove(slug, secret.id)"
      >
        <i class="ion-md-thumbs-down"></i>
        <br />
        <span class="disapprovals">{{ secret.disapprovals.length }}</span>
      </button>
      <code class="secret-score">{{ secret.rating }}</code>
      <span v-if="isCurrentUser" class="mod-options">
        <i class="ion-md-trash" v-on:click="destroy(slug, secret.id)"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  PASSWORD_DESTROY,
  PASSWORD_APPROVE,
  PASSWORD_DISAPPROVE,
  PASSWORD_UNAPPROVE,
  PASSWORD_UNDISAPPROVE
} from "@/store/actions.type";

export default {
  name: "Secret",
  props: {
    slug: { type: String, required: true },
    secret: { type: Object, required: true }
  },
  computed: {
    isCurrentUser() {
      if (this.currentUser.username && this.secret.author.username) {
        return this.secret.author.username === this.currentUser.username;
      }
      return false;
    },
    ...mapGetters(["currentUser"])
  },
  methods: {
    destroy(slug, passwordId) {
      this.$store.dispatch(PASSWORD_DESTROY, { slug, passwordId });
    },
    approve(slug, passwordId) {
      return (this.isCurrentlyApproved()
        ? this.$store.dispatch(PASSWORD_UNAPPROVE, { slug, passwordId })
        : this.$store.dispatch(PASSWORD_APPROVE, { slug, passwordId })
      ).then(() => this.$emit("update"));
    },
    disapprove(slug, passwordId) {
      return (this.isCurrentlyDisapproved()
        ? this.$store.dispatch(PASSWORD_UNDISAPPROVE, { slug, passwordId })
        : this.$store.dispatch(PASSWORD_DISAPPROVE, { slug, passwordId })
      ).then(() => this.$emit("update"));
    },
    isCurrentlyApproved() {
      return this.secret.approvals.indexOf(this.currentUser.id) > -1;
    },
    isCurrentlyDisapproved() {
      return this.secret.disapprovals.indexOf(this.currentUser.id) > -1;
    },
    onCopy() {
      this.showCopySuccess();
    },
    onCopyError() {
      this.showCopyError();
    }
  },
  notifications: {
    showCopySuccess: {
      title: "Copied!",
      message: "Copied wifi password to clipboard",
      type: "success"
    },
    showCopyError: {
      title: "Copy Failed!",
      message: "Failed to copy to clipboard",
      type: "error"
    }
  }
};
</script>
