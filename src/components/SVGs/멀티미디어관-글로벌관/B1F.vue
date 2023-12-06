<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("B1");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1363.75 768">
  <g id="_레이어_2" data-name="레이어 2">
    <line class="cls-1" x1="295.69" y1="229.57" x2="295.69" y2="270.5"/>
    <line class="cls-1" x1="83.5" y1="270.19" x2="83.5" y2="229.57"/>
    <polyline class="cls-1" points="70.99 445.84 46.5 445.84 46.5 270.19 83.5 270.19"/>
    <polyline class="cls-1" points="357 336.5 759.5 336.5 759.5 270.71 764.88 270.71 764.88 243.29 905.5 243.29 905.5 270.71 905.5 336"/>
    <line class="cls-1" x1="905.5" y1="271.5" x2="1000.5" y2="271.5"/>
    <polyline class="cls-1" points="1277.58 287.07 1313.5 287.07 1313.5 442.5 1290.5 442.5"/>
    <text class="cls-3" transform="translate(47.52 289.85)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(90.2 309.83)"><tspan x="0" y="0">B112</tspan></text>
    <text class="cls-3" transform="translate(241.2 309.83)"><tspan x="0" y="0">B113</tspan></text>
    <text class="cls-3" transform="translate(309.45 297.83)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-2" transform="translate(166.2 161.83)"><tspan class="cls-4"><tspan x="0" y="0">B114</tspan></tspan><tspan class="cls-5"><tspan x="-29.25" y="25.2">계단강의실</tspan></tspan></text>
    <text class="cls-3" transform="translate(788.45 266.83)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-3" transform="translate(934.77 312.41)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1012.77 297.41)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(1063.52 312.41)"><tspan x="0" y="0">B101</tspan></text>
    <text class="cls-3" transform="translate(1115.52 312.41)"><tspan x="0" y="0">B102</tspan></text>
    <text class="cls-3" transform="translate(1277.77 304.41)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1120.52 490.41)"><tspan x="0" y="0">B105</tspan></text>
    <text class="cls-2" transform="translate(1169.9 297.41)"><tspan class="cls-4"><tspan x="0" y="0">B101/B104</tspan></tspan><tspan class="cls-5"><tspan x="18.37" y="25.2">행정실</tspan></tspan></text>
    <text class="cls-3" transform="translate(904.52 490.41)"><tspan x="0" y="0">B106</tspan></text>
    <text class="cls-3" transform="translate(738.52 490.41)"><tspan x="0" y="0">B107</tspan></text>
    <text class="cls-3" transform="translate(579.17 490.59)"><tspan x="0" y="0">B108</tspan></text>
    <text class="cls-3" transform="translate(415.17 490.59)"><tspan x="0" y="0">B109</tspan></text>
    <text class="cls-3" transform="translate(263.17 490.59)"><tspan x="0" y="0">B110</tspan></text>
    <text class="cls-3" transform="translate(120.17 490.59)"><tspan x="0" y="0">B111</tspan></text>
  </g>
  <g id="_111" data-name="111">
    <polygon :class="selectedClass == 'B111' ? 'selected' : ''" class="cls-1" points="214.99 525.48 71.5 525.48 70.99 445.84 70.99 442.5 214.99 442.5 214.99 525.48"/>
  </g>
  <g id="_110" data-name="110">
    <rect :class="selectedClass == 'B110' ? 'selected' : ''" class="cls-1" x="214.99" y="442.5" width="142.01" height="82.98"/>
  </g>
  <g id="_109" data-name="109">
    <rect :class="selectedClass == 'B109' ? 'selected' : ''" class="cls-1" x="357" y="442.5" width="161.81" height="82.98"/>
  </g>
  <g id="_108" data-name="108">
    <rect :class="selectedClass == 'B108' ? 'selected' : ''" class="cls-1" x="518.81" y="442.5" width="163.06" height="82.98"/>
  </g>
  <g id="_107" data-name="107">
    <rect :class="selectedClass == 'B107' ? 'selected' : ''" class="cls-1" x="681.87" y="442.5" width="158.96" height="82.98"/>
  </g>
  <g id="_106" data-name="106">
    <rect :class="selectedClass == 'B106' ? 'selected' : ''" class="cls-1" x="840.84" y="442.5" width="159.82" height="82.98"/>
  </g>
  <g id="_105" data-name="105">
    <rect :class="selectedClass == 'B105' ? 'selected' : ''" class="cls-1" x="1000.66" y="442.5" width="289.84" height="82.98"/>
  </g>
  <g id="_101" data-name="101">
    <rect :class="selectedClass == 'B101' ? 'selected' : ''" class="cls-1" x="1164.44" y="271.5" width="113.14" height="64"/>
  </g>
  <g id="_102" data-name="102">
    <rect :class="selectedClass == 'B102' ? 'selected' : ''" class="cls-1" x="1112.62" y="271.5" width="51.82" height="64"/>
  </g>
  <g id="_101-2" data-name="101">
    <rect :class="selectedClass == 'B101-2' ? 'selected' : ''" class="cls-1" x="1060.79" y="271.5" width="51.82" height="64"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <polygon class="cls-1" points="1000.5 271.5 1001.19 335.5 1060.79 335.5 1060.79 271.5 1000.5 271.5"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-1" x="295.69" y="270.5" width="60.81" height="66"/>
  </g>
  <g id="_113" data-name="113">
    <rect :class="selectedClass == 'B113' ? 'selected' : ''" class="cls-1" x="235.5" y="270.5" width="60.19" height="66"/>
  </g>
  <g id="_112" data-name="112">
    <rect :class="selectedClass == 'B112' ? 'selected' : ''" class="cls-1" x="83.5" y="270.19" width="60.02" height="67.31"/>
  </g>
  <g id="_114" data-name="114">
    <rect :class="selectedClass == 'B114' ? 'selected' : ''" class="cls-1" x="83.5" y="104.5" width="212.19" height="125.07"/>
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