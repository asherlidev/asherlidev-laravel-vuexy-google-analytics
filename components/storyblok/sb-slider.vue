<template>
    <div class="sb-slider">
        <div class="logo">
            <img :src="logo" alt="logo image" />
        </div>
        <div class="content">
            <div class="tabs-wrapper">
                <span
                    v-for="slideKey in Object.keys(slides)"
                    :key="slideKey"
                    class="tab-item"
                    :class="{ 'active': activeTab === slideKey }"
                    @click="onTabChange(slideKey)"
                >{{ slideKey }}</span>
            </div>

            <swiper ref="carousel" :options="swiperOptions" class="carousel" :class="{'withMarginLeft': isFirstView}" @slideChange="slideChange">
                <swiper-slide v-for="(slide, index) in slideItems" :key="index">
                    <div class="slide">
                        <div class="image" :style="{backgroundImage:`url(${slide.background})`}"></div>
                        <div class="title">{{ slide.title }}</div>
                        <div class="description">{{ slide.description }}</div>
                    </div>
                </swiper-slide>

                <div class="swiper-pagination" slot="pagination"></div>
                <div class="swiper-button-next" slot="button-next">
                  <span class="swiper-button-control">
                    <SfChevron class="sf-chevron--right" />
                  </span>
                </div>
                <div class="swiper-button-prev" slot="button-prev">
                  <span class="swiper-button-control">
                    <SfChevron class="sf-chevron--left" />
                  </span>
                </div>
            </swiper>
        </div>
    </div>
</template>

<script>
import { SwiperSlide } from 'vue-awesome-swiper';
import { SfTabs, SfChevron } from '@storefront-ui/vue';

export default {
  name: 'SbSlider',
  components: {
    SwiperSlide,
    SfTabs,
    SfChevron
  },
  computed: {
    swiper () {
      return this.$refs.carousel.$swiper;
    },
    slideItems () {
      let result = []
      Object.keys(this.slides).map(slideKey => {
        result = [...result, ...this.slides[slideKey]]
      })

      return result
    }
  },
  data () {
    return {
      logo: 'https://www.bmw.co.uk/content/dam/bmw/common/all-models/m-series/i4-m50/2021/onepager/bmw-i4-m50-onepager-mc-product-highlights-hero-desktop.jpg/jcr:content/renditions/cq5dam.resized.img.1680.large.time1625831868646.jpg',
      activeTab: 'dynamics',
      isFirstView: true,
      swiperOptions: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        slidesPerView: 4,
        spaceBetween: 50,
        speed: 700
      },
      slides: {
        dynamics: [
          {
            id: 'hello1',
            background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_75a8/image.transform/smallteaser/image.1626699450456.jpg',
            title: 'BMW M eDrive.',
            description: 'The BMW i4 M50 is based on the fifth-generation BMW eDrive technology. In Sport-Boost mode, the two powerful BMW M eDrive motors on the front and rear axle deliver 544 PS (400 kW), while serenely going from 0 to 62mph in a mere 3.9 seconds. At the same time, its all-electric range of up to 318* miles (WLTP) gives it that everyday practicality.'
          },
          {
            id: 'hello2',
            background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_75a8/image.transform/smallteaser/image.1626699450456.jpg',
            title: 'BMW M eDrive.',
            description: 'The BMW i4 M50 is based on the fifth-generation BMW eDrive technology. In Sport-Boost mode, the two powerful BMW M eDrive motors on the front and rear axle deliver 544 PS (400 kW), while serenely going from 0 to 62mph in a mere 3.9 seconds. At the same time, its all-electric range of up to 318* miles (WLTP) gives it that everyday practicality.'
          },
          {
            id: 'hello3',
            background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_75a8/image.transform/smallteaser/image.1626699450456.jpg',
            title: 'BMW M eDrive.',
            description: 'The BMW i4 M50 is based on the fifth-generation BMW eDrive technology. In Sport-Boost mode, the two powerful BMW M eDrive motors on the front and rear axle deliver 544 PS (400 kW), while serenely going from 0 to 62mph in a mere 3.9 seconds. At the same time, its all-electric range of up to 318* miles (WLTP) gives it that everyday practicality.'
          },
          {
            id: 'hello4',
            background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_75a8/image.transform/smallteaser/image.1626699450456.jpg',
            title: 'BMW M eDrive.',
            description: 'The BMW i4 M50 is based on the fifth-generation BMW eDrive technology. In Sport-Boost mode, the two powerful BMW M eDrive motors on the front and rear axle deliver 544 PS (400 kW), while serenely going from 0 to 62mph in a mere 3.9 seconds. At the same time, its all-electric range of up to 318* miles (WLTP) gives it that everyday practicality.'
          }
        ],
        design: [
          {
            id: 'hello5',
            background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_3129/image.transform/smallteaser/image.1626181515861.jpg',
            title: 'BMW M eDrive.',
            description: 'The BMW i4 M50 is based on the fifth-generation BMW eDrive technology. In Sport-Boost mode, the two powerful BMW M eDrive motors on the front and rear axle deliver 544 PS (400 kW), while serenely going from 0 to 62mph in a mere 3.9 seconds. At the same time, its all-electric range of up to 318* miles (WLTP) gives it that everyday practicality.'
          },
          {
            id: 'hello6',
            background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_3129/image.transform/smallteaser/image.1626181515861.jpg',
            title: 'BMW M eDrive.',
            description: 'The BMW i4 M50 is based on the fifth-generation BMW eDrive technology. In Sport-Boost mode, the two powerful BMW M eDrive motors on the front and rear axle deliver 544 PS (400 kW), while serenely going from 0 to 62mph in a mere 3.9 seconds. At the same time, its all-electric range of up to 318* miles (WLTP) gives it that everyday practicality.'
          },
          {
            id: 'hello7',
            background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_3129/image.transform/smallteaser/image.1626181515861.jpg',
            title: 'BMW M eDrive.',
            description: 'The BMW i4 M50 is based on the fifth-generation BMW eDrive technology. In Sport-Boost mode, the two powerful BMW M eDrive motors on the front and rear axle deliver 544 PS (400 kW), while serenely going from 0 to 62mph in a mere 3.9 seconds. At the same time, its all-electric range of up to 318* miles (WLTP) gives it that everyday practicality.'
          },
          {
            id: 'hello8',
            background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_3129/image.transform/smallteaser/image.1626181515861.jpg',
            title: 'BMW M eDrive.',
            description: 'The BMW i4 M50 is based on the fifth-generation BMW eDrive technology. In Sport-Boost mode, the two powerful BMW M eDrive motors on the front and rear axle deliver 544 PS (400 kW), while serenely going from 0 to 62mph in a mere 3.9 seconds. At the same time, its all-electric range of up to 318* miles (WLTP) gives it that everyday practicality.'
          }
        ]
      }
      // slides: [
      //   {
      //     background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_75a8/image.transform/smallteaser/image.1626699450456.jpg'
      //   },
      //   {
      //     background: 'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en_GB/all-models/m-series/i4-m50/2021/bmw-i4-m50-highlights/jcr:content/par/multicontent_34e6/tabs/multicontenttab_2a4a/items/smallteaser_3129/image.transform/smallteaser/image.1626181515861.jpg'
      //   }
      // ]
    }
  },
  methods: {
    slideChange () {
      let activeIndex = 0
      if (this.swiper.translate > this.swiper.previousTranslate) {
        activeIndex = this.swiper.realIndex
      } else {
        activeIndex =
          this.swiper.realIndex + this.swiperOptions.slidesPerView - 1 >
          this.slideItems.length - 1
            ? this.slideItems.length - 1
            : this.swiper.realIndex + this.swiperOptions.slidesPerView - 1;
      }
      const lastElement = this.slideItems[activeIndex]
      Object.keys(this.slides).map(slideKey => {
        const hasLastElement = this.slides[slideKey].find(slide => slide.id === lastElement.id)
        if (hasLastElement) this.activeTab = slideKey
      })

      this.isFirstView = this.swiper.realIndex === 0
    },
    onTabChange (tabKey) {
      this.activeTab = tabKey
      const firstItemIndex = this.slideItems.findIndex(item => item.id === this.slides[this.activeTab][0]['id'])
      this.swiper.slideTo(firstItemIndex, 500, false)
    }
  }
}
</script>

<style lang="scss">
.sb-slider {
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    transform: translate(0, -35px);

    .carousel {
      width: 100%;
      margin-left: 0;
      transition: all .7s ease;

      &.withMarginLeft {
        margin-left: 200px;
      }

      .slide {
        .image {
            padding: 12rem 0rem;
            background-size: cover;
        }

        .title {
          font-weight: bold;
          margin-top: 16px;
        }

        .description {
          margin-top: 16px;
        }
      }

      .swiper-button-next {
        right: 1rem;

        &::after {
          content: "";
        }
      }

      .swiper-button-prev {
        left: 1rem;

        &::after {
          content: "";
        }
      }

      .swiper-button-control {
        background: white;
        opacity: 0.5;
        padding: 10px 5px;
        padding-left: 7px;
        transform: translate(0, -85px);
      }
    }

    .tabs-wrapper {
      display: flex;
      background: white;
      margin-left: 200px;
      box-shadow: 10px 2px 20px grey;

      .tab-item {
        cursor: pointer;
        font-size: 16px;
        font-weight: 700;
        height: 75px;
        color: #666;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 3px solid transparent;

        &:hover,
        &.active {
          color: #262626;
          transition: color 0.5s ease, opacity 0.5s ease, margin 0.5s ease,
              border 0.5s ease;
          overflow: hidden;
          border-bottom-color: var(--c-primary);
        }
      }
    }
  }

}
</style>
