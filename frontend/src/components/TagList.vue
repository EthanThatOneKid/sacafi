<template>
  <div>
    <ul class="tag-list">
      <li class="tag-pill" v-for="(tag, index) of tags" :key="index">
        <span v-text="tag" />
      </li>
    </ul>
    <input
      type="text"
      class="form-control"
      placeholder="Enter tags (comma-seperated)"
      list="tagOptions"
      v-model="tagInput"
      v-on:keypress.enter.prevent="addTag(tagInput)"
    />
    <datalist id="tagOptions">
      <option v-for="tagOption of tagOptions" :key="tagOption">
        {{ tagOption }}
      </option>
    </datalist>
  </div>
</template>

<script>
export default {
  name: "TagList",
  props: {
    tags: Array,
    isEditable: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      tagOptions: ["cafe", "quiet", "library"]
    };
  }
};
</script>
