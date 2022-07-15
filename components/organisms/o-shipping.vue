<template>
  <div class="o-shipping-container">
    <div
      v-for="(brand, index) in Object.keys(productsGroupByDelivery)"
      :key="index"
    >
      <SfAccordion
        v-if="brand !== 'home' && productsGroupByDelivery[brand].length"
        class="o-shipping-container__card"
      >
        <SfAccordionItem header="custom">
          <template #header="{header, isOpen, accordionClick, showChevron}">
            <div
              class="o-shipping-container__card_header"
              @click="accordionClick"
              :style="{ cursor: 'pointer' }"
            >
              <div class="o-shipping-container__card_header_title">
                <SfImage
                  :width="30"
                  :height="40"
                  src="/assets/icons8-large-courier-truck-64.png"
                />
                <h1>Collect In Store</h1>
              </div>
              <div class="o-shipping-container__card_header_location">
                <SfImage
                  :width="30"
                  :height="40"
                  src="/assets/icons8-large-courier-truck-64.png"
                />
                <h4>{{ getBrandLocation(brand) }}</h4>
              </div>
            </div>
          </template>
          <SfTable class="sf-table--bordered table desktop-only">
            <SfTableRow
              v-for="product in productsGroupByDelivery[brand]"
              :key="product.id"
              class="table__row"
            >
              <SfTableData class="table__image">
                <SfImage :src="getThumbnailForProduct(product)" />
              </SfTableData>
              <SfTableData class="table__description">
                <h4 class="product-title">
                  {{ product.name | htmlDecode }}
                </h4>
                <b>Qty: {{ product.qty }}</b>
                <b>
                  <SfProperty
                    v-for="(property, oIndex) in getProductOptions(product)"
                    :key="oIndex"
                    :name="getPropertyLabel(property.label)"
                  >
                    <template #value>
                      <span
                        class="sf-property__value"
                        v-html="property.value"
                      />
                    </template>
                  </SfProperty>
                </b>
              </SfTableData>
              <SfTableData class="table__data sub-total">
                Subtotal:
                <SfPrice
                  :regular="getProductPrice(product).regular"
                  :special="getProductPrice(product).special"
                  class="product-price"
                />
              </SfTableData>
            </SfTableRow>
          </SfTable>
        </SfAccordionItem>
      </SfAccordion>
    </div>
    <div class="o-shipping-container__card">
      <div class="o-shipping-container__card_header">
        <div class="o-shipping-container__card_header_title">
          <SfImage
            :width="30"
            :height="40"
            src="/assets/icons8-large-courier-truck-64.png"
          />
          <h1>Home delivery</h1>
        </div>
      </div>
      <h1>Delivery Address</h1>
      <div class="o-shipping">
        <div class="form">
          <SfCheckbox
            v-if="currentUser && hasShippingDetails()"
            v-model="shipToMyAddress"
            class="form__element form__checkbox"
            name="shipToMyAddress"
            :label="$t('Ship to my default address')"
          />
          <SfInput
            v-model.trim="shipping.firstName"
            class="form__element form__element--half"
            name="first-name"
            :label="$t('First name')"
            :required="true"
            :valid="!$v.shipping.firstName.$error"
            :error-message="
              !$v.shipping.firstName.required
                ? $t('Field is required')
                : $t('Name must have at least 2 letters.')
            "
            @blur="$v.shipping.firstName.$touch()"
          />
          <SfInput
            v-model.trim="shipping.lastName"
            class="form__element form__element--half form__element--half-even"
            name="last-name"
            :label="$t('Last name')"
            :required="true"
            :valid="!$v.shipping.lastName.$error"
            :error-message="$t('Field is required')"
            @blur="$v.shipping.lastName.$touch()"
          />
          <SfInput
            v-model.trim="shipping.streetAddress"
            class="form__element"
            name="street-address"
            :label="$t('Street name')"
            :required="true"
            :valid="!$v.shipping.streetAddress.$error"
            :error-message="$t('Field is required')"
            @blur="$v.shipping.streetAddress.$touch()"
          />
          <SfInput
            v-model.trim="shipping.apartmentNumber"
            class="form__element"
            name="apartment-number"
            :label="$t('House/Apartment number')"
            :required="true"
            :valid="!$v.shipping.apartmentNumber.$error"
            :error-message="$t('Field is required')"
            @blur="$v.shipping.apartmentNumber.$touch()"
          />
          <SfInput
            v-model.trim="shipping.city"
            class="form__element form__element--half"
            name="city"
            :label="$t('City')"
            :required="true"
            :valid="!$v.shipping.city.$error"
            :error-message="$t('Field is required')"
            @blur="$v.shipping.city.$touch()"
          />
          <SfInput
            v-model.trim="shipping.state"
            class="form__element form__element--half form__element--half-even"
            name="state"
            :label="$t('State / Province')"
          />
          <SfInput
            v-model.trim="shipping.zipCode"
            class="form__element form__element--half"
            name="zipCode"
            :label="$t('Zip-code')"
            :required="true"
            :valid="!$v.shipping.zipCode.$error"
            :error-message="
              !$v.shipping.zipCode.required
                ? $t('Field is required')
                : $t('Name must have at least 3 letters.')
            "
            @blur="$v.shipping.zipCode.$touch()"
          />
          <SfSelect
            v-model="shipping.country"
            class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
            name="countries"
            :label="$t('Country')"
            :required="true"
            :valid="!$v.shipping.country.$error"
            :error-message="$t('Field is required')"
            @change="changeCountry"
          >
            <SfSelectOption
              v-for="country in countries"
              :key="country.code"
              :value="country.code"
            >
              {{ country.name }}
            </SfSelectOption>
          </SfSelect>
          <SfInput
            v-model.trim="shipping.phoneNumber"
            class="form__element"
            name="phone"
            :label="$t('Phone Number')"
          />
        </div>
        <SfHeading
          :title="$t('Shipping method')"
          :level="3"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <div class="form">
          <div class="form__radio-group">
            <SfRadio
              v-for="method in shippingMethods"
              :key="method.method_code"
              v-model="shipping.shippingMethod"
              :value="method.method_code"
              name="shipping-method"
              class="form__radio shipping"
              @input="changeShippingMethod()"
            >
              <template #label>
                <div class="sf-radio__label shipping__label">
                  <div>{{ method.method_title }}</div>
                  <div class="shipping__label-price">
                    {{ method.amount | price }}
                  </div>
                </div>
              </template>
            </SfRadio>
          </div>
          <div class="form__action">
            <SfButton
              class="sf-button--full-width form__action-button"
              :disabled="$v.shipping.$invalid || !shippingMethods.length"
              @click="sendDataToCheckout"
            >
              {{ $t("Continue to payment") }}
            </SfButton>
            <SfButton
              class="sf-button--full-width sf-button--text form__action-button form__action-button--secondary"
              @click="$bus.$emit('checkout-before-edit', 'personalDetails')"
            >
              {{ $t("Edit Details") }}
            </SfButton>
          </div>
        </div>
      </div>
      <SfTable class="sf-table--bordered table desktop-only">
        <SfTableRow
          v-for="product in productsGroupByDelivery['home']"
          :key="product.id"
          class="table__row"
        >
          <SfTableData class="table__image">
            <SfImage :src="getThumbnailForProduct(product)" />
          </SfTableData>
          <SfTableData class="table__description">
            <h4 class="product-title">
              {{ product.name | htmlDecode }}
            </h4>
            <b>Qty: {{ product.qty }}</b>
            <b>
              <SfProperty
                v-for="(property, oIndex) in getProductOptions(product)"
                :key="oIndex"
                :name="getPropertyLabel(property.label)"
              >
                <template #value>
                  <span class="sf-property__value" v-html="property.value" />
                </template>
              </SfProperty>
            </b>
          </SfTableData>
          <SfTableData class="table__data sub-total">
            Subtotal:
            <SfPrice
              :regular="getProductPrice(product).regular"
              :special="getProductPrice(product).special"
              class="product-price"
            />
          </SfTableData>
        </SfTableRow>
      </SfTable>
    </div>
  </div>
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators';
import {
  unicodeAlpha,
  unicodeAlphaNum
} from '@vue-storefront/core/helpers/validators';
import { Shipping } from '@vue-storefront/core/modules/checkout/components/Shipping';
import { chunkCartItems } from 'theme/helpers/index';
import { mapGetters } from 'vuex';
import {
  SfInput,
  SfRadio,
  SfButton,
  SfSelect,
  SfHeading,
  SfCheckbox,
  SfImage,
  SfPrice,
  SfTable,
  SfAccordion,
  SfProperty
} from '@storefront-ui/vue';
import { createSmoothscroll } from 'theme/helpers';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { getProductPrice, getProductPriceFromTotals } from 'theme/helpers';
import { getLocationByBrand } from 'theme/store/locations-storage.ts';

export default {
  name: 'OShipping',
  components: {
    SfInput,
    SfRadio,
    SfButton,
    SfSelect,
    SfHeading,
    SfCheckbox,
    SfImage,
    SfPrice,
    SfTable,
    SfAccordion,
    SfProperty
  },
  mixins: [Shipping],
  validations: {
    shipping: {
      firstName: {
        required,
        minLength: minLength(2),
        unicodeAlpha
      },
      lastName: {
        required,
        unicodeAlpha
      },
      country: {
        required
      },
      streetAddress: {
        required,
        unicodeAlphaNum
      },
      apartmentNumber: {
        required,
        unicodeAlphaNum
      },
      zipCode: {
        required,
        minLength: minLength(3),
        unicodeAlphaNum
      },
      city: {
        required,
        unicodeAlpha
      }
    }
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    }),
    productsGroupByDelivery () {
      return chunkCartItems(this.productsInCart);
    }
  },
  methods: {
    getThumbnailForProduct (product) {
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
    getProductProperty (product, propertyName) {
      const property = product.options
        ? product.options.find(option => option.label === propertyName)
        : false;
      return property ? property.value : '';
    },
    getPropertyLabel (label) {
      if (label === 'Step 2 - Select Delivery Method') {
        return 'Delivery Method';
      } else {
        return label;
      }
    },
    getBrandLocation (brand) {
      const brandLabel = this.getAttributeLabelById('brand', brand);
      const location = getLocationByBrand(brandLabel);
      return location?.location_name;
    }
  },
  mounted () {
    createSmoothscroll(
      document.documentElement.scrollTop || document.body.scrollTop,
      0
    );
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-shipping-container {
  .o-shipping {
    padding: 0 10px;
  }
  &__card {
    margin: 20px 0px;
    border: 2px solid var(--_c-dark-secondary);
    padding: 10px;
    border-radius: var(--border-radius);
    &_header {
      padding: 20px;
      border-radius: var(--border-radius);
      background: var(--c-light-darken);
      &_title,
      &_location {
        display: flex;
        align-items: center;
      }
      &_title {
        h1 {
          margin: 0;
        }
      }
      .sf-image {
        margin-right: 10px;
      }
    }
  }
}

.title {
  --heading-padding: var(--spacer-base) 0;
  @include for-desktop {
    --heading-title-font-size: var(--h3-font-size);
    --heading-padding: var(--spacer-2xl) 0 var(--spacer-base) 0;
    &:last-of-type {
      --heading-padding: var(--spacer-xs) 0 var(--spacer-base) 0;
    }
  }
}
.form {
  overflow: hidden;
  &__group {
    display: flex;
    align-items: center;
  }
  &__action {
    margin: var(--spacer-base) 0;
    &-button {
      &:first-child {
        --button-height: 4.0625rem;
      }
      &--secondary {
        margin: var(--spacer-base) 0;
      }
    }
  }
  &__button {
    --button-width: 100%;
  }
  &__radio-group {
    flex: 0 0 100%;
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 var(--spacer-2xl) 0 0;
    &:last-of-type {
      margin: 0 calc(var(--spacer-2xl) - var(--spacer-sm)) 0 0;
    }
    &__element {
      margin: 0 0 var(--spacer-sm) 0;
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
    &__action {
      flex: 0 0 100%;
      display: flex;
    }
    &__button {
      --button-width: auto;
    }
    &__radio-group {
      margin: 0 calc(var(--spacer-sm) * -1);
    }
  }
  @include for-mobile {
    &__radio-group {
      position: relative;
      left: 50%;
      right: 50%;
      margin-left: -50vw;
      margin-right: -50vw;
      width: 100vw;
    }
  }
}
.shipping {
  --radio-container-padding: var(--spacer-sm);
  &__label {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    &-price {
      font-size: var(--font-lg);
      @include for-mobile {
        order: -1;
        margin: 0 var(--spacer-xs) 0 0;
      }
    }
  }
  &__description {
    --radio-description-margin: 0;
  }
  &__delivery {
    color: var(--c-text-muted);
    display: flex;
  }
  &__action {
    @include for-mobile {
      margin: 0 0 0 var(--spacer-xs);
    }
    &::before {
      content: "+";
    }
    &--is-active {
      --button-color: var(--c-primary);
      --button-transition: color 150ms linear;
      &::before {
        content: "-";
      }
    }
  }
  @include for-desktop {
    &__label {
      justify-content: space-between;
    }
    &__delivery {
      justify-content: space-between;
      max-width: 240px;
    }
  }
}
.table {
  margin: 0 0 var(--spacer-base) 0;
  // --table-row-box-shadow: 0 4px 20px rgba(100, 122, 145, 0.19);
  &__row {
    justify-content: space-between;
    align-items: center;
  }
  @include for-desktop {
    &__header {
      text-align: center;
      &:last-child {
        text-align: right;
      }
    }
    &__data {
      text-align: center;
    }
    &__description {
      text-align: left;
      flex: 0 0 12rem;
    }
    &__image {
      --image-width: 5.125rem;
      text-align: left;
      margin: 0 var(--spacer-xl) 0 0;
    }
    &__price {
      text-align: right;
    }
    &__action {
      display: flex;
      justify-content: right;
    }
  }
  .product-price {
    font-weight: bold;
  }
  .sub-total {
    display: flex;
    align-items: center;
    .sf-price {
      padding-left: 5px;
    }
  }
}
</style>
