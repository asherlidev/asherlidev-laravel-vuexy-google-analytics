<template>
  <SfSidebar
    :visible="isVehicleCartOpen && isVehicleCartVisible"
    class="sf-sidebar--right sf-sidebar--icon om-vehicle-cart"
    @close="closeSidebar"
  >
    <template #content-top>
      <div class="sidebar-text">
        My Saved Vehicles
      </div>
      <OmVehicleCartCard
        v-for="vehicle in vehicles"
        :key="vehicle.National_code"
        :vehicle="vehicle"
        :info="{
          active: isActiveVehicle(vehicle),
          imgUrl: vehicle.Image,
          mId: vehicle.M_ID,
          title: getTitle(vehicle),
          regCode: vehicle.reg
        }"
      />
    </template>
    <template #content-bottom>
      <transition name="fade">
        <div class="sidebar-footer">
          <div class="sidebar-text footer-text">
            Add Another Vehicle to Your Garage
          </div>
          <SfIcon size="xxl" class="sf-header__icon">
            <svg version="1.2" viewBox="0 0 24 24" preserveAspectRatio="none">
              <g>
                <path
                  xmlns:default="http://www.w3.org/2000/svg"
                  d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
                  style="fill: rgb(170, 170, 170)"
                />
              </g>
            </svg>
          </SfIcon>
          <SfButton
            class="sf-button--full-width color-primary"
            @click.native="selectAnotherVehicle"
          >
            {{ $t("Select Another Vehicle") }}
          </SfButton>
        </div>
      </transition>
    </template>
  </SfSidebar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { getProductPrice, getProductPriceFromTotals } from 'theme/helpers';
import VueOfflineMixin from 'vue-offline/mixin';
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress';
import OmVehicleCartCard from './om-vehicle-cart-card';
import { ModalList } from 'theme/store/ui/modals';

import {
  SfButton,
  SfSidebar,
  SfIcon
} from '@storefront-ui/vue';

export const dropdownKeys = [
  'Brand',
  'Model',
  'Year',
  'Bodytype',
  'Fuel',
  'Engine Size',
  'Trim'
];

export default {
  components: {
    SfButton,
    SfSidebar,
    OmVehicleCartCard,
    SfIcon
  },
  mixins: [VueOfflineMixin, onEscapePress],
  data () {
    return {
      isVehicleCartVisible: false
    };
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      totals: 'cart/getTotals',
      isVehicleCartOpen: 'ui/isVehicleCartOpen',
      activeVehicle: 'vehicles/activeVehicle',
      vehicles: 'vehicles/vehicles'
    }),
    totalItems () {
      return this.productsInCart.length;
    },
    productsCount () {
      let count = 0;
      this.productsInCart.forEach((product) => {
        count = count + parseInt(product.qty);
      });
      return count;
    }
  },
  methods: {
    ...mapActions({
      closeSidebar: 'ui/closeSidebar',
      openModal: 'ui/openModal'
    }),
    closeMicrocartExtend () {
      this.$store.dispatch('ui/closeMicrocart');
    },
    onEscapePress () {
      this.closeMicrocartExtend();
    },
    selectAnotherVehicle () {
      // Check if the current pags is product or category
      const { meta: { breadcrumb }, fullPath } = this.$route;

      if (!(breadcrumb.includes('Category') || fullPath.includes('.html'))) {
        this.$router.push(localizedRoute('/'));
      }

      this.openModal({ name: ModalList.OmSelectorModal, payload: { dropdownKeys, enableAction: false } });
      this.closeMicrocartExtend();
    },
    getThumbnailForProductExtend (product) {
      return getThumbnailForProduct(product);
    },
    getProductPrice (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? getProductPriceFromTotals(product)
        : getProductPrice(product);
    },
    getProductOptions (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? product.totals.options
        : product.options || {};
    },
    removeHandler (product) {
      this.$store.dispatch('cart/removeItem', { product: product });
    },
    goToCheckout () {
      this.$router.push(localizedRoute('/checkout'));
      this.closeMicrocartExtend();
    },
    changeQuantity (product, newQuantity) {
      this.$store.dispatch('cart/updateQuantity', {
        product: product,
        qty: newQuantity
      });
    },
    isActiveVehicle (vehicle) {
      return this?.activeVehicle && (this?.activeVehicle.National_code === vehicle.National_code)
    },
    getTitle (vehicle) {
      return `${vehicle.level1 || ''} ${vehicle.level5 || ''} ${vehicle.level6 || ''} ${vehicle.level7 || ''} ${vehicle.level3 || ''}`
    }
  },
  mounted () {
    this.isVehicleCartVisible = true;
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-vehicle-cart {
  ::v-deep .sf-sidebar__aside {
    --sidebar-background: var(--c-light-variant);
  }
  @include for-mobile {
    ::v-deep .sf-sidebar__aside {
      max-height: calc(100vh - var(--bottom-navigation-height));
    }
  }
  @include for-desktop {
    --sidebar-width: 34.5rem;
    --sidebar-bottom-padding: var(--spacer-base);
    --sidebar-content-padding: var(--spacer-base);
    ::v-deep .sf-sidebar__top {
      overflow-y: auto;
    }
    ::v-deep .sf-sidebar__content {
      height: 0;
    }
  }
  ::v-deep .sf-icon.size-xxl {
    --icon-size: 12.5rem;
    margin-top: -25px;
    height: 10.5rem;
  }
  .sidebar-text {
    font-size: var(--spacer-base);
    font-weight: 700;
    color: var(--c-grey-text);
    margin-bottom: var(--spacer-xl);
    &.footer-text {
      color: var(--c-grey-text-light);
      margin-bottom: 0;
      padding: 0 var(--spacer-2xl);
      text-align: center;
    }
  }
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    margin: 0;
  }
  &__total-price {
    --price-font-size: var(--font-sm);
    --price-font-weight: var(--font-semibold);
    margin: 0 0 var(--spacer-xs) 0;
  }
}
.sidebar-footer {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sf-button--full-width {
  font-size: 24px;
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
.collected-product-list {
  flex: 1;
}
.collected-product {
  --collected-product-image-background: var(--c-white);
  margin: 0 0 var(--spacer-sm) 0;
  &__properties {
    margin: var(--spacer-xs) 0 0 0;
  }
  &__actions {
    transition: opacity 150ms ease-in-out;
    opacity: var(--cp-actions-opacity, 0);
  }
  &__action {
    --button-padding: 0;
  }
  &:hover {
    --cp-actions-opacity: 1;
  }
}
</style>
