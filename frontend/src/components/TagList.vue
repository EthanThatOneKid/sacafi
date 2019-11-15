<template>
  <div>
    <ul class="tag-list">
      <li
        class="tag-pill"
        v-for="(tag, index) of tagList"
        :key="`tag-idx-${index}-${~~(1e3 * Math.random())}`"
      >
        <span v-if="isEditable">
          <input
            v-if="isEditable"
            type="text"
            :key="`tag-input-${index}`"
            :value="tag"
            class="form-control"
            placeholder="enter a tag"
            list="tagOptions"
            v-on:change="event => updateTag(event, index)"
            v-on:keypress.enter.prevent="event => updateTag(event, index)"
          />
          <i class="ion-md-trash" v-on:click="removeTag(index)"></i>
        </span>
        <span v-else v-text="tag" />
      </li>
      <li class="add-tag" v-if="isEditable" key="add-tag">
        <i class="ion-md-add-circle-outline" v-on:click="addTag"></i>
        <datalist id="tagOptions">
          <option v-for="tagOption of tagOptions" :key="`tag-opt-${tagOption}`">
            {{ tagOption }}
          </option>
        </datalist>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TagList",
  props: {
    value: {
      type: Array,
      required: false
    },
    isEditable: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      tagOptions: ["cafe", "quiet", "library"],
      tagList: [],
      tagThresh: 10
    };
  },
  watch: {
    value(tags) {
      if (tags !== undefined) {
        this.tagList = tags;
      }
    }
  },
  methods: {
    addTag() {
      const isTooManyTags = this.tagList.length + 1 > this.tagThresh;
      const isLastTagPopulated =
        this.tagList.length === 0 ||
        this.tagList[this.tagList.length - 1].length !== 0;
      if (!isTooManyTags && isLastTagPopulated) {
        this.tagList.push("");
      }
    },
    updateTag({ target }, index) {
      let { value } = target;
      if (value.length === 0) {
        setTimeout(() => this.removeTag(index), 0);
        return;
      }
      this.tagList[index] = value.toLowerCase().replace(/\s/, "-");
      const data = [...new Set(this.tagList.filter(tag => tag.length > 0))];
      this.$emit("input", data);
    },
    removeTag(index) {
      this.tagList.splice(index, 1);
    }
  }
};
</script>
