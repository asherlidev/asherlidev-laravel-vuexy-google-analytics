<template>
  <div class="om-selector-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <transition name="fade" mode="out-in">
        <div class="om-selector-modal__wrapper">
          <div class="om-selector-modal__new-vehicle">
            <p class="om-selector-modal__header-title">
              You could input VRM code directly here
            </p>
            <NewVehicle @close="closeModal" />
          </div>
          <div class="om-selector-modal__header">
            <SfBar>
              <template #title>
                <p class="om-selector-modal__header-title">
                  Vehicle Lookup
                </p>

                <VoerroTagsInput
                  v-model="searchPattern"
                  element-id="tags"
                  :before-removing-tag="beforeRemovingTag"
                  @tag-added="onTagAdded"
                  :validate="tagValidation"
                  ref="tagInput"
                />
              </template>
            </SfBar>
          </div>
          <div class="om-selector-modal__content">
            <div
              v-for="vehicle in currentVehicles"
              :key="vehicle.label"
              class="om-selector-modal__content-item"
            >
              <SfCheckbox
                v-model="vehicle.select"
                :name="vehicle.label"
                :label="vehicle.label"
                hint-message="Required."
                error-message="This field is not correct."
                valid
                @change="onSelectVehicle(vehicle.label)"
              />
            </div>
          </div>
        </div>
      </transition>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfBar, SfCheckbox, SfButton } from '@storefront-ui/vue';
import vehicleData from 'theme/resource/vehicles.json';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { mapMutations } from 'vuex';
import VoerroTagsInput from '@voerro/vue-tagsinput';
import NewVehicle from '../om-hero/new-vehicle.vue';

export const dropdownKeys = [
  'Brand',
  'Model',
  'Year',
  'Bodytype',
  'Fuel',
  'Engine Size'
];

export default {
  name: 'OmSelectorModal',
  components: {
    SfModal,
    SfBar,
    SfCheckbox,
    VoerroTagsInput,
    NewVehicle
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        payload: {},
        name: 'modal'
      }),
      required: true
    }
  },
  computed: {
    vehicles () {
      return vehicleData['vehicles'];
    },
    watchSearchPattern () {
      return [...this.searchPattern];
    }
  },
  data () {
    return {
      currentVehicles: [],
      searchPattern: []
    };
  },
  watch: {
    watchSearchPattern: {
      deep: true,
      handler (value) {
        this.currentVehicles = this.getNLevelVehicles(
          this.searchPattern.length + 1
        );

        if (value.length === dropdownKeys.length) {
          this.onSearch();
        }
      }
    },
    '$root.$refs.tagInput.input': function (value) {
      if (!value) {
        this.currentVehicles = this.getNLevelVehicles(
          this.searchPattern.length + 1
        );
      } else {
        this.currentVehicles = this.currentVehicles.filter(vehicle => {
          return vehicle.label.toLowerCase().includes(value.toLowerCase());
        });
      }
    }
  },
  methods: {
    onTagAdded () {
      this.$refs.tagInput.input = '';
      this.$nextTick(() => {
        this.$refs.tagInput.$refs.taginput.focus();
      });
    },
    beforeRemovingTag (tag) {
      const index = this.searchPattern
        .map(item => item.value)
        .indexOf(tag.value);
      this.searchPattern = this.searchPattern.slice(0, index);
    },
    tagValidation (text) {
      const searchedVehicle = this.currentVehicles.find(vehicle => {
        return vehicle.label === text;
      });

      return Boolean(searchedVehicle);
    },
    async onSearch () {
      const filteredVehicles = this.vehicles.find(vehicle => {
        return this.searchPattern.every(item => {
          return Object.values(vehicle).indexOf(item.value) >= 0;
        });
      });

      if (filteredVehicles) {
        await this.$store.dispatch('vehicles/saveVehicles', filteredVehicles);
        await this.$store.dispatch('vehicles/saveActiveVehicle', filteredVehicles);
        if (this.modalData?.payload.enableAction) {
          this.$router.push('/vehicle/' + filteredVehicles.National_code);
        }
        this.closeModal();
        this.currentVehicles = this.getNLevelVehicles(1);
        this.searchPattern = [];
      } else {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({
            type: 'danger',
            message: 'Not found the correct National Code!'
          }),
          { root: true }
        );
      }
    },
    closeModal () {
      this.$emit('close', this.modalData.name);
    },
    getNLevelVehicles (level) {
      let currentStepVehicles = this.vehicles.filter(vehicle => {
        return this.searchPattern.every(item => {
          return Object.values(vehicle).indexOf(item.value) >= 0;
        });
      });
      currentStepVehicles = currentStepVehicles || this.vehicles;

      // Avoid adding duplicated items
      const currentStepItems = currentStepVehicles.reduce((result, vehicle) => {
        if (!result.includes(vehicle[`level${level}`])) {
          result = [...result, vehicle[`level${level}`]];
        }
        return result;
      }, []);

      return currentStepItems.map(item => ({
        label: item,
        select: false
      }));
    },
    onSelectVehicle (label) {
      this.searchPattern = [
        ...this.searchPattern,
        {
          key: label,
          value: label
        }
      ];
    }
  },
  mounted () {
    this.currentVehicles = this.getNLevelVehicles(1);

    this.$watch(
      () => {
        return this.$refs.tagInput.input;
      },
      value => {
        if (!value) {
          this.currentVehicles = this.getNLevelVehicles(
            this.searchPattern.length + 1
          );
        } else {
          this.currentVehicles = this.currentVehicles.filter(vehicle => {
            return vehicle.label.toLowerCase().includes(value.toLowerCase());
          });
        }
      }
    );
  }
};
</script>

<style lang="scss">
.om-selector-modal {
  .sf-modal__close {
    display: none;
  }

  .sf-modal__content {
    padding: 0;

    .sf-bar {
      width: 100%;
      height: auto;
      padding: 10px;

      & > div:nth-child(2) {
        width: 100% !important;
      }
    }
  }

  &__new-vehicle {
    text-align: center;

    .new-vehicle {
      margin-left: 12px;
    }
  }

  &__wrapper {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__header {
    width: 100%;

    &-title {
      margin: 0;
      text-align: center;
      padding: 10px 0;
      margin-bottom: 10px;
      font-weight: 500;
      font-family: var(--font-family-secondary);
    }

    &-subtitle {
      font-size: 12px;
      font-weight: 400;
    }

    .vuejs-progress-bar {
      width: 100%;

      svg {
        width: 100% !important;
      }
    }
  }

  &__content {
    min-height: 45vh;
    max-height: 45vh;
    overflow: auto;
    padding: 10px 30px;

    &-item {
      margin: 10px 0;
    }

    &.with-progressbar {
      margin-top: 78px !important;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;

    .sf-button {
      padding: 13px 25px;
      margin: 0 10px;
    }
  }
}
</style>
