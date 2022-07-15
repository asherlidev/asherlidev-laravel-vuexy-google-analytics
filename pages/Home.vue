<template>
  <div id="home">
    <OmHero />
    <SfSection class="section" :title-heading="$t('Shop By Brand')">
      <OmCardCollection class="card-collection" />
    </SfSection>
    <SfBanner
      title="Eco Sandals"
      description="The collection features formal and casual comfort shoes with a Danish design focus. Made from premium leathers and comfort."
      button-text="Shop Now"
      image="https://res.cloudinary.com/omniauto/image/upload/v1630430684/Screenshot_2021-08-31_at_18.23.50.png"
    />
    <SbSlider />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { Logger } from '@vue-storefront/core/lib/logger';
import { isServer, onlineHelper } from '@vue-storefront/core/helpers';
import { checkWebpSupport } from 'theme/helpers';
import OmHero from 'theme/components/omni/om-hero/index';
import OmBrandLogos from 'theme/components/omni/om-brand-logos';
import OmCardCollection from 'theme/components/omni/om-card-collection/index';
import SbSlider from 'theme/components/storyblok/sb-slider.vue';

import { SfHero, SfSection, SfBannerGrid, SfBanner, SfTile } from '@storefront-ui/vue'; export default {
  name: 'Home',
  components: {
    SfSection,
    SfBanner,
    SfTile,
    OmHero,
    OmBrandLogos,
    OmCardCollection,
    SbSlider
  },
  data () {
    return {
      loading: true,
      loadNewsletterPopup: false
    };
  },
  computed: {
    ...mapState({
      isWebpSupported: (state) => state.ui.isWebpSupported
    }),
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      heroImages: 'promoted/getHeadImage',
      promotedOffers: 'promoted/getPromotedOffers',
      newCollection: 'homepage/getEverythingNewCollection',
      dummyInstagramImages: 'instagram/getInstagramImages',
      storyblokContent: 'vehicles/storyblokContent'
    }),
    isOnline () {
      return onlineHelper.isOnline;
    },
    banners () {
      return checkWebpSupport(
        this.promotedOffers.mainBanners,
        this.isWebpSupported
      );
    },
    heroes () {
      return checkWebpSupport(this.heroImages, this.isWebpSupported);
    },
    instagramImages () {
      return checkWebpSupport(this.dummyInstagramImages, this.isWebpSupported);
    }
  },
  watch: {
    isLoggedIn () {
      const redirectObj = localStorage.getItem('redirect');
      if (redirectObj) this.$router.push(redirectObj);
      localStorage.removeItem('redirect');
    }
  },
  async asyncData ({ store, context }) {
    Logger.info('Calling asyncData in Home (theme)')();
    if (context) context.output.cacheTags.add(`home`);

    await Promise.all([
      store.dispatch('homepage/fetchNewCollection'),
      store.dispatch('promoted/updateHeadImage'),
      store.dispatch('instagram/updateInstagramImages')
    ]);
    if (context) context.output.cacheTags.add(`storyblok`)
  },
  async mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$bus.$emit('modal-show', 'modal-signup');
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!isServer && !from.name) {
      next((vm) => {
        vm.$store.dispatch('homepage/fetchNewCollection').then(() => {
          vm.loading = false;
        });
      });
    } else {
      next();
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || this.$i18n.t('Home Page'),
      meta: this.$route.meta.description
        ? [
          {
            vmid: 'description',
            name: 'description',
            content: this.$route.meta.description
          }
        ]
        : []
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#home {
  box-sizing: border-box;
  padding: 0;
  background: var(--c-light-variant);
  @include for-desktop {
    max-width: 100%;
    margin: 0 auto;
  }
}
.sf-hero-item {
  --hero-item-height: 14rem;
  height: initial;
}
.banner-grid {
  margin: var(--spacer-base) 0;
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
  }
}
.brand-logos {
  margin-bottom: var(--spacer-xl);
}
::v-deep .section {
  padding: 0 var(--spacer-xl);
  --section-margin: var(--spacer-xl) 0;
  --section-content-margin: var(--spacer-xl) 0 0 0;
  .sf-heading__title.sf-heading__title--h2 {
    font-weight: 700;
    font-size: 26px;
    color: #444444;
  }
}
</style>
