import Vue from 'vue';
import * as VehicleStorage from './vehicles-storage';
import axios from 'axios';
import cloneDeep from 'lodash-es/cloneDeep'

export const vehiclesStore = {
  namespaced: true,
  state: {
    savedVehicles: [],
    svgs: {},
    activeVehicle: {},
    storyblok: null,
    tooltips: [],
    selectedSvgCode: '',
    svgEventName: '',
    criterias: []
  },
  actions: {
    async fetchVehicles ({ commit }) {
      const result = await VehicleStorage.getSavedVehiclesData();

      commit('setVehicles', result);
    },
    async fetchActiveVehicle ({ commit }) {
      const result = await VehicleStorage.getActiveVehicleData();

      commit('setActiveVehicle', result);
    },
    async fetchStoryblok ({ commit }) {
      const global: any = await axios.get(
        'https://vsf-dev.omnib2bapi.com/api/storyblok/global'
      );
      const home: any = await axios.get(
        'https://vsf-dev.omnib2bapi.com/api/storyblok/home'
      );
      const about: any = await axios.get(
        'https://vsf-dev.omnib2bapi.com/api/storyblok/about'
      );
      if (global?.data?.success && home?.data?.success && about?.data?.success) {
        commit('setStoryblok', {
          global: global?.data?.result,
          home: home?.data?.result,
          about: about?.data?.result
        });
      } else {
        commit('setStoryblok', { global: {}, home: {}, about: {} });
      }
    },
    async saveVehicles ({ commit }, vehicle) {
      await VehicleStorage.saveVehicles(vehicle);
      const vehicles = await VehicleStorage.getSavedVehiclesData();
      commit('setVehicles', vehicles);
    },
    async saveActiveVehicle ({ commit }, vehicle) {
      await VehicleStorage.saveActiveVehicle(vehicle);
      commit('setActiveVehicle', vehicle);
    },
    async removeVehicle ({ commit }, vehicle) {
      await VehicleStorage.removeVehicle(vehicle);
      commit('removeVehicle', vehicle);
    },
    async clearVehicles ({ commit }) {
      await VehicleStorage.clearVehicles();
      commit('clearVehicles');
    }
  },
  mutations: {
    addNewSvg (state, svg) {
      const { key, value } = svg;
      const stateSvgInstance = Object.assign({}, state.svgs);
      stateSvgInstance[key] = value;
      state.svgs = stateSvgInstance;
    },
    clearSvgs (state) {
      state.svgs = {};
    },
    setActiveVehicle (state, vehicle) {
      Vue.set(state, 'activeVehicle', vehicle);
    },
    setVehicles (state, vehicles) {
      Vue.set(state, 'savedVehicles', vehicles);
    },
    setStoryblok (state, payload) {
      Vue.set(state, 'storyblok', payload);
    },
    removeVehicle (state, vehicle) {
      const oldVehicles = [...state.savedVehicles];
      const newVehicles = oldVehicles.filter(v => {
        return v.National_code !== vehicle.National_code;
      });
      Vue.set(state, 'savedVehicles', newVehicles);

      if (state.activeVehicle.National_code === vehicle.National_code) {
        Vue.set(state, 'activeVehicle', newVehicles[0]);
      }
    },
    clearVehicles (state) {
      Vue.set(state, 'activeVehicle', {});
      Vue.set(state, 'activeVehicle', []);
    },
    setTooltips (state, payload) {
      Vue.set(state, 'tooltips', payload);
    },
    setSelectedSvgCode (state, payload) {
      Vue.set(state, 'selectedSvgCode', payload);
    },
    setSvgEvent (state, payload) {
      Vue.set(state, 'svgEventName', payload);
    },
    setCriterias (state, payload) {
      Vue.set(state, 'criterias', payload);
    }
  },
  getters: {
    getAttributeIdByLabel: (state, getters, rootState, rootGetters) => (
      attributeCode,
      attributeLabel
    ) => {
      const attribute =
        rootGetters['attribute/getAttributeListByCode'][attributeCode];
      if (!attribute) {
        return null;
      }
      const attributeId = attribute.options.find(
        option => option.label === attributeLabel
      )?.value;
      return attributeId || null;
    },
    getAttributeLabelById: (state, getters, rootState, rootGetters) => (
      attributeCode,
      attributeId
    ) => {
      const attribute =
        rootGetters['attribute/getAttributeListByCode'][attributeCode];
      if (!attribute) {
        return null;
      }

      const attributeLabel = attribute.options.find(
        option => option.value === attributeId.toString()
      )?.label;
      return attributeLabel || null;
    },
    getVehicleByNationalCode: (
      state,
      getters,
      rootState,
      rootGetters
    ) => nationalCode => {
      return state.savedVehicles.find(
        vehicle => vehicle.National_code === nationalCode
      );
    },
    vehicles: state => {
      const result = state.savedVehicles.filter(
        vehicle => vehicle.National_code !== state.activeVehicle.National_code
      );

      return [state.activeVehicle, ...result];
    },
    activeVehicle: state => {
      return state.activeVehicle;
    },
    svgObjectIds: state => {
      return state.svgObjectIds;
    },
    storyblok: state => {
      let result = {};
      if (state.storyblok) {
        Object.keys(state.storyblok).map(key => {
          result[key] = state.storyblok[key].content;
        });
      }

      return result;
    },
    storyblokContent: state => (key, page = 'home') => {
      const contents = {};
      if (state.storyblok) {
        Object.keys(state.storyblok).map(key => {
          contents[key] = state.storyblok[key].content;
        });
      }

      if (contents[page]) {
        return contents[page]['body'].find(
          content => content.component === key
        );
      } else {
        return null;
      }
    },
    tooltips: state => {
      return state.tooltips;
    },
    currentSvgCodeTooltip: state => {
      const currentTooltip = state.tooltips?.find(
        ({ calloutNumber }) => calloutNumber === state.selectedSvgCode
      );

      return (
        currentTooltip || {
          sku: '',
          tooltip: '',
          calloutNumber: ''
        }
      );
    },
    svgEventName: state => {
      return state.svgEventName;
    }
  }
};
