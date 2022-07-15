<template>
  <div class="om-add-cart-step1">
    <SfCallToAction
      :class="[{ 'is-fit': isFit }, 'header']"
      :title="$t(title)"
      :description="description"
    >
      <template #button v-if="isFit">
        <div class="check__icon is-fit">
          <SfCircleIcon
            class="icon"
            icon="check"
            icon-size="20px"
            icon-color="white"
            disabled
          />
        </div>
      </template>
      <template #button v-else>
        <div class="check__icon not-fit">
          <SfCircleIcon
            class="icon"
            icon="cross"
            icon-size="20px"
            icon-color="white"
            disabled
          />
        </div>
      </template>
    </SfCallToAction>
    <div class="footer" @click="openVehicleCart({ type: 'vehiclecart' })">
      <span>Change Vehicle</span>
      <SfIcon
        icon="chevron_right"
        size="xxs"
        color="white"
        role="button"
        class="button"
      />
    </div>
  </div>
</template>

<script>
import { SfCallToAction, SfIcon, SfCircleIcon } from '@storefront-ui/vue';
import { mapActions } from 'vuex';

export default {
  name: 'OmAddCartStep1',
  components: {
    SfCallToAction,
    SfIcon,
    SfCircleIcon
  },
  props: {
    isFit: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  },
  computed: {
    title () {
      return this.isFit ? `It fits` : `This product does not fit your`;
    }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar'
    })
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-add-cart-step1 {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: white;
  .sf-call-to-action {
    &.is-fit {
      background-position: right;
      background-size: contain;
      background-size: 50%;
      ::v-deep .sf-call-to-action__title {
        font-size: 34px;
        font-weight: bold;
        color: #000;
      }
      ::v-deep .sf-call-to-action__description {
        font-weight: bold;
        font-size: 20px;
        color: #2b2b2b;;
      }
      ::v-deep .sf-button:disabled{
        --button-background: var(--c-badge);
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacer-xs) var(--spacer-sm);
    background: var(--c-primary);
    color: white;
    cursor: pointer;
  }
  .check__icon {
    position: relative;
    top: -65px;
    right: 0;
    &.not-fit {
      ::v-deep .sf-button {
        --button-background: #808080;
      }
    }
  }
}

::v-deep {
  --call-to-action-padding: var(--spacer-xs) var(--spacer-sm);
  .sf-button:disabled {
    --button-background: var(--c-primary);
  }
  --button-size: 2.25rem;
}
</style>
