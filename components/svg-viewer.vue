<template>
  <div class="svg-container" id="svgContainer" ref="svgContainer">
    <SfLoader v-if="loading" loading="loading" class="loading-container" />
    <div v-show="!loading && !loadingFailed" :id="`svgTemplate_${svgId}`" />
    <SfImage v-show="!loading && loadingFailed" src="/assets/placeholder.jpg" />
    <slot />
  </div>
</template>
<script>
import Vue from 'vue/dist/vue.esm.js';
import { SfLoader, SfImage } from '@storefront-ui/vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import materialColors from 'theme/resource/material-colors.json'
const xmlserializer = require('xmlserializer');

const svgImageHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" contentScriptType="text/ecmascript" zoomAndPan="magnify" contentStyleType="text/css" id="Capa_1" enable-background="new 0 0 1841.891 1595.279" version="1.1" xml:space="preserve" width="1841.891px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1841.891 1595.279" height="1595.279px" x="0px" y="0px">`

export default {
  name: 'SvgViewer',
  components: {
    SfLoader,
    SfImage
  },
  props: {
    imageCode: {
      type: [Number, String],
      default: '43'
    },
    imageId: {
      type: [Number, String],
      default: '718710710202'
    },
    hoveredImageCode: {
      type: [Number, String],
      default: '43'
    },
    clickedImageCode: {
      type: [Number, String],
      default: '43'
    },
    width: {
      type: Number,
      default: 700
    },
    height: {
      type: Number,
      default: 700
    },
    isFullImage: {
      type: Boolean,
      default: false
    },
    svgId: {
      // when rendering many svg-viewers in a page
      type: [Number, String],
      default: 1
    },
    svgData: {
      type: String,
      default: null,
      required: false
    }
  },
  data () {
    return {
      svgDom: null, // obtained SVG element,
      loading: false,
      loadingMessage: 'Loading image...',
      clickedImageId: '',
      hoveredImageId: '',
      loadingFailed: false
    };
  },
  computed: {
    compoundWatchProperty () {
      return [this.imageCode, this.imageId, this.isFullImage].join();
    },
    ...mapGetters({
      tooltips: 'vehicles/tooltips'
    })
  },
  watch: {
    loadingFailed (value) {
      const elementID = `svgTemplate_${this.svgId}`;
      const eleSVG = document.getElementById(elementID);
      if (value) {
        eleSVG.style.display = 'none';
      }
    },
    compoundWatchProperty: {
      immediate: true,
      async handler () {
        await this.$nextTick(async () => {
          if (this.$refs.svgContainer) {
            await this.getSvg();
          }
        })
      }
    },
    clickedImageId (value) {
      this.setStrokeSvg(value, 'click');
      this.$store.commit('vehicles/setSelectedSvgCode', value);
    },
    hoveredImageId (value) {
      this.setStrokeSvg(value, 'hover');
      this.$store.commit('vehicles/setSelectedSvgCode', value);
    },
    hoveredImageCode (value) {
      if (this.$refs.svgContainer) {
        this.hoveredImageId = -1000
        this.clickedImageId = -1000
        this.setStrokeSvg(value, 'hover');
      }
    },
    clickedImageCode (value) {
      if (this.$refs.svgContainer) {
        this.clickedImageId = -1000
        this.hoveredImageId = -1000
        this.setStrokeSvg(value, 'click');
      }
    }
  },
  async mounted () {
    // Bind the takephoto method to the window and provide it for external call
    window[`handleClick_${this.svgId}`] = id => {
      this.onClickSvg(id);
    };
    window[`handleHover_${this.svgId}`] = id => {
      this.onHoverSvg(id);
    };
  },
  methods: {
    onClickSvg (id) {
      this.clickedImageId = id;
      const tooltip = this.tooltips.find(tooltip => tooltip.calloutNumber === id)
      if (this.isFullImage) {
        if (tooltip) {
          this.$emit('onClick', { tooltip, eventName: 'click' })
        } else {
          this.$emit('onClick', { tooltip: {
            tooltip: '',
            sku: 'undefined',
            calloutNumber: ''
          },
          eventName: 'click' })
        }
      }
    },
    onHoverSvg (id) {
      this.hoveredImageId = id;
    },
    setStrokeSvg (objectId, eventName) {
      let g_container = document.getElementById(this.imageId);

      for (let i = 0; i < g_container.childNodes.length; i++) {
        let g = g_container.childNodes[i];

        if (g.nodeName === 'g') {
          const id = Number(g.getAttribute('id'));
          const all_path = g.querySelectorAll('path');

          const changeColor = (source, mode) => {
            for (let i = 0; i < source.length; i++) {
              const outlineElement = source[i].getAttribute('outline-element')
              if (outlineElement) {
                if (mode === 'set') {
                  if (eventName === 'hover') {
                    if (id !== this.clickedImageId) {
                      source[i].setAttribute('stroke', '#565bff');
                    }
                  } else {
                    source[i].setAttribute('stroke', 'blue');
                  }
                } else if (mode === 'revert') {
                  if (id !== this.clickedImageId) {
                    const orgstroke = source[i].getAttribute('orgstroke')
                    source[i].setAttribute('stroke', orgstroke);
                  }
                }
              }
            }
          };

          all_path && changeColor(all_path, 'revert');

          if (+objectId === +id) {
            // all_path.style.fill = 'green'
            all_path && changeColor(all_path, 'set');
          }
        }
      }
    },
    // Initialize svg
    async getSvg () {
      /* Create XHR object */
      let url;
      if (this.isFullImage) {
        url = `https://s3.us-west-1.wasabisys.com/epc-svg/${this.imageId}.svg`;
      } else {
        url = `https://s3.us-west-1.wasabisys.com/epc-svg/small/bmw/${this.imageCode}.xml`;
      }

      if (this.svgData) {
        if (this.$refs.svgContainer) {
          this.loading = false;
          this.loadingFailed = false;

          await this.svgOperation(this.svgData, this.imageId);
        } else {
          this.loading = false;
          this.loadingFailed = true;
        }
      } else {
        try {
          const { data } = await axios.get(url);

          if (data) {
            if (this.$refs.svgContainer) {
              this.loading = false;
              this.loadingFailed = false;

              const svgContent = this.isFullImage ? data : svgImageHeader + data + '</svg>';
              if (this.isFullImage) {
                this.$emit('loadSvg', svgContent)
              }
              await this.svgOperation(svgContent, this.imageId);
            }
          } else {
            this.loading = false;
            this.loadingFailed = true;
          }
        } catch (e) {
          this.loading = false;
          this.loadingFailed = true;
        }
      }
    },
    async svgOperation (svgText, imageId = 1) {
      /** Get SVG DOM */
      const parser = new DOMParser();
      const resXML = parser.parseFromString(svgText, 'application/xml');
      this.svgDom = resXML.documentElement.cloneNode(true);

      /** Modify SVG DOM */
      if (!this.svgDom) {
        this.loading = false;
        this.loadingMessage = 'Loading image failed.';
        return;
      }

      let gContainerId = null;
      if (this.isFullImage) {
        gContainerId = this.imageId;
      } else {
        gContainerId = this.imageCode.split('_')[1]
      }
      let g_container = this.svgDom.getElementById(gContainerId);

      if (this.isFullImage) {
        let allObjectIds = [];
        for (let i = 0; i < g_container.childNodes.length; i++) {
          let child = g_container.childNodes[i];
          if (child.nodeName === 'g') {
            allObjectIds = [...allObjectIds, Number(child.getAttribute('id'))];
          }
        }

        for (let i = 0; i < g_container.childNodes.length; i++) {
          let g = g_container.childNodes[i];

          if (g.nodeName === 'g') {
            const id = Number(g.getAttribute('id'));
            const currentTooltip = this.tooltips.find(({ calloutNumber }) => +calloutNumber === +id)

            for (let j = 0; j < g.childNodes.length; j++) {
              if (g.childNodes[j].nodeName === 'g') {
                let title = document.createElement('title');
                title.innerText = currentTooltip && currentTooltip.tooltip ? currentTooltip.tooltip : '';
                g.childNodes[j].appendChild(title)

                g.childNodes[j].removeAttribute('onclick');
                g.childNodes[j].removeAttribute('onmouseover');
                g.childNodes[j].removeAttribute('onmouseout');

                g.childNodes[j].setAttribute(
                  'v-on:click',
                  `this.handleClick_${this.svgId}(${id})`
                );
                g.childNodes[j].setAttribute(
                  'v-on:mouseover',
                  `this.handleHover_${this.svgId}(${id})`
                );
                if (currentTooltip && currentTooltip.imgShow !== '0') {
                  g.childNodes[j].setAttribute('v-if', `false`);
                }
              }
            }

            // if (Number(this.imageCode) === Number(g.getAttribute('id'))) {
            if (currentTooltip && currentTooltip.imgShow === '0') {
              const all_path = g.querySelectorAll('path');
              // const all_ellipse = g.querySelectorAll('ellipse');
              // const all_polygon = g.querySelectorAll('polygon');

              const setColor = source => {
                for (let i = 0; i < source.length; i++) {
                  const outlineElement = source[i].getAttribute('outline-element')
                  if (outlineElement) {
                    source[i].setAttribute('fill', materialColors[currentTooltip['materialCode']]);
                  }
                }
              };

              // all_path.style.fill = 'green'
              all_path && setColor(all_path);
              // all_ellipse && setColor(all_ellipse);
              // all_polygon && setColor(all_polygon);
            }

            let smallSvgId = -1
            if (this.imageCode.includes('_')) {
              smallSvgId = this.imageCode.split('_')[1]
            } else {
              smallSvgId = this.imageCode
            }
            if (this.isFullImage && this.imageId && +id === +smallSvgId) {
              const all_path = g.querySelectorAll('path');
              const setColor = source => {
                for (let i = 0; i < source.length; i++) {
                  // const outlineElement = source[i].getAttribute('outline-element')
                  // if (outlineElement) {
                  source[i].setAttribute('fill', 'green');
                  // }
                }
              };

              all_path && setColor(all_path);
            }
          }
        }
      } else {
        for (let i = 0; i < g_container.childNodes.length; i++) {
          let g = g_container.childNodes[i];

          if (g.nodeName === 'g') {
            g.removeAttribute('onclick');
            g.removeAttribute('onmouseover');
            g.removeAttribute('onmouseout');
            // g.removeAttribute('transform');
          }
        }
      }
      this.renderSvg();

      /** Apply scale to svg */
      let svg_container = document
        .querySelector('#svgTemplate_' + this.svgId + ' svg')
        .getBBox();

      this.svgDom.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
      this.svgDom.setAttribute('width', this.width + 'px');
      this.svgDom.setAttribute('height', this.height + 'px');
      let scaleTransform = 1;

      if (svg_container.width > svg_container.height) {
        scaleTransform = this.width / svg_container.width;
      } else {
        scaleTransform = this.height / svg_container.height;
      }
      g_container.setAttribute('transform', `scale(` + scaleTransform + ')');
      this.renderSvg();

      /** Apply scale & translate to svg */
      svg_container = document
        .querySelector('#svgTemplate_' + this.svgId + ' svg')
        .getBBox();
      let new_x = this.width / 2 - svg_container.x - svg_container.width / 2;
      let new_y = this.height / 2 - svg_container.y - svg_container.height / 2;

      g_container.setAttribute(
        'transform',
        'translate(' + new_x + ', ' + new_y + ') scale(' + scaleTransform + ')'
      );
      this.renderSvg();
    },
    renderSvg () {
      let sXML = xmlserializer.serializeToString(this.svgDom);
      let SvgDom = Vue.extend({
        // template: `<div v-show="!loading && !loadingFailed" id='svgTemplate_${this.svgId}>${sXML}</div>`
        template: `<div id='svgTemplate_${this.svgId}'>${sXML}</div>`
      });
      new SvgDom().$mount('#svgTemplate_' + this.svgId);
    }
  },
  beforeDestroy () {
    this.svgDom = null;
  }
};
</script>
<style lang="scss">
.svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  min-width: 200px;
  min-height: 200px;

  .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // span {
      // min-width: 200px;
      // min-height: 100px;
    // }
  }

  #svgTemplate {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
