<template>
  <div class="new-vehicle">
    <input
      type="text"
      v-model="vrm"
      :disabled="disableInput"
      placeholder="e.g. YA16 ABC"
    >

    <!-- <VueRecaptcha sitekey="6Ld9BDIbAAAAAH37kokRJW0RjJO0jFv3RP-6KpqT" :loadRecaptchaScript="true"> -->
    <SfButton v-if="showGoButton" @click="onSubmit()">
      Go
    </SfButton>
    <!-- </VueRecaptcha> -->
    <div class="reg-label">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        class="inline-icon inline-icon--medium"
      >
        <g>
          <circle
            fill="none"
            stroke="#fff"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-dasharray="2.0027,2.0027"
            cx="24"
            cy="13.8"
            r="12.8"
          />
        </g>
        <g>
          <path
            fill="#fff"
            d="M11,41.1c0-4.2,3.2-6.9,7.1-6.9c2.7,0,4.5,1.4,5.5,3l-2.3,1.3c-0.6-0.9-1.8-1.7-3.1-1.7   c-2.4,0-4.2,1.8-4.2,4.4s1.7,4.4,4.2,4.4c1.2,0,2.3-0.5,2.8-1v-1.6h-3.5v-2.5h6.3v5.1C22.4,47,20.5,48,18.1,48   C14.2,48,11,45.3,11,41.1z"
          />
          <path
            fill="#fff"
            d="M25.9,47.8V34.5h7c2.5,0,3.8,1.6,3.8,3.4c0,1.7-1,2.8-2.3,3c1.4,0.2,2.5,1.6,2.5,3.2c0,2-1.3,3.6-3.9,3.6   H25.9z M33.9,38.4c0-0.8-0.6-1.4-1.6-1.4h-3.5v2.8h3.5C33.3,39.8,33.9,39.2,33.9,38.4z M34.1,43.8c0-0.8-0.6-1.5-1.7-1.5h-3.7v3   h3.7C33.5,45.3,34.1,44.7,34.1,43.8z"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { SfButton, SfLoader } from '@storefront-ui/vue';
import axios from 'axios';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';

export default {
  components: {
    SfButton,
    SfLoader
  },
  props: {
    showGoButton: {
      type: Boolean,
      required: false,
      default: true
    },
    disableInput: {
      type: Boolean,
      required: false,
      default: false
    },
    initalValue: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    return {
      vrm: this.initalValue,
      hasError: false,
      modalData: {},
      loading: false
    };
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name);
    },
    async onSubmit () {
      try {
        this.loading = true;
        await this.$recaptchaLoaded()
        // Execute reCAPTCHA with action "login".
        const token = await this.$recaptcha('login')

        const {
          data: { result, success }
        } = await axios.post('https://vsf-dev.omnib2bapi.com/api/vehicle/new-vehicle', {
          vrm: this.vrm,
          token
        });
        result.reg = result.level6;
        delete result.level6;

        if (success && result.National_code) {
          await this.$store.dispatch('vehicles/saveVehicles', result);
          await this.$store.dispatch('vehicles/saveActiveVehicle', result);
          const { meta: { breadcrumb }, fullPath } = this.$route;

          if (!(breadcrumb.includes('Category') || fullPath.includes('.html'))) {
            this.$router.push(localizedRoute('/'));
          }
          this.$router.push({
            name: 'vehicle-svg',
            params: {
              nationalCode: result.National_code,
              visualGroup: '02'
            }
          })

          this.closeModal();
        } else {
          this.$store.dispatch(
            'notification/spawnNotification',
            notifications.createNotification({
              type: 'danger',
              message: 'Failed the registeration a new RegCode!'
            }),
            { root: true }
          );
        }
      } catch (e) {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({
            type: 'danger',
            message: 'Failed the registeration a new RegCode!'
          }),
          { root: true }
        );
      }
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.new-vehicle {
  position: relative;
  input {
    max-width: 315px;
    text-align: center;
    width: 100%;
    font-size: 18px;
    color: #343434;
    background: #fff;
    resize: none;
    padding-left: 32px;
    border: 1px solid #666;
    font-weight: normal;
    border-radius: 0;
    padding: 1rem;
  }
  input::-webkit-input-placeholder {
    font-size: 18px;
  }
  .reg-label {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 32px;
    background-color: #18a353;
    padding: 8px 0;
    svg {
      width: 32px;
      height: 32px;
    }
  }
  .sf-button {
    display: inline-block;
  }
}
</style>
