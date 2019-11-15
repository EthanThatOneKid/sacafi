<template>
  <div>
    <div v-if="secrets.length > 0">
      <Secret
        :slug="slug"
        :secret="secrets[0]"
        @update="() => $emit('update')"
      />
      <details>
        <summary>see another</summary>
        <SecretList
          :slug="slug"
          :secrets="secrets.slice(1)"
          @update="() => $emit('update')"
        />
      </details>
    </div>
    <p v-else>no further tries available</p>
  </div>
</template>

<script>
import Secret from "./Secret";

export default {
  name: "SecretList",
  components: { Secret },
  props: {
    slug: { type: String, required: true },
    secrets: { type: Array, required: true }
  }
};
</script>
