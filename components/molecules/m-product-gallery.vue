<template>
  <div class="m-product-gallery">
    <OmGallery
      v-if="isJpgRender"
      ref="gallery"
      :images="gallery"
    >
    </OmGallery>
    <svg-viewer
      v-if="!isJpgRender"
      :is-full-image="isFullImage"
      :image-id="imageId"
      :image-code="imageCode"
    >
      <SfIcon
        v-if="!isJpgRender"
        :icon="buttonIcon"
        size="lg"
        color="red"
        role="button"
        class="button"
        @click="handleClick"
      />
    </svg-viewer>
    <SfSticky class="m-product-gallery__sub-menu">
      <div class="m-product-gallery__sub-menu_container">
        <SfButton
          v-for="{ value, label} in subMenus" :key="value"
          class="sf-button--pure a-account-icon"
          @click="onClickSubMenu(value)"
        >
          {{ label }}
        </SfButton>
      </div>
    </SfSticky>
    <div class="m-product-gallery__product-list">
      <SfTable>
        <SfTableHeading>
          <SfTableHeader>Criteria</SfTableHeader>
          <SfTableHeader>Sku</SfTableHeader>
        </SfTableHeading>
        <SfTableRow v-for="(product, index) in alternativeProducts" :key="index">
          <SfTableData>{{ product.criteria }}</SfTableData>
          <SfTableData>{{ product.sku }}</SfTableData>
        </SfTableRow>
      </SfTable>
    </div>
  </div>
</template>

<script>
import isEqual from 'lodash-es/isEqual';
import SvgViewer from 'theme/components/svg-viewer.vue';
import { mapGetters } from 'vuex';
import { SfButton, SfIcon, SfTable, SfSticky } from '@storefront-ui/vue';
import OmGallery from 'theme/components/omni/om-gallery.vue'
import axios from 'axios';

export default {
  name: 'MProductGallery',
  components: {
    SvgViewer,
    SfButton,
    SfIcon,
    OmGallery,
    SfTable,
    SfSticky
  },
  props: {
    gallery: {
      type: Array,
      required: true
    },
    configuration: {
      type: Object,
      required: true
    }
  },
  computed: {
    variantImage () {
      let variantImage = this.gallery.find((image) => {
        let selectThis = true;
        for (const [key, value] of Object.entries(this.configuration)) {
          if (
            typeof image.id !== 'undefined' &&
            typeof image.id[key] !== 'undefined' &&
            image.id[key] !== value.id
          ) {
            selectThis = false;
          }
        }
        return (
          selectThis ||
          (image.id &&
            image.id.color &&
            String(image.id.color) === String(this.configuration.color.id))
        );
      });

      if (!variantImage) {
        variantImage = this.gallery.find((image) => {
          return (
            typeof image.id.color !== 'undefined' &&
            typeof this.configuration.color !== 'undefined' &&
            String(image.id.color) === String(this.configuration.color.id)
          );
        });
      }

      if (!variantImage) {
        variantImage = this.gallery[0];
      }

      return variantImage;
    },
    currentIndex () {
      const index = this.gallery.findIndex((imageObject) =>
        isEqual(imageObject.id, this.variantImage.id)
      );

      return index === -1 ? 0 : index;
    },
    ...mapGetters({
      currentProduct: 'product/getCurrentProduct',
      activeVehicle: 'vehicles/activeVehicle',
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    }),
    imageId () {
      if (this.svgId && this.isFullImage) return this.svgId;
      if (this.currentProduct && this.currentProduct.image_id) {
        const imageIdAry = this.currentProduct.image_id.split('.');
        return imageIdAry[0];
      } else {
        return 1; // is default imageID
      }
    },
    imageCode () {
      if (this.svgCode && this.isFullImage) return this.svgCode;
      return this.currentProduct.main_image;
    },
    buttonIcon () {
      return this.isFullImage ? 'arrow_left' : 'arrow_right'
    },
    isJpgRender () {
      const productLabel = this.currentProduct.type
      if (productLabel === 'Accessories') {
        return true;
      } else {
        return false;
      }
    }
  },
  data () {
    return {
      isFullImage: false,
      svgId: null,
      svgCode: null,
      alternativeProducts: [],
      subMenus: [
        { value: 'description', label: 'Description' },
        { value: 'whyGenuine', label: 'Why Genuine' },
        { value: 'relatedParts', label: 'Related Parts' },
        { value: 'fitmentInformation', label: 'Fitment Information' },
      ]
    }
  },
  watch: {
    currentIndex () {
      this.$refs.gallery.go(this.currentIndex);
    },
    // isJpgRender(value) {
    //   if (value === true) {
    //     this.$nextTick(() => {
    //       console.log('first --- ', this.$refs.gallery.$el)
    //       console.log('second --- ', this.$refs.gallery.$el[0])
    //     })
    //   }
    // }
    // glide__slide glide__slide--active
  },
  methods: {
    async handleClick () {
      const {
        data: {
          result: { imageId, calloutNumber }
        }
      } = await axios.post('http://localhost:8080/api/vehicle/applicability-location', {
        NATIONAL_CODE: this.activeVehicle.National_code,
        SKU: this.currentProduct.sku
      });

      this.isFullImage = !this.isFullImage
      this.svgId = imageId;
      this.svgCode = calloutNumber;
      // this.$store.commit('vehicles/setTooltips', tooltips);
    },
    onClickSubMenu(value) {
      console.log(value, 'hey')
    },
    async fetchAlternativeProducts () {
      const { data: { success, result } } = await axios.post('http://localhost:8080/api/vehicle/alternative-part', {
        NATIONAL_CODE: this.activeVehicle.National_code,
        MASTER_CODE: this.currentProduct.master_code_link
      });

      if (success) {
        this.alternativeProducts = result
      }
    },
  },
  async mounted () {
    await this.$store.dispatch('vehicles/fetchActiveVehicle')
    await this.fetchAlternativeProducts()
  }
};
</script>
<style lang="scss">
.m-product-gallery {
  flex: 1;
  position: relative;

  .button {
    position: absolute;
    bottom: 130px;
    right: 60px;
    cursor: pointer;
  }

  &__product-list {
    padding: 0 50px;
  }

  &__sub-menu {
    top: auto;
    bottom: 0;

    &_container {
      background: white;
      display: flex;
      justify-content: space-around;
      padding: 20px 0;
      margin-left: 40px;
    }
  }
}
</style>
