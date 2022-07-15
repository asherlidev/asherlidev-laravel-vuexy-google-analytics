<template>
  <SfButton
    class="sf-button--pure om-vehicle-icon"
    @click="openVehicleCart({ type: 'vehiclecart' })"
  >
    <SfIcon size="xs" class="sf-header__icon">
      <svg version="1.2" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path
            xmlns:default="http://www.w3.org/2000/svg"
            id="car"
            d="M5.86,14.84c-0.65,0.65-1.7,0.65-2.35,0c0,0,0,0,0,0c-0.65-0.66-0.64-1.72,0.02-2.36c0.31-0.3,0.72-0.47,1.15-0.48  c0.92-0.01,1.67,0.73,1.67,1.65C6.35,14.1,6.17,14.53,5.86,14.84z M7.65,6.62C7.67,6.55,7.73,6.48,7.8,6.44  c0.06-0.05,0.13-0.09,0.21-0.1h8c0.08,0.01,0.16,0.04,0.22,0.1c0.07,0.04,0.12,0.11,0.15,0.18l0.93,3.72H6.72L7.65,6.62z   M20.52,14.85c-0.65,0.65-1.7,0.64-2.35-0.01c-0.65-0.65-0.64-1.7,0.01-2.35c0.65-0.65,1.7-0.64,2.35,0.01  c0.31,0.31,0.48,0.73,0.48,1.17C21.01,14.11,20.83,14.53,20.52,14.85L20.52,14.85z M22.68,12.67c0-1.29-1.04-2.33-2.33-2.33h-0.34  L18.95,6c-0.35-1.35-1.55-2.3-2.94-2.33h-8c-0.68,0-1.33,0.24-1.86,0.66C5.6,4.74,5.22,5.33,5.07,6l-1.06,4.33H3.68  C3.05,10.31,2.44,10.55,2.01,11c-0.44,0.43-0.69,1.03-0.68,1.65v4c-0.01,0.18,0.13,0.32,0.31,0.33c0.01,0,0.01,0,0.02,0h1v1.33  c0,1.1,0.9,2,2,2s2-0.9,2-2V17h10.68v1.33c0,1.1,0.9,2,2,2s2-0.9,2-2V17h1c0.18,0.01,0.32-0.13,0.33-0.31c0-0.01,0-0.01,0-0.02v-4  l0,0L22.68,12.67z"
          />
        </g>
      </svg>
    </SfIcon>
  </SfButton>
</template>

<script>
import { SfIcon, SfButton } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'OmVehicleIcon',
  components: { SfIcon, SfButton },
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar'
    })
  }
};
</script>
