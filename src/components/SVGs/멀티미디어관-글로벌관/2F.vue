<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("2");
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
          if (parseInt(timeHMS.value[1]) - parseInt(timeStart.split(":")[1]) >= 0) {
            return true;
          }
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1362.07 768">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="354.5 335 759 335 759 269.26 765.5 269.26 765.5 241.57 906.11 241.57 906.11 269.66 906.11 335"/>
    <line class="cls-1" x1="906.11" y1="269.5" x2="1000.5" y2="269.5"/>
    <polyline class="cls-1" points="71.5 444.91 46.86 444.91 46.86 268.5 83.5 268.5"/>
    <polyline class="cls-1" points="1277.19 284.3 1314.37 284.3 1314.37 440.96 1290.5 440.96"/>
    <text class="cls-3" transform="translate(48.43 288.06)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(173.05 273.03)"><tspan class="cls-4"><tspan x="0" y="0">210</tspan></tspan><tspan class="cls-5"><tspan x="-35.62" y="25.2">계단강의실</tspan></tspan></text>
    <text class="cls-3" transform="translate(307.92 298.03)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(788.92 268.03)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-3" transform="translate(935.92 309.03)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1013.2 297.86)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(1277.2 303.86)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(97.65 489.65)"><tspan x="0" y="0">209</tspan></text>
    <text class="cls-3" transform="translate(195.65 489.65)"><tspan x="0" y="0">208</tspan></text>
    <text class="cls-3" transform="translate(291.65 489.65)"><tspan x="0" y="0">207</tspan></text>
    <text class="cls-3" transform="translate(485.65 489.65)"><tspan x="0" y="0">206</tspan></text>
    <text class="cls-3" transform="translate(752.65 489.65)"><tspan x="0" y="0">205</tspan></text>
    <text class="cls-3" transform="translate(1004.45 489.79)"><tspan x="0" y="0">204</tspan></text>
    <text class="cls-3" transform="translate(1196.45 489.79)"><tspan x="0" y="0">203</tspan></text>
    <text class="cls-3" transform="translate(1186.45 308.79)"><tspan x="0" y="0">202</tspan></text>
    <text class="cls-3" transform="translate(1080.45 308.79)"><tspan x="0" y="0">201</tspan></text>
  </g>
  <g id="_209" data-name="209">
    <polygon :class="selectedClass == '209' ? 'selected' : ''" class="cls-1" points="71.5 444.91 71.5 440.96 166.33 440.96 166.33 524.5 71.5 524.5 71.5 444.91"/>
  </g>
  <g id="_208" data-name="208">
    <rect :class="selectedClass == '208' ? 'selected' : ''" class="cls-1" x="166.33" y="440.96" width="95.34" height="83.54"/>
  </g>
  <g id="_207" data-name="207">
    <rect :class="selectedClass == '207' ? 'selected' : ''" class="cls-1" x="261.67" y="440.96" width="96.13" height="83.54"/>
  </g>
  <g id="_206" data-name="206">
    <rect :class="selectedClass == '206' ? 'selected' : ''" class="cls-1" x="357.8" y="440.96" width="272.5" height="83.54"/>
  </g>
  <g id="_205" data-name="205">
    <rect :class="selectedClass == '205' ? 'selected' : ''" class="cls-1" x="630.3" y="440.96" width="275.8" height="83.54"/>
  </g>
  <g id="_204" data-name="204">
    <rect :class="selectedClass == '204' ? 'selected' : ''" class="cls-1" x="906.11" y="440.96" width="227.87" height="83.54"/>
  </g>
  <g id="_203" data-name="203">
    <rect :class="selectedClass == '203' ? 'selected' : ''" class="cls-1" x="1133.98" y="440.96" width="156.52" height="83.54"/>
  </g>
  <g id="_201" data-name="201">
    <rect :class="selectedClass == '201' ? 'selected' : ''" class="cls-1" x="1061.58" y="269.5" width="72.4" height="65.5"/>
  </g>
  <g id="_202" data-name="202">
    <rect :class="selectedClass == '202' ? 'selected' : ''" class="cls-1" x="1133.98" y="269.5" width="143.21" height="65.5"/>
  </g>
  <g id="_210" data-name="210">
    <polygon :class="selectedClass == '210' ? 'selected' : ''" class="cls-1" points="83.5 227.5 83.5 335 296.5 335 296.5 269 296.5 227.5 83.5 227.5"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-1" x="296.5" y="268.5" width="58" height="66.5"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <rect class="cls-1" x="1000.5" y="269.5" width="61.08" height="65.5"/>
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