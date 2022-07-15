<template>
  <SfSidebar
    :visible="isMicrocartOpen && isMicrocartVisible"
    class="sf-sidebar--right sf-sidebar--icon o-microcart-panel"
    @close="closeSidebar"
  >
    <template v-if="totalItems" #content-top>
      <SfProperty
        class="sf-property--large"
        :name="$t('Total items')"
        :value="productsCount"
      />
    </template>
    <div v-for="(brand, index) in Object.keys(productsGroupByDelivery)" :key="index">
      <div v-if="productsGroupByDelivery[brand].length" class="collection-group">
        <div v-if="brand === 'home'" class="collection-group__title">
          <SfImage :width="30" :height="40" src="/assets/icons8-large-courier-truck-64.png" />
          <b>Home Delivery</b>
        </div>
        <div v-else class="collection-group__title">
          <SfImage :width="30" :height="40" src="/assets/icons8-large-courier-truck-64.png" />
          <b>Collect In Store: </b>
          {{ getBrandLocation(brand) }}
        </div>
        <OMicrocartPanelList :products="productsGroupByDelivery[brand]" />
      </div>
    </div>
    <div v-if="!totalItems">
      <transition name="fade" mode="out-in">
        <div key="empty-cart" class="empty-cart">
          <div class="empty-cart__banner">
            <SfImage
              :src="require('@storefront-ui/shared/icons/empty_cart.svg')"
              :alt="$t('Your bag is empty')"
              class="empty-cart__image"
            />
            <SfHeading
              :title="$t('Your bag is empty')"
              :subtitle="
                $t(
                  'Looks like you haven’t added any items to the bag yet. Start shopping to fill it in.'
                )
              "
              :level="2"
              class="empty-cart__heading"
            />
          </div>
        </div>
      </transition>
    </div>
    <template #content-bottom>
      <transition name="fade">
        <div v-if="totalItems">
          <SfProperty
            class="sf-property--full-width my-cart__total-price"
            v-for="total in totals"
            :key="total.code"
          >
            <template #name>
              <span class="sf-property__name">{{ total.title }}</span>
            </template>
            <template #value>
              <SfPrice :regular="total.value | price" />
            </template>
          </SfProperty>
          <SfButton
            class="sf-button--full-width color-secondary"
            @click.native="goToCheckout"
          >
            {{ $t("Go to checkout") }}
          </SfButton>
        </div>
        <div v-else>
          <SfButton
            class="sf-button--full-width color-primary"
            @click.native="startShopping"
          >
            {{ $t("Start shopping") }}
          </SfButton>
        </div>
      </transition>
    </template>
  </SfSidebar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import VueOfflineMixin from 'vue-offline/mixin';
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress';
import { getLocationByBrand } from 'theme/store/locations-storage.ts';
import OMicrocartPanelList from './o-microcart-panel-list.vue';
import { chunkCartItems } from 'theme/helpers/index'
import {
  SfButton,
  SfCollectedProduct,
  SfProperty,
  SfPrice,
  SfImage,
  SfHeading,
  SfSidebar
} from '@storefront-ui/vue';
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import config from 'config'

export default {
  components: {
    SfButton,
    SfCollectedProduct,
    SfProperty,
    SfPrice,
    SfImage,
    SfHeading,
    SfSidebar,
    OMicrocartPanelList
  },
  mixins: [VueOfflineMixin, onEscapePress],
  data () {
    return {
      isMicrocartVisible: false
    };
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      totals: 'cart/getTotals',
      isMicrocartOpen: 'ui/isMicrocartOpen',
      getAttributeLabelById: 'vehicles/getAttributeLabelById',
      cartToken: 'cart/getCartToken',
      userToken: 'user/getToken'
    }),
    totalItems () {
      return this.productsInCart.length;
    },
    productsCount () {
      let count = 0;
      this.productsInCart.forEach(product => {
        count = count + parseInt(product.qty);
      });
      return count;
    },
    productsGroupByDelivery () {
      return chunkCartItems(this.productsInCart)
    }
  },
  methods: {
    ...mapActions({
      closeSidebar: 'ui/closeSidebar'
    }),
    closeMicrocartExtend () {
      this.$store.dispatch('ui/closeMicrocart');
    },
    onEscapePress () {
      this.closeMicrocartExtend();
    },
    startShopping () {
      this.$router.push(localizedRoute('/'));
      this.closeMicrocartExtend();
    },
    async goToCheckout () {
      await this.$store.dispatch('cart/async', {
        forceClientState: true,
        forceSync: true
      })
      const externalCheckoutConfig = { ...config.externalCheckout };
      const cmsUrl = externalCheckoutConfig.cmsUrl;
      const stores = externalCheckoutConfig.stores;
      const storeCode = currentStoreView().storeCode
      const multistoreEnabled = config.storeViews.multistore
      // this.$router.push(localizedRoute('/checkout'));
      this.closeMicrocartExtend();
      if (multistoreEnabled) {
        window.location.replace(stores[storeCode].cmsUrl + '/vue/cart/sync/token/' + this.userToken + '/cart/' + this.cartToken)
      } else {
        window.location.replace(cmsUrl + '/vue/cart/sync/token/' + this.userToken + '/cart/' + this.cartToken)
      }
    },
    getBrandLocation (brand) {
      const brandLabel = this.getAttributeLabelById('brand', brand);
      const location = getLocationByBrand(brandLabel);
      return location?.location_name
    }
  },
  mounted () {
    this.isMicrocartVisible = true;
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.o-microcart-panel {
  @include for-mobile {
    ::v-deep .sf-sidebar__aside {
      max-height: calc(100vh - var(--bottom-navigation-height));
    }
  }
  @include for-desktop {
    --sidebar-bottom-padding: var(--spacer-base);
    --sidebar-content-padding: var(--spacer-base);
  }
  .collection-group {
    border: 1px solid #9a9a9a;
    padding: 10px;
    border-radius: var(--border-radius);
    margin-bottom: 20px;
    &__title {
      display: flex;
      align-items: center;
      padding: 10px;
      background: var(--_c-gray-accent-darken);
      border-radius: var(--border-radius);
      margin-bottom: 10px;
      .sf-image {
        margin-right: 10px;
      }
    }
  }
}
.empty-cart {
  --heading-subtitle-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-base) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  &__heading {
    padding: 0 var(--spacer-base);
  }
  &__image {
    --image-width: 13.1875rem;
    margin: 0 0 var(--spacer-2xl) 0;
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-xl);
  }
}
</style>
