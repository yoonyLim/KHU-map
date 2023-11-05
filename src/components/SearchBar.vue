<script setup>
    import { ref } from 'vue';
    import list from '../assets/bldgList.json';

    const query = ref("");
    const isTyping = ref(false);

    const emit = defineEmits(["searchQuery"]);

    function search() {
      emit("searchQuery", query.value);
      query.value = "";
    }

    function matchedBldgs(name) {
      if (name.search(query.value) != -1) {
        return 1;
      }
    }
</script>

<template>
  <div class="flex justify-center top-0">
    <!--검색창-->
    <input 
      @keypress.enter.exact="search"
      @focus="isTyping = true"
      @blur="isTyping = false"
      v-model="query"
      class="w-full h-12 px-6 py-2 rounded-full border-2 hover:border-[#da9fa1] focus:border-[#a40f16] shadow-sm focus:outline-none" type="text" placeholder="장소를 검색하세요!"
    />
    <!--검색 버튼-->
    <div class="ml-4">
      <button @click="search" class="flex w-12 h-12 justify-center items-center rounded-full border-2 bg-white hover:border-[#da9fa1] active:bg-[#da9fa1] shadow-sm">
        <img src="src\assets\icons\search.svg" alt="search" />
      </button>
    </div>
    <!--검색 결과 오버레이-->
    <div v-if="isTyping" class="absolute top-12 left-5 right-20 z-50 max-h-80 overflow-scroll">
      <div v-for="bldg in list.bldgs" :key="bldg.id" class="bg-white">
        <div v-if="matchedBldgs(bldg.bldgName)" class="py-2">
          <span class="mt-2 p-2 border-l-2 border-l-[#a40f16]">{{ bldg.bldgName }}</span>
        </div>
        <div v-for="name in bldg.alias" :key="name.id">
          <div v-if="matchedBldgs(name)" class="py-2">
            <span class="p-2 border-l-2 border-l-[#a40f16]">{{ bldg.bldgName }}({{ name }})</span>
          </div>
        </div>
        <div v-for="name in bldg.classes" :key="name.id">
          <div v-if="matchedBldgs(name)" class="py-2">
            <span class="bg-white pl-4 py-2 border-l-2 border-l-[#0d326f]">{{ bldg.bldgName }} > {{ name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>