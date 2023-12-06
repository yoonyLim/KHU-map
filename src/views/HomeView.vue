<script setup>
  import { ref } from 'vue';
  import MainMap from '@/components/MainMap.vue';
  import SearchBar from '@/components/SearchBar.vue';

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
      <div class="absolute mt-6 left-10">
        <img class="select-none pointer-events-none" width="100" src="../assets/KHU-wordmark.png" />
      </div>
      <Transition>
        <SearchBar v-if="!shouldHideSearchbar" @search-query="searchMap" class="absolute max-w-xl w-3/4 md:w-1/2 lg:w-2/5 mt-8" />
      </Transition>
      <MainMap :query="query" @is-bldg-selected="isBldgSelected" />
      <div class="absolute bottom-10 left-10 p-4 font-bold select-none flex flex-col bg-gray-100 opacity-70">
        <span class="mb-2 text-xl text-gray-500">조작 방법</span>
        <div class="w-full flex justify-between">
          <span>마우스 휠:</span>
          <span class="ml-4">확대/축소</span>
        </div>
        <div class="w-full flex justify-between">
          <span>왼쪽 마우스 버튼 클릭:</span>
          <span class="ml-4">건물 정보 확인</span>
        </div>
        <div class="w-full flex justify-between">
          <span>왼쪽 마우스 버튼 클릭 & 드래그:</span>
          <span class="ml-4">지도 회전</span>
        </div>
        <div class="w-full flex justify-between">
          <span>오른쪽 마우스 버튼 클릭 & 드래그:</span>
          <span class="ml-4">지도 이동</span>
        </div>
      </div>
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