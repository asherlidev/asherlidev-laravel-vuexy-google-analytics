<template>
  <div class="om-vehicle-tooltips">
    <SfLoader v-if="loading" loading="loading" class="loading-container" />
    <div
      v-for="(tooltip, index) in tooltips"
      :key="index"
      class="om-vehicle-tooltips__tooltip"
      @click="onClick(tooltip)"
      @mouseover="onHover(tooltip)"
    >
      <span class="om-vehicle-tooltips__tooltip-label">{{ tooltip.tooltip }}</span>
    </div>
  </div>
</template>

<script>
import { SfLoader } from '@storefront-ui/vue';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { mapGetters } from 'vuex'

export default {
  name: 'OmVehicleTooltips',
  components: {
    SfLoader,
    SvgViewer
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    imageId: {
      type: String,
      default: '718710710202'
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      tooltips: 'vehicles/tooltips'
    })
  },
  methods: {
    onClick (tooltip) {
      this.$emit('onClick', {
        calloutNumber: tooltip.calloutNumber,
        sku: tooltip.sku
      });
    },
    onHover (tooltip) {
      this.$emit('onHover', {
        calloutNumber: tooltip.calloutNumber,
        sku: tooltip.sku
      });
    }
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-vehicle-tooltips {
  height: 200px;
  overflow-y: auto;

  &__tooltip {
    display: flex;
    align-items: center;

    &:hover {
      cursor: pointer;
    }

    &-label {
      min-width: fit-content;
    }
  }

  .svg-container {
    min-width: 50px;
    min-height: 50px;
    display: inline-block;
  }
}
</style>
