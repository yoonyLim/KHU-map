<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("4");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1364.4 768">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="357.5 335.33 367.69 335.33 760.53 335.33 760.53 270.45 766.46 270.45 766.46 241.57 906.11 241.57 906.11 269.66 906.11 335.33"/>
    <line class="cls-1" x1="906.11" y1="270.5" x2="1002.24" y2="270.5"/>
    <polyline class="cls-1" points="72.5 445.31 46.5 445.31 46.5 269.5 84.44 269.5"/>
    <polyline class="cls-1" points="1278.5 284.69 1316.75 284.69 1316.75 441.5 1292.5 441.5"/>
    <text class="cls-3" transform="translate(47.02 288.13)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(936.49 308.82)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1279.82 302.82)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(174.17 270.3)"><tspan class="cls-5"><tspan x="0" y="0">411</tspan></tspan><tspan class="cls-6"><tspan x="-35.62" y="25.2">계단강의실</tspan></tspan></text>
    <text class="cls-3" transform="translate(309.04 297.3)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(790.04 268.3)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-3" transform="translate(1014.45 297.21)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(1080.57 309.21)"><tspan x="0" y="0">401</tspan></text>
    <text class="cls-3" transform="translate(1161.57 309.21)"><tspan x="0" y="0">402</tspan></text>
    <text class="cls-4" transform="translate(1230.12 309.21)"><tspan x="0" y="0">402-1</tspan></text>
    <text class="cls-3" transform="translate(1220.57 489.21)"><tspan x="0" y="0">403</tspan></text>
    <text class="cls-3" transform="translate(1108.57 489.21)"><tspan x="0" y="0">404</tspan></text>
    <text class="cls-3" transform="translate(938.57 489.21)"><tspan x="0" y="0">405</tspan></text>
    <text class="cls-3" transform="translate(731.63 489.08)"><tspan x="0" y="0">406</tspan></text>
    <text class="cls-3" transform="translate(543.63 489.08)"><tspan x="0" y="0">407</tspan></text>
    <text class="cls-3" transform="translate(356.63 489.08)"><tspan x="0" y="0">408</tspan></text>
    <text class="cls-3" transform="translate(231.63 489.08)"><tspan x="0" y="0">409</tspan></text>
    <text class="cls-3" transform="translate(123.63 489.08)"><tspan x="0" y="0">410</tspan></text>
  </g>
  <g id="_410" data-name="410">
    <polygon :class="selectedClass == '410' ? 'selected' : ''" class="cls-1" points="215.38 524.5 72.5 524.5 72.5 445.31 72.5 441.5 215.38 441.5 215.38 524.5"/>
  </g>
  <g id="_409" data-name="409">
    <rect :class="selectedClass == '409' ? 'selected' : ''" class="cls-1" x="215.38" y="441.5" width="66.86" height="83"/>
  </g>
  <g id="_408" data-name="408">
    <rect :class="selectedClass == '408' ? 'selected' : ''" class="cls-1" x="282.24" y="441.5" width="186.33" height="83"/>
  </g>
  <g id="_407" data-name="407">
    <rect :class="selectedClass == '407' ? 'selected' : ''" class="cls-1" x="468.57" y="441.5" width="186.33" height="83"/>
  </g>
  <g id="_406" data-name="406">
    <rect :class="selectedClass == '406' ? 'selected' : ''" class="cls-1" x="654.9" y="441.5" width="187.12" height="83"/>
  </g>
  <g id="_405" data-name="405">
    <rect :class="selectedClass == '405' ? 'selected' : ''" class="cls-1" x="842.02" y="441.5" width="220.35" height="83"/>
  </g>
  <g id="_404" data-name="404">
    <rect :class="selectedClass == '404' ? 'selected' : ''" class="cls-1" x="1062.37" y="441.5" width="124.62" height="83"/>
  </g>
  <g id="_403" data-name="403">
    <rect :class="selectedClass == '403' ? 'selected' : ''" class="cls-1" x="1186.99" y="441.5" width="105.51" height="83"/>
  </g>
  <g id="_402-1" data-name="402-1">
    <polygon :class="selectedClass == '402-1' ? 'selected' : ''" class="cls-1" points="1278.5 284.69 1278.5 270.5 1226.15 270.5 1226.15 335.33 1278.5 335.33 1278.5 284.69"/>
  </g>
  <g id="_402" data-name="402">
    <rect :class="selectedClass == '402' ? 'selected' : ''" class="cls-1" x="1134.37" y="270.5" width="91.78" height="64.83"/>
  </g>
  <g id="_401" data-name="401">
    <polygon :class="selectedClass == '401' ? 'selected' : ''" class="cls-1" points="1062.77 335.33 1134.37 335.33 1134.37 270.5 1062.37 270.5 1062.77 335.33"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <polyline class="cls-1" points="1062.37 335.33 1062.37 270.5 1002.24 270.5 1002.24 335.33 1062.77 335.33"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-1" x="296.48" y="268.5" width="61.02" height="66.83"/>
  </g>
  <g id="_411" data-name="411">
    <polygon :class="selectedClass == '411' ? 'selected' : ''" class="cls-1" points="296.48 228.12 296.48 269.66 296.48 335.33 84.84 335.33 84.44 269.5 84.44 228.12 296.48 228.12"/>
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

      .cls-3, .cls-5 {
        font-size: 18px;
      }

      .cls-4 {
        font-size: 14px;
      }

      .cls-6 {
        font-size: 21px;
      }

      .selected {
        fill: red;
        fill-opacity: 0.3;
      }
</style>