<script setup>
  import MainMap from '../components/MainMap.vue';
</script>

<template>
  <main>
    <div class="relative flex opacity-0 z-20">
      <input class="absolute" type="text" placeholder="장소를 검색하세요!">
      <MainMap />
    </div>
  </main>
</template>

<style>
</style>