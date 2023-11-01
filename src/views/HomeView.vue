<script setup>
  import MainMap from '../components/MainMap.vue';
</script>

<template>
  <main>
    <div class="overscroll-none flex justify-center">
      <MainMap />
      <div class="absolute flex justify-center top-0 z-1 max-w-xl w-3/4 md:w-1/2 lg:w-2/5 mt-8">
        <input class="w-full h-12 px-6 py-2 rounded-full border-2 hover:border-[#9e7d7f] focus:border-[#a40f16] shadow focus:outline-none" type="text" placeholder="장소를 검색하세요!">
      </div>
    </div>
  </main>
</template>

<style>
</style>