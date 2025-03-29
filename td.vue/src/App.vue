<template>
  <div>
    <td-navbar />
    <b-container fluid id="app">
      <b-overlay style="max-height: 100vh;" :show="isLoading" spinner-variant="primary">
        <router-view />
      </b-overlay>
    </b-container>
  </div>
</template>

<style lang="scss">
@use '@/styles/sizes.scss' as sizes;
/* Font imports don't need to be changed - they're standard CSS imports, not Sass imports */
@import url("https://fonts.googleapis.com/css?family=Ubuntu:400,700");

#app {
  font-size: 20px;
  line-height: 1.42857143;
  margin-top: (sizes.$header-height + 15px);
}
</style>

<script>
import { mapState } from 'vuex';

import { LOADER_FINISHED } from '@/store/actions/loader.js';
import TdNavbar from '@/components/Navbar.vue';

export default {
    name: 'TdApp',
    components: {
        TdNavbar,
    },
    computed: mapState({
        isLoading: (state) => state.loader.loading
    }),
    mounted() {
        this.$store.dispatch(LOADER_FINISHED);
        
        // Listen for schema warnings from non-component code
        document.addEventListener('schema-warning', (event) => {
            if (event.detail && event.detail.message) {
                this.$toast.warning(event.detail.message, { timeout: false });
            }
        });
    },
    beforeUnmount() {
        // Clean up event listener
        document.removeEventListener('schema-warning');
    }
};
</script>
