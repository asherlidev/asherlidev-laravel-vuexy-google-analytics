<template>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="a-logo"
  >
    <SfImage
      src="/assets/logo.png"
      :alt="$t(defaultTitle)"
      class="sf-header__logo"
    />
  </router-link>
</template>

<script>
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { SfImage } from '@storefront-ui/vue';
import get from 'lodash-es/get';

const storeView = currentStoreView();

export default {
  components: { SfImage },
  computed: {
    defaultTitle () {
      return get(storeView, 'seo.defaultTitle', config.seo.defaultTitle);
    }
  }
};
</script>
<style lang="scss" scoped>
.a-logo {
  display: inline-flex;
  order: 1;
}
::v-deep .sf-image img {
  width: 187px;
  height: auto;
  margin-right: 40px;
}
::v-deep .sf-header__logo-franchise img {
  width: 70px;
  height: auto;
  margin-left: 70px;
}
::v-deep .sf-header__logo-franchise {
overflow: visible;
display: flex;
justify-content: center;
align-items: center;
}

</style>
