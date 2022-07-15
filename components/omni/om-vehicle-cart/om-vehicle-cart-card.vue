<template>
  <div class="om-vehicle-cart-card">
    <div v-if="info.active" class="active-content">
      Active
    </div>

    <div v-if="!readOnly" class="close-button">
      <SfButton class="sf-button--pure" @click="onClose">
        <SfIcon
          icon="cross"
          size="xxs"
        />
      </SfButton>
    </div>

    <div class="om-vehicle-cart-card__body" @click="onClick">
      <SfCallToAction class="header">
        <template #title>
          <SfImage :src="info.imgUrl" />
        </template>
        <template #button>
          <div>
            <h3 class="title">
              {{ info.title }}
            </h3>

            <h3 class="reg-code">
              {{ info.regCode }}
            </h3>
          </div>
        </template>
      </SfCallToAction>
    </div>

    <SfButton
      v-if="!readOnly"
      class="action-button"
      @click="setAsMain"
    >
      {{ actionButtonTitle }}
    </SfButton>
  </div>
</template>

<script>
import { SfImage, SfCallToAction, SfIcon, SfButton } from '@storefront-ui/vue';
import { mapActions } from 'vuex';

export default {
  name: 'OmVehicleCartCard',
  components: {
    SfImage,
    SfCallToAction,
    SfIcon,
    SfButton
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          active: false,
          imgUrl:
            'https://uc.uxpin.com/files/1182538/1139806/2020_BMW_3Series_MSport_Saloon_600x450_-54bcb8eec58507bb248e528a5d7b1c23.jpg',
          title: 'BMW 330i M Sport 2020',
          regCode: ''
        };
      }
    },
    vehicle: {
      type: Object,
      default: () => {}
    },
    actionButtonTitle: {
      type: String,
      default: 'Set as Main'
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions({
      closeSidebar: 'ui/closeSidebar'
    }),
    async onClose () {
      await this.$store.dispatch('vehicles/removeVehicle', this.vehicle)
    },
    async setAsMain () {
      await this.$store.dispatch('vehicles/saveActiveVehicle', this.vehicle)
    },
    onClick () {
      this.$router.push({
        name: 'vehicle-svg',
        params: {
          nationalCode: this.vehicle.National_code,
          visualGroup: '02'
        }
      })

      this.closeSidebar();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-vehicle-cart-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: white;
  margin: var(--spacer-sm) 0;

  @include for-desktop {
    ::v-deep .sf-call-to-action {
      --call-to-action-padding: 0 0;
      --call-to-action-text-container-width: 45%;
      min-height: 100%;
      padding: var(--spacer-base) 0px;
    }
  }
  &__body {
    cursor: pointer;

    .reg-code {
      margin-top: 10px;
    }
  }
  .close-button {
    display: flex;
    justify-content: flex-end;
    height: 38px;
    align-items: center;
    padding: 0 10px;
  }
  .active-content {
    background: var(--c-primary);
    position: absolute;
    overflow: hidden;
    padding: 2px var(--spacer-xl);
    border-top-left-radius: var(--border-radius);
    font-weight: 700;
    font-size: 24px;
    color: white;
    letter-spacing: 3px;
    z-index: 1;
  }
  .action-button {
    width: 100%;
    height: 40px;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
  }
  // &:hover {
  //   .title {
  //     text-decoration: underline;
  //   }
  // }
  .sf-image {
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    color: var(--c-grey-text);
    font-size: var(--spacer-base);
    margin-top: 0;
    width: 50%;
    padding-right: var(--spacer-xl);
  }
  .check__icon {
    position: relative;
    top: -65px;
    right: 0;
  }
}
</style>
