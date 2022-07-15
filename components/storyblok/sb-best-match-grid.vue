<template>
  <div class="sb-best-match-grid">
    <OmCard
      v-for="(card, index) in cards"
      :key="index"
      :info="card"
    />
  </div>
</template>

<script>
import OmCard from '../omni/om-card-collection/om-card.vue';

export default {
  name: 'SbBestMatchGrid',
  components: {
    OmCard
  },
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    cards () {
      if (this.content) {
        return this.content.logos.map(logo =>
          ({
            imgUrl: logo.logo.filename,
            title: logo.title,
            text: logo.description
          }))
      } else {
        return []
      }
    }
  }
};
</script>
<style lang="scss">
.sb-best-match-grid {
  margin: var(--spacer-2xl) 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: var(--spacer-xl);
}
</style>
