<template>
  <div class="o-header-checkout">
    <ALogo />
    <div class="checkout-icon">
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
      Secure checkout
    </div>
  </div>
</template>

<script>
import ALogo from 'theme/components/atoms/a-logo';
import { SfImage, SfIcon } from '@storefront-ui/vue';

export default {
  name: 'OCheckoutHeader',
  components: { ALogo, SfImage, SfIcon }
};
</script>

<style lang="scss" scoped>
.o-header-checkout {
  display: flex;
  justify-content: space-around;
  background: var(--_c-gray-accent);
  .checkout-icon {
    display: flex;
    align-items: center;
  }
}
</style>
