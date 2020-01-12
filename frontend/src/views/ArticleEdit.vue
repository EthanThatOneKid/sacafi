<template>
  <div class="editor-page">
    <RwvListErrors :errors="errors" />
    <form v-on:submit.prevent="onPublish(article.slug)">
      <fieldset :disabled="inProgress">
        <div class="meta-map-row">
          <div class="location-metadata">
            <div class="meta-info-container">
              <fieldset class="form-group meta-info">
                <h1 class="title-label" data-text="Location Title:">
                  Location Title:
                </h1>
                <br />
                <input
                  type="text"
                  class="title-input form-control"
                  placeholder="Location Title"
                  v-model="article.title"
                />
              </fieldset>
            </div>
            <h1>Location Metadata:</h1>
            <div class="required-metadata">
              <fieldset class="form-group meta-info">
                <label class="description-label">Location Description:</label>
                <br />
                <textarea
                  class="description-input form-control"
                  v-model="article.description"
                  rows="7"
                  placeholder="Give a brief description of this location..."
                />
              </fieldset>
              <fieldset class="form-group meta-info">
                <label class="network-label">Network Name:</label>
                <br />
                <input
                  type="text"
                  class="network-input form-control"
                  placeholder="Network Name"
                  v-model="article.networkTitle"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  id="isOpenAccessToggle"
                  type="checkbox"
                  class="open-access-toggle form-control"
                  v-model="article.requiresPassword"
                />
                <label for="isOpenAccessToggle"
                  >Network Requires Password</label
                >
              </fieldset>
            </div>
            <fieldset class="tags-input-container form-group">
              <label class="tags-label">Tags:</label>
              <TagList :isEditable="true" v-model="article.tagList" />
            </fieldset>
            <button :disabled="inProgress" class="publish-button" type="submit">
              Confirm Location Data
            </button>
          </div>
          <fieldset class="map-input-container form-group">
            <MapInput
              :value="article.location"
              v-on:input="updateTitle"
              v-model="article.location"
            >
            </MapInput>
          </fieldset>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import RwvListErrors from "@/components/ListErrors";
import MapInput from "@/components/MapInput";
import TagList from "@/components/TagList";
import {
  ARTICLE_EDIT,
  ARTICLE_EDIT_ADD_TAG,
  ARTICLE_EDIT_REMOVE_TAG,
  ARTICLE_PUBLISH,
  ARTICLE_RESET_STATE,
  FETCH_ARTICLE,
  FETCH_OSM
} from "@/store/actions.type";

export default {
  name: "RwvArticleEdit",
  components: { RwvListErrors, MapInput, TagList },
  props: {
    previousArticle: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate(to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(ARTICLE_RESET_STATE);
    return next();
  },
  async beforeRouteEnter(to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the article
    await store.dispatch(ARTICLE_RESET_STATE);
    if (to.params.slug !== undefined) {
      await store.dispatch(
        FETCH_ARTICLE,
        to.params.slug,
        to.params.previousArticle
      );
    }
    return next();
  },
  async beforeRouteLeave(to, from, next) {
    await store.dispatch(ARTICLE_RESET_STATE);
    next();
  },
  data() {
    return {
      tagInput: null,
      inProgress: false,
      errors: {}
    };
  },
  computed: {
    ...mapGetters(["article"])
  },
  methods: {
    onPublish(slug) {
      let action = slug ? ARTICLE_EDIT : ARTICLE_PUBLISH;
      this.inProgress = true;
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.inProgress = false;
          this.$router.replace({
            name: "locations",
            query: {
              l: data.article.slug
            }
          });
        })
        .catch(({ response }) => {
          this.inProgress = false;
          this.errors = response.data.errors;
        });
    },
    removeTag(tag) {
      this.$store.dispatch(ARTICLE_EDIT_REMOVE_TAG, tag);
    },
    addTag(tag) {
      this.$store.dispatch(ARTICLE_EDIT_ADD_TAG, tag);
      this.tagInput = null;
    },
    updateTitle(location) {
      const [lng, lat] = location.coordinates;
      const coord = { lat, lng };
      this.$store.dispatch(FETCH_OSM, coord).then(({ data }) => {
        if (!!data.name && data.name.length > 0) {
          this.article.title = data.name;
        }
      });
    }
  }
};
</script>
