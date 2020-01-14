<template>
  <div class="settings-page">
    <h1 class="settings-title">Your Settings</h1>
    <form @submit.prevent="updateSettings()">
      <fieldset>
        <fieldset class="img-form form-group">
          <label class="img-preview-label">Current Profile Picture:</label>
          <br />
          <img
            class="img-preview"
            alt="No Picture Uploaded"
            :src="currentUser.image"
          />
          <br />
          <!-- image-uploader props documentation:
            -- https://www.npmjs.com/package/vue-image-upload-resize#props
            -->
          <label class="visible-img-input">
            Update Profile Picture
            <image-uploader
              :debug="0"
              :maxWidth="200"
              :quality="0.9"
              :autoRotate="true"
              :preview="false"
              :className="['img-input']"
              :capture="false"
              accept="image/*"
              doNotResize="['gif', 'svg']"
              v-model="currentUser.image"
            />
          </label>
        </fieldset>
        <fieldset class="bio-form form-group">
          <label class="bio-label">
            Bio:
            <sup>
              <a href="https://commonmark.org/help/" target="blank_">
                markdown-compatible
              </a>
            </sup>
          </label>
          <br />
          <textarea
            class="bio-input"
            rows="8"
            v-model="currentUser.bio"
            placeholder="Short bio about you"
          ></textarea>
          <br />
          <label class="bio-preview-label">Bio Preview:</label>
          <p class="bio-preview" v-html="parseMarkdown(currentUser.bio)"></p>
        </fieldset>
        <fieldset class="form-group">
          <label class="username-label">Username:</label>
          <br />
          <input
            class="username-input"
            type="text"
            v-model="currentUser.username"
            placeholder="Your username"
          />
          <br />
          <label class="email-label">Email:</label>
          <br />
          <input
            class="email-input"
            type="text"
            v-model="currentUser.email"
            placeholder="Email"
          />
          <br />
          <label class="password-label">Password:</label>
          <br />
          <input
            class="password-input"
            type="password"
            v-model="currentUser.password"
            placeholder="password"
          />
        </fieldset>
        <br />
        <fieldset>
          <button class="submit-settings-button">
            Confirm Changes
          </button>
          <button @click="logout" class="logout-button">
            Log Out
          </button>
        </fieldset>
        <!-- <fieldset class="password-form form-group">
          <VuePassword
            class="password-input"
            v-model="currentUser.password"
            :disableStrength="false"
            type="password"
            new-password
          />
        </fieldset> -->
      </fieldset>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import marked from "marked";
import { LOGOUT, UPDATE_USER } from "@/store/actions.type";
import { VuePassword } from "vue-password";

export default {
  name: "RwvSettings",
  components: { VuePassword },
  computed: {
    ...mapGetters(["currentUser"])
  },
  methods: {
    updateSettings() {
      this.$store.dispatch(UPDATE_USER, this.currentUser).then(() => {
        const { username } = this.currentUser;
        this.$router.push({ path: `@${username}`, username });
      });
    },
    parseMarkdown(content = "") {
      return marked(content);
    },
    logout() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({ name: "home" });
      });
    }
  }
};
</script>
