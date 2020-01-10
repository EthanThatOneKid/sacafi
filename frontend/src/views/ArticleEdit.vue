<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <RwvListErrors :errors="errors" />
          <form v-on:submit.prevent="onPublish(article.slug)">
            <fieldset :disabled="inProgress">
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Location Title"
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Network name"
                  v-model="article.networkTitle"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="article.description"
                  placeholder="Give a brief description of this location..."
                />
              </fieldset>
              <fieldset class="form-group">
                <MapInput
                  :value="article.location"
                  v-on:input="updateTitle"
                  v-model="article.location"
                >
                </MapInput>
              </fieldset>
              <fieldset class="form-group">
                <input
                  id="isOpenAccessToggle"
                  type="checkbox"
                  class="form-control"
                  v-model="article.requiresPassword"
                />
                <label for="isOpenAccessToggle">Requires password</label>
              </fieldset>
              <fieldset class="form-group">
                <TagList :isEditable="true" v-model="article.tagList" />
              </fieldset>
            </fieldset>
            <button
              :disabled="inProgress"
              class="btn btn-lg pull-xs-right btn-primary"
              type="submit"
            >
              Publish Article
            </button>
          </form>
        </div>
      </div>
    </div>
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
  // watch: {
  //   article(article) {
  //     if (article !== undefined) {
  //       if (this.article.tagList !== undefined) {
  //         this.tagInput = this.article.tagList;
  //       }
  //     }
  //   }
  // },
  methods: {
    onPublish(slug) {
      let action = slug ? ARTICLE_EDIT : ARTICLE_PUBLISH;
      this.inProgress = true;
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.inProgress = false;
          this.$router.push(`locations?l=${data.article.slug}`);
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
