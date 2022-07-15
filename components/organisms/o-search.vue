<template>
  <div class="o-search">
    <SfIcon
      icon="search"
      class="sf-header__search"
      size="xs"
      @click.native="$store.commit('ui/setSearchpanel', true)"
    />
    <component
      v-if="isSearchPanelVisible"
      :is="searchPanelAsyncComponent"
      @close="$store.commit('ui/setSearchpanel', false)"
      @reload="reloadComponent()"
    />
  </div>
</template>

<script>
import { SfSearchBar, SfIcon } from '@storefront-ui/vue';
import { mapState, mapGetters } from 'vuex';
import SearchPanelMixin from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel';
import ALoadingSpinner from 'theme/components/atoms/a-loading-spinner';
import ALoadingError from 'theme/components/atoms/a-loading-error';

const SearchPanel = () =>
  import(
    /* webpackChunkName: "vsf-search-panel" */ 'theme/components/organisms/o-search-panel'
  );

export default {
  name: 'OSearch',
  components: {
    SfSearchBar,
    SfIcon
  },
  data () {
    return {
      size: 16,
      searchPanelAsyncComponent: () => ({
        component: SearchPanel(),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      })
    };
  },
  mixins: [SearchPanelMixin],
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      isSearchPanelVisible: (state) => state.ui.searchpanel
    })
  },
  methods: {
    // startSearch () {
    //   if (this.search.length >= 3) {
    //     this.makeSearch();
    //   }
    // },
    reloadComponent () {
      this.searchPanelAsyncComponent = () => ({
        component: SearchPanel(),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.search-container{
  height: 80px;
}
.o-search {
  --search-bar-border-width: 0;
  background-color: var(--c-light);
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  max-width: 200px;
}
::v-deep .sf-search-bar__input[type="search"] {
  &:focus {
    outline: none;
    border-width: 0 0 1px 0;
    border-color: #b1b1b1;
    transition: border-width 1s linear;
  }
}
</style>
