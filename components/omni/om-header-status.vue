<template>
  <div class="om-header-status">
    <div
      v-for="item in confidenceBarItems"
      :key="item._uid"
      class="status-item"
    >
      <div class="status-item__title">
        {{ item.confidence_title }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { SfImage } from '@storefront-ui/vue';

export default {
  name: 'OmHeaderStatus',
  components: {
    SfImage
  },
  computed: {
    ...mapGetters('vehicles', ['storyblok']),
    confidenceBarItems () {
      if (this.storyblok['global']) {
        const confidenceBar = this.storyblok['global']['header_links'].find(
          item => item.component === 'Confidence Bar'
        );
        return confidenceBar ? confidenceBar.confidence_message : [];
      } else {
        return [];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-header-status {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--c-primary);
  color: white;

  .status-item {
    display: flex;
    justify-content: center;
    align-items: center;

    &__title {
      margin-left: 1em;
    }
  }
}
</style>
