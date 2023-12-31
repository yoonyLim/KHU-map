<script setup>
  import { ref, watch } from 'vue';
  import { useRouter } from "vue-router";
  import bldgList from '../assets/bldgList.json';

  const query = ref("");
  const isTyping = ref(false);

  const emit = defineEmits(["searchQuery"]);

  function searchQuery(value) {
    if (value) { // 오버레이에서 search 호출 시
      emit("searchQuery", value);
      query.value = "";
      isTyping.value = false;
    } else { // 검색창 엔터나 버튼으로 search 호출 시
      for (var bldg of bldgList.bldgs) {
        if (bldg.bldgName.search(query.value) != -1) {
          emit("searchQuery", bldg.bldgName);
          query.value = "";
          isTyping.value = false;
          break;
        } else {
          var isQueryFound = false;

          for (var alias of bldg.alias) {
            if (alias.search(query.value) != -1) {
              isQueryFound = true;
              emit("searchQuery", bldg.bldgName);
              query.value = "";
              isTyping.value = false;
              break;
            }
          }

          if (isQueryFound) { break; }

          for (var floor of bldg.floors) {
            for (var name of floor.classes) {
              if (name.search(query.value) != -1) {
                isQueryFound = true;
                emit("searchQuery", bldg.bldgName);
                query.value = "";
                isTyping.value = false;
                break;
              }
            }

            if (isQueryFound) { break; }
          }
        }
      }
    }
  }

  const router = useRouter();

  function goToClassroom(bldgName, floor, classroom) {
      router.push({ name: "bldg-map-classroom", params: { bldg: bldgName, floor: floor, classroom: classroom }});
    }

  function isQryMatched(name) {
    if (name.search(query.value) != -1) {
      return 1;
    }
  }

  // v-if로 인해 overlay는 v-if="false"일 시 null로 존재
  // watch로 overlay 값 변경 시 overlay에서 마우스가 떠나 다른 곳 클릭 시 isTyping false로 만듬
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
  <div class="flex justify-center top-0 z-50">
    <!--검색창-->
    <input 
    ref="searchbar"
    @focusin="isTyping = true"
    @keypress.enter.exact="searchQuery()"
    v-model="query"
    class="w-full h-12 px-6 py-2 rounded-full border-2 hover:border-[#da9fa1] focus:border-[#a40f16] shadow-sm focus:outline-none" type="text" placeholder="건물이나 강의실을 검색하세요!"/>
    <!--검색 버튼-->
    <div class="ml-4">
      <button @click="searchQuery()" class="flex w-12 h-12 justify-center items-center rounded-full bg-white border-2 hover:border-[#da9fa1] active:bg-[#da9fa1] shadow-md">
        <img src="\src\assets\icons\search.svg" alt="search" />
      </button>
    </div>
    <!--검색 결과 오버레이-->
    <!--오버레이 div의 focusout 사용 위해 tabindex 사용-->
    <Transition>
      <div v-if="isTyping" 
      ref="overlay"
      tabindex="1"
      @focusout="isTyping = false"
      class="absolute top-12 left-5 right-20 z-50 max-h-80 overflow-y-scroll">
      <!--건물 결과-->
        <div v-for="bldg in bldgList.bldgs" :key="bldg.id" class="bg-white">
          <div 
          v-if="isQryMatched(bldg.bldgName)" 
          @click="searchQuery(bldg.bldgName)"
          class="py-1 hover:bg-gray-100 cursor-pointer">
            <div class="py-1 pl-2 border-l-2 border-l-[#a40f16]">
              <span>{{ bldg.bldgName.substring(0, bldg.bldgName.indexOf(query)) }}</span>
              <span class="bg-[#fbf719] underline">{{ bldg.bldgName.substring(bldg.bldgName.indexOf(query), bldg.bldgName.indexOf(query) + query.length) }}</span>
              <span>{{ bldg.bldgName.substring(bldg.bldgName.indexOf(query) + query.length) }}</span>
            </div>
          </div>
          <!--건물 별칭 결과-->
          <div v-for="name in bldg.alias" :key="name.id">
            <div 
            v-if="isQryMatched(name) && query != ''" 
            @click="searchQuery(bldg.bldgName)"
            class="py-1 hover:bg-gray-100 cursor-pointer">
              <div class="py-1 pl-2 border-l-2 border-l-[#a40f16]">
                <span>{{ (bldg.bldgName + " (" + name + ")").substring(0, (bldg.bldgName + " (" + name + ")").indexOf(query)) }}</span>
                <span class="bg-[#fbf719] underline">{{ (bldg.bldgName + " (" + name + ")").substring((bldg.bldgName + " (" + name + ")").indexOf(query), (bldg.bldgName + " (" + name + ")").indexOf(query) + query.length) }}</span>
                <span>{{ (bldg.bldgName + " (" + name + ")").substring((bldg.bldgName + " (" + name + ")").indexOf(query) + query.length) }}</span>
              </div>
            </div>
          </div>
          <!--건물 내부 강의실 결과-->
          <div v-for="floor in bldg.floors" :key="floor.id">
            <div v-for="roomNumber in floor.rooms" :key="roomNumber.id">
              <div 
              v-if="typeof roomNumber != 'object' && isQryMatched(roomNumber) && query != ''" 
              @click="goToClassroom(bldg.bldgName, floor.floor, roomNumber);"
              class="py-1 hover:bg-gray-100 cursor-pointer">
                <div class="py-1 pl-2 border-l-2 border-l-[#0d326f]">
                  <span>{{ (bldg.bldgName + " > " + roomNumber).substring(0, (bldg.bldgName + " > " + roomNumber).indexOf(query)) }}</span>
                  <span class="bg-[#fbf719] underline">{{ (bldg.bldgName + " > " + roomNumber).substring((bldg.bldgName + " > " + roomNumber).indexOf(query), (bldg.bldgName + " > " + roomNumber).indexOf(query) + query.length) }}</span>
                  <span>{{ (bldg.bldgName + " > " + roomNumber).substring((bldg.bldgName + " > " + roomNumber).indexOf(query) + query.length) }}</span>
                </div>
              </div>
              <!--오브젝트일 경우-->
              <div 
              v-if="typeof roomNumber == 'object' && isQryMatched(roomNumber.roomNumber) && query != ''" 
              @click="goToClassroom(bldg.bldgName, floor.floor, roomNumber.roomNumber);"
              class="py-1 hover:bg-gray-100 cursor-pointer">
                <div class="py-1 pl-2 border-l-2 border-l-[#0d326f]">
                  <span>{{ (bldg.bldgName + " > " + roomNumber.roomNumber).substring(0, (bldg.bldgName + " > " + roomNumber.roomNumber).indexOf(query)) }}</span>
                  <span class="bg-[#fbf719] underline">{{ (bldg.bldgName + " > " + roomNumber.roomNumber).substring((bldg.bldgName + " > " + roomNumber.roomNumber).indexOf(query), (bldg.bldgName + " > " + roomNumber.roomNumber).indexOf(query) + query.length) }}</span>
                  <span>{{ (bldg.bldgName + " > " + roomNumber.roomNumber).substring((bldg.bldgName + " > " + roomNumber.roomNumber).indexOf(query) + query.length) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
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