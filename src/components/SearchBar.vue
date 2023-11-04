<script setup>
    import { ref } from 'vue';

    const query = ref("");

    const emit = defineEmits(["searchQuery"]);

    function search() {
        emit("searchQuery", query.value);
        query.value = "";
    }
</script>

<template>
  <main>
    <div class="flex justify-center top-0">
        <input @keypress.enter.exact="search" v-model="query" class="w-full h-12 px-6 py-2 rounded-full border-2 hover:border-[#da9fa1] focus:border-[#a40f16] shadow focus:outline-none" type="text" placeholder="장소를 검색하세요!">
    </div>
  </main>
</template>

<style>
</style>