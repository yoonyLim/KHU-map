<script setup>
    import { ref, watch } from 'vue';
    import list from '../assets/bldgList.json';

    const query = ref("");
    const isTyping = ref(false);

    const emit = defineEmits(["searchQuery"]);

    function search(value) {
      if (value) {
        emit("searchQuery", value);
        query.value = "";
      } else {
        emit("searchQuery", query.value);
        query.value = "";
      }
    }

    function matchedBldgs(name) {
      if (name.search(query.value) != -1) {
        return 1;
      }
    }

    // v-if로 인해 처음에는 null로 존재
    // watch로 overlay가 사용된다면 overlay에서 마우스가 떠나 다른 곳 클릭 시 isTyping false로 만듬
    const overlay = ref(null);
    const searchbar = ref(null);
    const mouseOnOverlay = ref(false)

    watch(overlay, () => {
      if (overlay.value) {
        searchbar.value.addEventListener("focusout", () => {
          if (!mouseOnOverlay.value) {
            isTyping.value = false;
          }
        })
        overlay.value.addEventListener("mouseover", () => {
          mouseOnOverlay.value = true;
        })
        overlay.value.addEventListener("mouseleave", () => {
          mouseOnOverlay.value = false;
        })
      }
    })
</script>

<template>
  <div class="flex justify-center top-0">
    <!--검색창-->
    <input 
    ref="searchbar"
    id="searchbar"
    @focusin="isTyping = true"
    @keypress.enter.exact="search"
    v-model="query"
    class="w-full h-12 px-6 py-2 rounded-full border-2 hover:border-[#da9fa1] focus:border-[#a40f16] shadow-sm focus:outline-none" type="text" placeholder="장소를 검색하세요!"/>
    <!--검색 버튼-->
    <div class="ml-4">
      <button @click="search" class="flex w-12 h-12 justify-center items-center rounded-full border-2 bg-white hover:border-[#da9fa1] active:bg-[#da9fa1] shadow-sm">
        <img src="src\assets\icons\search.svg" alt="search" />
      </button>
    </div>
    <!--검색 결과 오버레이-->
    <!--오버레이 div의 focusout 사용 위해 tabindex 사용-->
    <div v-if="isTyping" 
    ref="overlay"
    id="overlay"
    tabindex="1"
    class="absolute top-12 left-5 right-20 z-50 max-h-80 overflow-scroll">
      <div v-for="bldg in list.bldgs" :key="bldg.id" class="bg-white">
        <div 
        v-if="matchedBldgs(bldg.bldgName)" 
        @click="search(bldg.bldgName)"
        class="py-2 hover:bg-gray-100 cursor-pointer">
          <span class="mt-2 p-2 border-l-2 border-l-[#a40f16]">{{ bldg.bldgName }}</span>
        </div>
        <div v-for="name in bldg.alias" :key="name.id">
          <div 
          v-if="matchedBldgs(name)" 
          @click="search(bldg.bldgName)"
          class="py-2 hover:bg-gray-100 cursor-pointer">
            <span class="p-2 border-l-2 border-l-[#a40f16]">{{ bldg.bldgName }}({{ name }})</span>
          </div>
        </div>
        <div v-for="name in bldg.classes" :key="name.id">
          <div 
          v-if="matchedBldgs(name)" 
          @click="search(bldg.bldgName)"
          class="py-2 hover:bg-gray-100 cursor-pointer">
            <span class="pl-4 py-2 border-l-2 border-l-[#0d326f]">{{ bldg.bldgName }} > {{ name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>