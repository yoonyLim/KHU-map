<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("3");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1366 766.74">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="357.5 334.14 762.11 334.14 762.11 268.5 767.65 268.5 767.65 240.38 908.09 240.38 908.09 269.4 908.09 334.14"/>
    <line class="cls-1" x1="908.09" y1="269.5" x2="1003.5" y2="269.5"/>
    <polyline class="cls-1" points="72.5 444.52 47.5 444.52 47.5 267.5 85.23 267.5"/>
    <polyline class="cls-1" points="1279.5 283.9 1318.5 283.9 1318.5 440.5 1293.5 440.5"/>
    <text class="cls-3" transform="translate(49.58 286.77)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(938.71 308.6)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1280.92 302.81)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(175.54 271.47)"><tspan class="cls-4"><tspan x="0" y="0">312</tspan></tspan><tspan class="cls-5"><tspan x="-35.62" y="25.2">계단강의실</tspan></tspan></text>
    <text class="cls-3" transform="translate(310.42 296.47)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(791.42 268.47)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-3" transform="translate(1016.18 296.96)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(1083.31 308.96)"><tspan x="0" y="0">301</tspan></text>
    <text class="cls-3" transform="translate(1189.31 308.96)"><tspan x="0" y="0">302</tspan></text>
    <text class="cls-3" transform="translate(1252.31 488.96)"><tspan x="0" y="0">303</tspan></text>
    <text class="cls-3" transform="translate(1174.31 488.96)"><tspan x="0" y="0">304</tspan></text>
    <text class="cls-3" transform="translate(1053.31 488.96)"><tspan x="0" y="0">305</tspan></text>
    <text class="cls-3" transform="translate(904.31 488.96)"><tspan x="0" y="0">306</tspan></text>
    <text class="cls-3" transform="translate(744.31 488.96)"><tspan x="0" y="0">307</tspan></text>
    <text class="cls-3" transform="translate(584.38 489.36)"><tspan x="0" y="0">308</tspan></text>
    <text class="cls-3" transform="translate(424.38 489.36)"><tspan x="0" y="0">309</tspan></text>
    <text class="cls-3" transform="translate(268.38 489.36)"><tspan x="0" y="0">310</tspan></text>
    <text class="cls-3" transform="translate(125.38 489.36)"><tspan x="0" y="0">311</tspan></text>
  </g>
  <g id="_311" data-name="311">
    <polygon :class="selectedClass == '311' ? 'selected' : ''" class="cls-1" points="216.84 524.5 72.5 524.5 72.5 444.52 72.5 440.5 216.84 440.5 216.84 524.5"/>
  </g>
  <g id="_310" data-name="310">
    <rect :class="selectedClass == '310' ? 'selected' : ''" class="cls-1" x="216.84" y="440.5" width="142.95" height="84"/>
  </g>
  <g id="_309" data-name="309">
    <rect :class="selectedClass == '309' ? 'selected' : ''" class="cls-1" x="359.78" y="440.5" width="161.93" height="84"/>
  </g>
  <g id="_308" data-name="308">
    <rect :class="selectedClass == '308' ? 'selected' : ''" class="cls-1" x="521.71" y="440.5" width="161.29" height="84"/>
  </g>
  <g id="_307" data-name="307">
    <rect :class="selectedClass == '307' ? 'selected' : ''" class="cls-1" x="683" y="440.5" width="160.47" height="84"/>
  </g>
  <g id="_306" data-name="306">
    <rect :class="selectedClass == '306' ? 'selected' : ''" class="cls-1" x="843.47" y="440.5" width="160.35" height="84"/>
  </g>
  <g id="_305" data-name="305">
    <rect :class="selectedClass == '305' ? 'selected' : ''" class="cls-1" x="1003.82" y="440.5" width="132.13" height="84"/>
  </g>
  <g id="_304" data-name="304">
    <rect :class="selectedClass == '304' ? 'selected' : ''" class="cls-1" x="1135.96" y="440.5" width="104.97" height="84"/>
  </g>
  <g id="_303" data-name="303">
    <rect :class="selectedClass == '303' ? 'selected' : ''" class="cls-1" x="1240.92" y="440.5" width="52.58" height="84"/>
  </g>
  <g id="_302" data-name="302">
    <rect :class="selectedClass == '302' ? 'selected' : ''" class="cls-1" x="1135.16" y="269.5" width="144.34" height="65.57"/>
  </g>
  <g id="_301" data-name="301">
    <polygon :class="selectedClass == '301' ? 'selected' : ''" class="cls-1" points="1063.5 335.07 1135.16 335.07 1135.16 269.5 1063.96 269.5 1063.5 335.07"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <polyline class="cls-1" points="1063.5 269.5 1063.5 335.5 1063.5 335.07 1003.5 335.07 1003.5 269.5 1063.96 269.5"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-1" x="298.5" y="268.5" width="59" height="65.64"/>
  </g>
  <g id="_312" data-name="312">
    <polygon :class="selectedClass == '312' ? 'selected' : ''" class="cls-1" points="298.5 227.33 298.5 268.08 298.5 334.14 85.63 334.14 85.23 267.5 85.23 227.33 298.5 227.33"/>
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

      .cls-3, .cls-4 {
        font-size: 18px;
      }

      .cls-5 {
        font-size: 21px;
      }

      .selected {
        fill: red;
        fill-opacity: 0.3;
      }
</style>