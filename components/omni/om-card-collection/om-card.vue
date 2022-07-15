<template>
  <div class="om-card">
    <SfImage :src="info.imgUrl" loading="lazy" class="image" :alt="info.text" />
    <h1>{{ info.title }}</h1>
    <p>{{ info.text }}</p>
    <div class="link">
      <span class="link-text">More details</span>
      <SfIcon
        icon="chevron_right"
        size="xxs"
        color="green-primary"
        view-box="0 0 24 24"
        :coverage="1"
      />
    </div>
  </div>
</template>

<script>
import { SfImage, SfIcon } from '@storefront-ui/vue';

export default {
  name: 'OmCard',
  components: {
    SfImage,
    SfIcon
  },
  props: {
    info: {
      type: Object,
      default: () => ({
        imgUrl: 'https://cdn.shopify.com/s/files/1/0081/3229/6819/files/BMW_Teaser_Accessoire_Interior.jpg?9121191146221420472',
        text: 'Card Text',
        title: 'Cart Title'
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-card {
  display: flex;
  flex-direction: column;
  width: 100% !important;
  color: var(--c-grey-text);
  h1 {
    margin-top: var(--spacer-xl);
    margin-bottom: 0;
  }
  .sf-image {
    border-radius: 0;
  }
  .link {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    color: var(--c-primary);
    font-weight: 700;
    font-size: 18px;
    .sf-icon {
      margin-left: var(--spacer-xl);
    }
  }
}
::v-deep .sf-image--has-size {
  width: 100%;
  max-width: none;
}
</style>
