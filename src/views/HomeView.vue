<script setup>
  import { ref } from 'vue';
  import MainMap from '../components/MainMap.vue';
  import SearchBar from '../components/SearchBar.vue';

  const query = ref("");
  const shouldHideSearchbar = ref(false);

  function searchMap(searchedQuery) {
    query.value = searchedQuery;
  }

  function isBldgSelected(val) {
    shouldHideSearchbar.value = val;
  }
</script>

<template>
  <main>
    <div class="overscroll-none flex justify-center">
      <Transition>
        <SearchBar v-if="!shouldHideSearchbar" @search-query="searchMap" class="absolute max-w-xl w-3/4 md:w-1/2 lg:w-2/5 mt-8" />
      </Transition>
      <MainMap :query="query" @is-bldg-selected="isBldgSelected" />
    </div>
  </main>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>