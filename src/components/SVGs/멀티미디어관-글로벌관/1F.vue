<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("1");
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
  <g class="select-none" id="_글자" data-name="글자">
    <text class="cls-3" transform="translate(48.17 289.62)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(936.61 310.49)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1278.61 303.49)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(173.74 159.49)"><tspan class="cls-6"><tspan x="0" y="0">112</tspan></tspan><tspan class="cls-4"><tspan x="-35.62" y="25.2">계단강의실</tspan></tspan></text>
    <text class="cls-3" transform="translate(310.61 302.49)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(788.61 271.49)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-3" transform="translate(1015.61 302.49)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(1190.74 289.49)"><tspan x="0" y="0">102</tspan><tspan x="-55.12" y="21.6">후마니타스칼리지</tspan><tspan x="-10.12" y="43.2">라운지</tspan></text>
    <text class="cls-3" transform="translate(1080.61 490.49)"><tspan x="0" y="0">도서관</tspan></text>
    <text class="cls-3" transform="translate(1230.61 490.49)"><tspan x="0" y="0">103</tspan></text>
    <text class="cls-3" transform="translate(934.75 481.49)"><tspan x="0" y="0">Cafe</tspan><tspan x="-18.74" y="21.6">KHUffee</tspan></text>
    <text class="cls-3" transform="translate(97.74 310.49)"><tspan x="0" y="0">110</tspan></text>
    <text class="cls-3" transform="translate(1082.74 310.49)"><tspan x="0" y="0">101</tspan></text>
    <text class="cls-3" transform="translate(100.74 492.49)"><tspan x="0" y="0">109</tspan></text>
    <text class="cls-3" transform="translate(194.74 492.49)"><tspan x="0" y="0">108</tspan></text>
    <text class="cls-3" transform="translate(294.74 490.49)"><tspan x="0" y="0">107</tspan></text>
    <text class="cls-1" transform="translate(830.61 557.49)"><tspan x="0" y="0">정문</tspan></text>
    <text class="cls-1" transform="translate(1301.61 468.49)"><tspan x="0" y="0">쪽문</tspan></text>
    <text class="cls-1" transform="translate(25.9 475.59)"><tspan x="0" y="0">쪽문</tspan></text>
  </g>
  <g id="_레이어_2" data-name="레이어 2">
    <line class="cls-5" x1="357" y1="526" x2="907.09" y2="526"/>
    <polyline class="cls-5" points="1293.2 442.14 1316.67 442.14 1316.67 286.5 1278.69 286.5"/>
    <polyline class="cls-5" points="1003.62 271.24 906.5 271.24 906.5 336.12"/>
    <polyline class="cls-5" points="906.5 271.24 906.5 242.23 766.52 242.23 766.52 271.24 760.71 271.24 760.71 336.5 357 336.5"/>
  </g>
  <g id="_레이어_4" data-name="레이어 4">
    <polyline class="cls-5" points="46.5 270 46.5 445.5 72.36 445.5"/>
    <line class="cls-5" x1="84.5" y1="270" x2="46.5" y2="270"/>
    <line class="cls-5" x1="84.5" y1="227.46" x2="84.5" y2="270"/>
    <line class="cls-5" x1="297.59" y1="269.66" x2="297.59" y2="227.46"/>
  </g>
  <g id="여자 화장실">
    <rect class="cls-5" x="1003.62" y="271.24" width="58.81" height="64.88"/>
  </g>
  <g id="남자 화장실">
    <polyline class="cls-5" points="298.07 269.5 358 269.5 357 336.5 297.59 336.5 297.59 267.95"/>
  </g>
  <g id="101">
    <polygon :class="selectedClass == '101' ? 'selected' : ''" class="cls-5" points="1062.43 271.24 1062.43 336.12 1134.5 336.12 1134.16 271.24 1062.43 271.24"/>
  </g>
  <g id="KHUfee 카페">
    <rect :class="selectedClass == 'KHUfee 카페' ? 'selected' : ''" class="cls-5" x="907.09" y="442.14" width="96.53" height="83.86"/>
  </g>
  <g id="102">
    <polygon :class="selectedClass == '102' ? 'selected' : ''" class="cls-5" points="1278.69 286.5 1278.69 271.24 1134.16 271.24 1134.5 271.24 1134.5 336.5 1134.5 336.12 1278.69 336.12 1278.69 286.5"/>
  </g>
  <g id="도서관">
    <rect :class="selectedClass == '도서관' ? 'selected' : ''" class="cls-5" x="1003.62" y="442.14" width="193.05" height="83.86"/>
  </g>
  <g id="도서관">
    <rect :class="selectedClass == '103' ? 'selected' : ''" class="cls-5" x="1196.67" y="442.14" width="96.53" height="83.86"/>
  </g>
  <g id="unknown">
    <polyline class="cls-5" points="297.59 269.66 297.59 336.5 236.41 336.5 236.41 269.66 297.07 269.66"/>
  </g>
  <g id="108">
    <polygon :class="selectedClass == '108' ? 'selected' : ''" class="cls-5" points="262.85 526 262.85 445.5 166.91 445.5 167.11 526 262.85 526"/>
  </g>
  <g id="107">
    <rect :class="selectedClass == '107' ? 'selected' : ''" class="cls-5" x="262.85" y="445.5" width="94.15" height="80.5"/>
  </g>
  <g id="110">
    <rect :class="selectedClass == '110' ? 'selected' : ''" class="cls-5" x="84.5" y="270" width="60.5" height="68"/>
  </g>
  <g id="109">
    <polyline :class="selectedClass == '109' ? 'selected' : ''" class="cls-5" points="167.11 445.5 167.11 526 72 526 72.36 445.5 166.91 445.5"/>
  </g>
  <g id="112">
    <rect :class="selectedClass == '112' ? 'selected' : ''" class="cls-5" x="84.5" y="104.5" width="213.09" height="122.96"/>
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
      .cls-1, .cls-4 {
        font-size: 21px;
      }

      .cls-5 {
        stroke: #000;
        stroke-miterlimit: 10;
        fill: none;
      }

      .selected {
        fill: red;
        fill-opacity: 0.3;
      }

      .cls-3, .cls-6 {
        font-size: 18px;
      }
</style>