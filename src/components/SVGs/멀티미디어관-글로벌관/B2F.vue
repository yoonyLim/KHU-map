<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("B2");
    const floorInfo = ref(null);
    const selectedClass = ref("");

    const props = defineProps({
        query: String
    })

    const propSelectedClass = toRefs(props).query;
    selectedClass.value = propSelectedClass.value;

    function changeClass(val) {
        selectedClass.value = val;
    }

    const curTime = ref(null)

    const updateTime = () => {
      curTime.value = new Date().toLocaleDateString('ko-KR', {timeZone: "Asia/Seoul", weekday: 'long', hour: '2-digit', minute: 'numeric', second: 'numeric', hour12: false});
    }

    const weekday = ref("");
    const timeHMS = ref(null);

    const isClassGoingOn = ref(false);

    watch(curTime, () => {
      weekday.value = curTime.value.split(" ")[0].split("(")[1].split("요일")[0];
      timeHMS.value = curTime.value.split(" ")[1].split(":");

      isClassGoingOn.value = false;

      for (var room of floorInfo.value.rooms) {
        if (typeof room == "object" && room.roomNumber == selectedClass.value) {
          for (var lecture of room.classes) {
            if (isGoingOn(lecture.days, lecture.timeStart, lecture.timeEnd)) {
              isClassGoingOn.value = true;
            }
          }
        }
      }
    })

    const updateTimeInterval = setInterval(updateTime, 1000);

    function isGoingOn(days, timeStart, timeEnd) {
      var result = false;

      if (typeof days == 'object') {
        for (var day of days) {
          if (day == weekday.value) {
            if (checkTime(timeStart, timeEnd)) {
              result = true;
            }
          }
        }
      } else {
        if (days == weekday.value) {
          if (checkTime(timeStart, timeEnd)) {
            result = true;
          }
        }
      }

      return result;
    }

    function checkTime(timeStart, timeEnd) {
      if (parseInt(timeHMS.value[0]) - parseInt(timeStart.split(":")[0]) < 0) {
        return false;
      } else if (parseInt(timeHMS.value[0]) - parseInt(timeStart.split(":")[0]) >= 0) {
        if (parseInt(timeHMS.value[0]) - parseInt(timeEnd.split(":")[0]) < 0) {
          return true;
        } else if (parseInt(timeHMS.value[0]) - parseInt(timeEnd.split(":")[0]) == 0) {
          if (parseInt(timeHMS.value[1]) - parseInt(timeEnd.split(":")[1]) > 0) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      }
    }

    onMounted(() => {
        for (var bldg of bldgList.bldgs) {
            if (bldg.bldgName == curBldg.value) {
                for (var floor of bldg.floors) {
                    if (floor.floor == curFloor.value) {
                        floorInfo.value = floor;
                    }
                }
            }
        }
    })

    onBeforeUnmount(() => {
      clearInterval(updateTimeInterval);
    })
</script>

<template>
<div v-if="floorInfo" class="w-full flex flex-col">
    <div class="w-full flex flex-row flex-wrap">
        <div v-for="room in floorInfo.rooms" :key="room.id" class="mt-4">
            <button 
            v-if="(typeof room != 'object')" 
            @click="changeClass(room)"
            :class="selectedClass == room ? 'text-white bg-red-300' : 'bg-gray-300'"
            class="px-4 py-2 mr-4 hover:bg-red-300 transition-bg-colors duration-300 ease-in-out">
                <span>{{ room }}</span>
            </button>
            <button 
            v-if="(typeof room == 'object')"
            @click="changeClass(room.roomNumber)" 
            :class="selectedClass == room.roomNumber ? 'text-white bg-red-300' : 'bg-gray-300'"
            class="px-4 py-2 mr-4 hover:bg-red-300 transition-bg-colors duration-300 ease-in-out">
                <span>{{ room.roomNumber }}</span>
            </button>
        </div>
    </div>
</div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1364.77 768">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="1002.6 270.5 907.65 270.5 907.27 241.5 767.61 241.5 767.27 270.5 761.27 270.5 761.27 336.5 358.29 335.9"/>
    <polyline class="cls-1" points="86.27 270.5 49.27 270.5 49.27 445.31 74.11 445.31"/>
    <line class="cls-1" x1="907.65" y1="270.5" x2="907.27" y2="335.5"/>
    <text class="cls-2" transform="translate(53.01 287.62)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(167.76 272.62)"><tspan class="cls-6"><tspan x="0" y="0">B205</tspan></tspan><tspan class="cls-7"><tspan x="-71.25" y="25.2">반도체광전자연구실</tspan></tspan></text>
    <g>
      <path class="cls-5" d="m324.7,283.81c0-.18-.45-.54-1.55-.97-.27-.09-.41-.2-.41-.29,0-.11.22-.2.65-.22.85.07,1.4.31,1.89.43.52.2.65.32.65.5,0,.13-.07.27-.07.49l-.02,4.86c.25-.02.43,0,.7-.04.94-.11.49-.5,1.8-.5.36,0,1.06,0,1.06.49,0,.22-.2.43-.5.45l-3.08.05c-.04,2.72-.68,3.02-.85,3.02-.14,0-.27-.2-.27-.72v-2.75c-2.29.9-6.79,2.16-9.09,2.14-.32,0-.68-.54-.68-1.28l-.07-3.44c-.22-.29-.61-.5-1.51-.72-.14-.02-.31-.07-.31-.16,0-.07.16-.16.61-.25,2.16.09,2.45.25,2.45.5,0,.04-.04.25-.04.31-.02,1.17-.07,2.7-.07,3.42,0,.5,0,.76.5.76.45,0,5.17-.4,8.21-1.64v-4.45Zm-6.75,10.21c-.09-.41-.4-.54-1.08-.81-.22-.05-.4-.13-.4-.22,0-.07.14-.14.52-.23.85,0,1.93.18,2.27.27l4.9-.09c.4-.05.49-.16.88-.16.36,0,1.06.07,1.06.31,0,.13-.2.29-.25.47-.36,1.39-.76,3.19-.85,3.73.63.04.92.27.92.47,0,.16-.22.31-.59.31h-6.14c-.14.74-.41,1.15-.63,1.15-.2,0-.36-.32-.36-1.03l-.25-4.16Zm1.15.59l.05,2.99,4.09-.07c.65-.04.56-.11,1.12-.23l.2-3.85-5.19.07c-.07.05-.27.11-.27.29v.81Z"/>
      <path class="cls-5" d="m338.2,285.86c.34-.05.29-.13.76-.13.97,0,1.13.07,1.13.23s-.31.41-.45.67c-.74,1.24-1.76,2.79-2.43,3.58.41.38,1.19,1.01,1.57,1.3.7.45.94.16,1.82,1.46.25.4.36.7.36.94,0,.25-.13.4-.32.4-.16,0-.34-.09-.54-.29-.52-.58-1.48-1.67-3.24-3.44-2.16,2.39-5.47,4.57-6.01,4.57-.05,0-.07-.02-.07-.04,0-.07.13-.22.41-.43,2.2-1.51,5.49-4.45,7.26-8.32-.95.04-3.26.18-3.84.22-.47.09-.54.31-.81.31-.36,0-1.84-.7-1.84-.92,0-.05.07-.09.22-.09.09,0,.2,0,.34.04.54.07,1.22.09,1.93.09,1.24,0,3.28-.09,3.76-.14Zm4.5-2c-.02-.31-.99-.74-1.75-1.08-.2-.07-.32-.16-.32-.23,0-.11.22-.2.76-.22.77.13,1.49.31,2.07.49.38.14.47.27.47.45,0,.14-.05.31-.05.58v6.55h.9c.85-.13.56-.47,1.71-.47.34,0,1.1,0,1.1.56,0,.25-.22.47-.61.47h-3.11l-.02,5.22c-.02,1.17-.14,1.91-.45,2.66-.14.22-.29.32-.41.32-.16,0-.27-.23-.27-.83v-14.48Z"/>
      <path class="cls-5" d="m309.6,314.72c-1.82-.16-2.83-1.37-2.83-2.54,0-1.1.85-2.2,2.68-2.5.13-.13.18-.25.18-.41,0-.2-.11-.41-.31-.61-.58.04-1.28.04-2.09.09-.41.07-.52.25-.77.25-.36,0-1.64-.74-1.64-.95,0-.05.05-.09.18-.09.07,0,.2.02.34.05.68.14,1.66.22,2.74.22s2.18-.07,3.28-.16h.11c1.01-.2.7-.56,1.91-.56.45,0,1.24,0,1.24.45,0,.22-.23.43-.68.47-.79.05-2.61.09-3.85.16.13.32.4.4.45.59v.07c0,.23-.13.25-.13.41v.02c1.85.25,2.74,1.4,2.74,2.54s-.9,2.23-2.5,2.41l.02,1.62c1.12-.11,3.75-.52,5.19-.99v-9.72c-.04-.29-.68-.7-1.6-1.04-.32-.09-.5-.2-.5-.29,0-.11.2-.18.63-.23.95.04,1.66.29,2.21.45.36.14.43.23.43.4,0,.13-.05.29-.05.52v7.35c.31,0,.63-.02.95-.05.49-.14.31-.47,1.73-.5.56.04.81.31.81.56,0,.22-.18.4-.52.41-.81.05-2.54.09-2.97.09v3.35c0,1.6-.05,2.66-.36,3.76-.13.36-.32.63-.49.63-.14,0-.25-.2-.27-.72v-4.59c-2.23.83-5.65,1.51-8.17,2.07-.34.09-.38.29-.65.29-.4,0-2.59-.97-2.59-1.31,0-.07.07-.11.2-.11.09,0,.2.02.34.05.4.09.9.14,1.42.14,1.04,0,2.23-.16,3.21-.36v-1.67Zm-.65-7.94c-.72-.04-1.51-1.01-1.51-1.13,0-.05.04-.09.14-.09.07,0,.2.02.38.07.54.09,1.73.27,3.26.27.59.02.97.29.97.52,0,.36-.63.36-1.46.36h-1.78Zm-1.13,5.37c0,.94.72,1.85,2.18,1.85s2.11-.92,2.11-1.85-.7-1.87-2.11-1.87-2.18.94-2.18,1.87Z"/>
      <path class="cls-5" d="m329.27,306.53c.38-.09.23-.16.86-.16.52,0,1.01.04,1.01.25,0,.16-.27.4-.41.58-.61.86-1.57,2.02-2.16,2.66.27.27.74.72,1.06.95.67.58.77,0,1.87,1.3.25.32.34.59.34.81s-.13.36-.32.36c-.14,0-.36-.11-.56-.31-.4-.38-1.51-1.51-2.75-2.79-2.97,2.63-5.62,3.65-5.92,3.65-.07,0-.09-.02-.09-.04,0-.05.11-.16.36-.31,2.23-1.22,5.38-3.64,6.88-6.5-.86.04-3.01.13-3.67.16-.36.07-.4.23-.65.23-.29,0-1.78-.59-1.78-.86,0-.05.09-.11.25-.11.07,0,.18.02.31.04.61.13,1.4.18,2.27.18.45,0,2.63-.11,3.12-.11Zm1.75,7.85c0-.14-.07-.32-.22-.47-.11-.07-.16-.16-.16-.23s.07-.13.22-.13c.34,0,1.19.36,1.19.61,0,.16-.2.31-.27.52,2,.36,2.94,1.64,2.94,2.88,0,1.39-1.22,2.92-3.55,2.92s-3.46-1.42-3.46-2.93c0-1.28.99-2.59,3.04-2.88.18-.02.27-.14.27-.29Zm-2.32,3.1c0,1.08.85,2.18,2.52,2.18s2.52-1.1,2.52-2.18-.85-2.21-2.52-2.21-2.52,1.1-2.52,2.21Zm5.01-11.94c-.02-.16-.5-.52-1.55-.97-.27-.09-.41-.2-.41-.29,0-.11.22-.18.65-.2.85.09,1.49.29,2.07.47.38.14.47.27.47.43,0,.13-.07.29-.07.5l-.02,4.99c.25-.02.43,0,.7-.04.81-.18.49-.5,1.75-.5.41,0,1.12,0,1.12.49,0,.22-.2.43-.5.45l-3.08.07c-.02,1.51-.13,2.29-.31,2.79-.16.36-.38.63-.54.63-.14,0-.27-.22-.27-.81v-8.01Z"/>
      <path class="cls-5" d="m340.43,312.92c3.96-2.2,5.67-5.62,5.67-5.87,0-.31-.81-.88-1.24-1.12-.11-.05-.22-.16-.22-.25,0-.07.09-.14.36-.14.68,0,2.63.9,2.63,1.3,0,.13-1.12,1.82-1.26,2.03.31.27.94.72,1.3.94,1.06.56,1.04.05,2.32,1.44.27.29.38.54.38.74s-.13.31-.34.31c-.2,0-.49-.11-.81-.4-.47-.4-2.14-1.8-3.21-2.65-1.84,2.23-5.13,4.02-5.78,4.02-.09,0-.13-.02-.13-.05,0-.05.11-.16.32-.29Zm5.2,4.79c-.04-.2-.38-.32-.95-.47-.18-.05-.34-.11-.34-.18,0-.04.2-.23.81-.23.76,0,1.57.13,1.76.22,1.66,0,2.67,0,4.38-.07.41-.04.59-.09.95-.16.04-.29.11-1.28.16-2.18-1.15,0-3.58.11-5.33.18-.52.11-.61.31-.92.31-.38,0-1.76-.59-1.76-.81,0-.05.09-.09.29-.09.07,0,.16,0,.27.02.61.05,1.48.09,2.47.09,1.46,0,3.17-.07,4.59-.16.34-.05.31-.13.68-.13.11,0,.23,0,.41.02.54.04.7.13.7.27,0,.13-.18.31-.25.49-.23.54-.5,1.3-.63,1.91.49.09.74.27.74.41s-.22.25-.61.25c-1.37.04-4.05.09-5.98.11-.18.11-.32.07-.32.29v1.57c.02.34.18.41.45.41.36,0,.9.02,1.53.02.92,0,2.02-.02,3.1-.04,1.08-.13.74-.47,1.85-.47.49,0,1.39,0,1.39.52,0,.22-.22.41-.61.41h-7.22c-1.31,0-1.6-.47-1.6-.99v-1.51Zm6.81-12.06c0-.32-.56-.74-1.57-1.12-.31-.11-.47-.22-.47-.31,0-.11.22-.18.65-.22.09,0,2.59.32,2.59.88,0,.13-.07.29-.07.52v5.15c0,.76-.07,1.84-.29,2.48-.16.41-.36.63-.52.63s-.29-.25-.29-.83l-.04-7.2Z"/>
    </g>
    <text class="cls-4" transform="translate(789.88 268.96)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-4" transform="translate(937.07 310.46)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-4" transform="translate(1132.57 392.46)"><tspan x="0" y="0">LOCKED</tspan></text>
    <text class="cls-4" transform="translate(161.34 489.54)"><tspan x="0" y="0">B204</tspan></text>
    <text class="cls-4" transform="translate(396.34 489.34)"><tspan x="0" y="0">B203</tspan></text>
    <text class="cls-4" transform="translate(630.34 489.34)"><tspan x="0" y="0">B202</tspan></text>
    <text class="cls-4" transform="translate(860.34 489.34)"><tspan x="0" y="0">B201</tspan></text>
  </g>
  <g id="_204" data-name="204">
    <polygon :class="selectedClass == 'B204' ? 'selected' : ''" class="cls-1" points="304.75 524.5 74.27 524.5 74.11 445.31 74.11 441.88 304.75 441.88 304.75 524.5"/>
  </g>
  <g id="_203" data-name="203">
    <rect :class="selectedClass == 'B203' ? 'selected' : ''" class="cls-1" x="304.75" y="441.88" width="230.24" height="82.62"/>
  </g>
  <g id="_202" data-name="202">
    <polygon :class="selectedClass == 'B202' ? 'selected' : ''" class="cls-1" points="766.27 524.5 534.99 524.5 534.99 441.88 766.27 441.5 766.27 524.5"/>
  </g>
  <g id="_201" data-name="201">
    <rect :class="selectedClass == 'B201' ? 'selected' : ''" class="cls-1" x="766.27" y="441.5" width="236.32" height="83"/>
  </g>
  <g id="_" data-name="???">
    <polygon class="cls-1" points="1002.6 524.5 1291.27 524.5 1291.27 441.55 1316.27 441.5 1316.27 285.29 1278.27 285.5 1278.27 270.5 1002.6 270.5 1002.6 441.5 1002.6 524.5"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <polygon class="cls-1" points="298.69 335.81 358.29 335.81 358.29 270.5 298.69 270.58 298.69 335.81"/>
  </g>
  <g id="_205" data-name="205">
    <polygon :class="selectedClass == 'B205' ? 'selected' : ''" class="cls-1" points="86.27 228.5 298.69 228.5 298.69 270.58 298.69 335.81 86.27 335.5 86.27 228.5"/>
  </g>
</svg>
<!--강의실 정보-->
<div v-if="selectedClass != '' && floorInfo != null">
    <div v-for="room in floorInfo.rooms" :key="room.id">
        <div v-if="(typeof room != 'object') && room == selectedClass">
            <span class="font-bold text-xl">해당 교실의 강의 정보는 없습니다!</span>
        </div>
        <div v-if="(typeof room == 'object') && room.roomNumber == selectedClass">
            <div class="flex flex-col">
              <!--해당 강의실 강의 정보-->
                <span class="mb-4 font-bold text-xl">해당 강의실 모든 강좌 정보</span>
                <div class="flex flex-wrap">
                  <div v-for="lecture in room.classes" :key="lecture.id" class="flex mr-4">
                      <div class="my-4 px-4 py-2 border-l-4 border-b-2 border-[#a40f16] flex flex-col">
                          <div class="flex font-bold items-end">
                              <span>{{ lecture.lectureName }}</span>
                              <span class="ml-2 text-sm text-gray-500">{{ lecture.Professor }}</span>
                          </div>
                          <span v-if="lecture.alias" class="font-bold text-sm text-gray-400">({{ lecture.alias }})</span>
                          <div class="mt-2 flex font-bold">
                            <div v-if="typeof lecture.days == 'object'" class="flex">
                              <div v-for="day in lecture.days" :key="day.id" class="mr-2">
                                {{ day }}
                              </div>
                            </div>
                            <div v-else class="mr-2">
                              {{ lecture.days }}
                            </div>
                            <span class="mr-2 font-bold text-gray-500">|</span>
                            <span>{{ lecture.timeStart }} - {{ lecture.timeEnd }}</span>
                          </div>
                      </div>
                  </div>
                </div>
                <!--실시간 진행 중 강의-->
                <div v-if="curTime != null" class="mt-8 flex flex-col font-bold">
                  <span class="text-xl">현재 진행 강좌 정보</span>
                  <div class="mb-4 text-gray-500">{{ curTime }}</div>
                  <div class="flex flex-wrap">
                    <div v-for="lecture in room.classes" :key="lecture.id" class="flex">
                      <div v-if="isGoingOn(lecture.days, lecture.timeStart, lecture.timeEnd)" class="my-4  mr-4 px-4 py-2 border-l-4 border-b-2 border-[#a40f16] flex flex-col">
                          <div class="flex font-bold items-end">
                              <span>{{ lecture.lectureName }}</span>
                              <span class="ml-2 text-sm text-gray-500">{{ lecture.Professor }}</span>
                          </div>
                          <span v-if="lecture.alias" class="font-bold text-sm text-gray-400">({{ lecture.alias }})</span>
                          <div class="mt-2 flex font-bold">
                            <div v-if="typeof lecture.days == 'object'" class="flex">
                              <div v-for="day in lecture.days" :key="day.id" class="mr-2">
                                {{ day }}
                              </div>
                            </div>
                            <div v-else class="mr-2">
                              {{ lecture.days }}
                            </div>
                            <span class="mr-2 font-bold text-gray-500">|</span>
                            <span>{{ lecture.timeStart }} - {{ lecture.timeEnd }}</span>
                          </div>
                      </div>
                  </div>
                  <div v-if="!isClassGoingOn">현재 진행 중인 강의가 없습니다!</div>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
      .cls-1 {
        fill: none;
        stroke: #000;
        stroke-miterlimit: 10;
      }

      .cls-2 {
        font-size: 16px;
      }

      .cls-5 {
        stroke-width: 0px;
      }

      .cls-4, .cls-6 {
        font-size: 18px;
      }

      .cls-7 {
        font-size: 21px;
      }

      .selected {
        fill: red;
        fill-opacity: 0.3;
      }
</style>