<template>
  <div
    class="o-product-details product"
    itemprop="offers"
    itemscope
    itemtype="http://schema.org/Offer"
  >
    <meta
      itemprop="priceCurrency"
      :content="$store.state.storeView.i18n.currencyCode"
    >
    <meta
      itemprop="price"
      :content="parseFloat(product.price_incl_tax).toFixed(2)"
    >
    <meta itemprop="availability" :content="availability">
    <meta itemprop="url" :content="product.url_path">
    <MProductGallery :gallery="gallery" :configuration="productConfiguration" />
    <div class="product__info">
      <SfSticky>
        <MProductShortInfo
          :product="product"
          :custom-options="productCustomOptions"
          :reviews="reviews"
        />
        <MProductOptionsGroup
          v-if="product.type_id =='grouped'"
          :product-options="product.product_links"
        />
        <div>
          <h2 class="add-cart-step-text">
            Step 1 - Check Compatibility
          </h2>
          <OmAddCartStep1
            :is-fit="isFit"
            :description="description"
          />
          <MProductOptionsCustom
            v-if="product.custom_options && product.custom_options.length > 0"
            :product="product"
          />
          <h2 class="add-cart-step-text">
            Step 2 - Select Quantity
          </h2>
          <MProductAddToCart
            class="product__add-to-cart"
            :product="product"
            :stock="productStock"
          />
        </div>
      </SfSticky>
    </div>
  </div>
</template>
<script>
import get from 'lodash-es/get';
import { mapActions, mapGetters } from 'vuex';
import MProductGallery from 'theme/components/molecules/m-product-gallery';
import MProductShortInfo from 'theme/components/molecules/m-product-short-info';
import MProductAddToCart from 'theme/components/molecules/m-product-add-to-cart';
import MProductOptionsCustom from 'theme/components/molecules/m-product-options-custom';
import MProductOptionsGroup from 'theme/components/molecules/m-product-options-group';
import OmAddCartStep1 from 'theme/components/omni/om-add-cart-step1';
import { ModalList } from 'theme/store/ui/modals';
import { SfSticky } from '@storefront-ui/vue';

export default {
  components: {
    MProductGallery,
    MProductShortInfo,
    MProductAddToCart,
    MProductOptionsCustom,
    OmAddCartStep1,
    SfSticky,
    MProductOptionsGroup
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    productGallery: {
      type: Array,
      default: () => []
    },
    productConfiguration: {
      type: Object,
      default: () => ({})
    },
    productCustomOptions: {
      type: Object,
      default: () => ({})
    },
    productAttributes: {
      type: Array,
      default: () => []
    },
    productStock: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters({
      getAttributeIdByLabel: 'vehicles/getAttributeIdByLabel',
      activeVehicle: 'vehicles/activeVehicle'
    }),
    gallery () {
      return this.productGallery.map(imageObject => ({
        id: imageObject.id,
        mobile: {
          url: imageObject.src,
          alt: this.product.name
        },
        desktop: {
          url: imageObject.src,
          alt: this.product.name
        }
      }));
    },
    reviews () {
      const baseReviews = get(this.$store.state.review, 'items.items', []);
      return baseReviews.map(review => ({
        author: review.nickname,
        date: review.created_at,
        message: `${review.title}: ${review.detail}`,
        rating: 1
      }));
    },
    availability () {
      return this.product.stock && this.product.stock.is_in_stock
        ? 'InStock'
        : 'OutOfStock';
    },
    sizeOption () {
      return get(this.productConfiguration, 'size', false);
    },
    isFit () {
      if (this?.activeVehicle) {
        const isFit = this.product?.national_code?.some(code => {
          return +code === +this?.activeVehicle?.National_code;
        });

        return isFit;
      }

      return false;
    },
    description () {
      return this?.activeVehicle
        ? `${this?.activeVehicle.level1 || ''} ${this?.activeVehicle.level5 ||
            ''} ${this?.activeVehicle.level6 || ''} ${this?.activeVehicle
          .level7 || ''} ${this?.activeVehicle.level3 || ''}`
        : '';
    },
    image () {
      return this.isFit ? this?.activeVehicle.Image : '/assets/notmatch.jpg';
    },
    isLifestyle () {
      const productLabel = this.getAttributeLabelById('product_group', this.getCurrentProduct.product_group)
      if (productLabel === 'lifestyle') {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    openSizeGuide () {
      this.openModal({ name: ModalList.SizeGuide });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.product {
  @include for-desktop {
    display: flex;
  }
  &__info {
    margin: var(--spacer-sm) auto var(--spacer-xs);
    padding: 0 var(--spacer-sm);
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
      padding: 0;
      width: 100%;
    }
  }
  &__add-to-cart {
    margin: var(--spacer-base) 0 0;
    @include for-desktop {
      margin-top: var(--spacer-sm);
    }
  }
  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }
  ::v-deep .add-cart-step-text {
    color: var(--add-cart-step-text-color);
    font-weight: 600;
  }
}
.sf-sticky{
 top: var(--sticky-top, 20px)
}

.section {
  border-bottom: 1px solid #f1f2f3;
  padding-bottom: 10px;
  @include for-desktop {
    border: 0;
    padding-bottom: 0;
  }
}
</style>
