<template>
  <div>
    So you wanna create a new Sacafi location
  </div>
</template>

<script>

import store from "@/store";
import {
  ARTICLE_PUBLISH,
  ARTICLE_EDIT,
  FETCH_ARTICLE,
  ARTICLE_EDIT_ADD_TAG,
  ARTICLE_EDIT_REMOVE_TAG,
  ARTICLE_RESET_STATE
} from "@/store/actions.type";

export default {
  name: "location-form",
  components: {},
  data() {
    return {
      
    };
  },
  methods: {
    submit(event) {
      console.log("submit", { event });
    }
  }
};
</script>
