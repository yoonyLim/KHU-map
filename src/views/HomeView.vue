<script setup>
  import { ref } from 'vue';
  import MainMap from '../components/MainMap.vue';
  import SearchBar from '../components/SearchBar.vue';

  const query = ref("");

  function searchMap(searchedQuery) {
    query.value = searchedQuery;
  }
</script>

<template>
  <main>
    <div class="overscroll-none flex justify-center">
      <SearchBar @search-query="searchMap" class="absolute max-w-xl w-3/4 md:w-1/2 lg:w-2/5 mt-8" />
      <MainMap :query="query" />
    </div>
  </main>
</template>

<style>
</style>