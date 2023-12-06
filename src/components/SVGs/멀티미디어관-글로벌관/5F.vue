<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("5");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1366 766.37">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="356.5 333.15 761.5 333.15 761.5 268.08 768.5 268.08 768.5 239.86 908.5 239.86 908.5 268.6 908.5 333.15"/>
    <line class="cls-1" x1="908.5" y1="268.5" x2="1003.3" y2="268.5"/>
    <polyline class="cls-1" points="71.5 445.04 47.5 445.04 47.5 268.5 84.44 268.5"/>
    <polyline class="cls-1" points="1279.5 283.37 1318.5 283.37 1318.5 439.77 1293.5 439.76"/>
    <text class="cls-3" transform="translate(47.59 286.21)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(937.49 308.86)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1280.35 300.92)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(174.3 271.19)"><tspan class="cls-5"><tspan x="0" y="0">513</tspan></tspan><tspan class="cls-6"><tspan x="-35.62" y="25.2">계단강의실</tspan></tspan></text>
    <text class="cls-3" transform="translate(309.17 296.19)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(789.15 268.25)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-3" transform="translate(1015.61 293.61)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(1082.74 308.61)"><tspan x="0" y="0">501</tspan></text>
    <text class="cls-3" transform="translate(1163.74 308.61)"><tspan x="0" y="0">502</tspan></text>
    <text class="cls-4" transform="translate(1231.28 305.61)"><tspan x="0" y="0">502-1</tspan></text>
    <text class="cls-4" transform="translate(1244.86 487.97)"><tspan x="0" y="0">503-1</tspan></text>
    <text class="cls-3" transform="translate(1199.32 487.97)"><tspan x="0" y="0">503</tspan></text>
    <text class="cls-3" transform="translate(1144.32 487.97)"><tspan x="0" y="0">504</tspan></text>
    <text class="cls-3" transform="translate(1051.13 488.03)"><tspan x="0" y="0">505</tspan></text>
    <text class="cls-3" transform="translate(939.13 488.03)"><tspan x="0" y="0">506</tspan></text>
    <text class="cls-3" transform="translate(818.98 487.7)"><tspan x="0" y="0">507</tspan></text>
    <text class="cls-3" transform="translate(671.56 487.66)"><tspan x="0" y="0">508</tspan></text>
    <text class="cls-3" transform="translate(562.56 487.66)"><tspan x="0" y="0">509</tspan></text>
    <text class="cls-3" transform="translate(488.56 487.66)"><tspan x="0" y="0">510</tspan></text>
    <text class="cls-3" transform="translate(368.44 488.41)"><tspan x="0" y="0">511</tspan></text>
    <text class="cls-3" transform="translate(163.44 487.41)"><tspan x="0" y="0">512</tspan></text>
  </g>
  <g id="_512" data-name="512">
    <polygon :class="selectedClass == '512' ? 'selected' : ''" class="cls-1" points="296.48 523.5 71.5 523.5 71.5 445.04 71.5 439.5 296.48 439.55 296.48 523.5"/>
  </g>
  <g id="_511" data-name="511">
    <polygon :class="selectedClass == '511' ? 'selected' : ''" class="cls-1" points="469.23 523.5 296.48 523.5 296.48 439.55 469.23 439.59 469.23 523.5"/>
  </g>
  <g id="_510" data-name="510">
    <polygon :class="selectedClass == '510' ? 'selected' : ''" class="cls-1" points="469.23 523.5 469.23 439.59 543.6 439.6 543.6 523.5 469.23 523.5"/>
  </g>
  <g id="_509" data-name="509">
    <polygon :class="selectedClass == '509' ? 'selected' : ''" class="cls-1" points="617.98 523.5 543.6 523.5 543.6 439.6 617.98 439.62 617.98 523.5"/>
  </g>
  <g id="_508" data-name="508">
    <polygon :class="selectedClass == '508' ? 'selected' : ''" class="cls-1" points="763.82 523.5 617.98 523.5 617.98 439.76 617.98 439.62 763.82 439.65 763.82 523.5"/>
  </g>
  <g id="_507" data-name="507">
    <polygon :class="selectedClass == '507' ? 'selected' : ''" class="cls-1" points="907.82 523.5 763.82 523.5 763.82 439.65 907.82 439.68 907.82 523.5"/>
  </g>
  <g id="_506" data-name="506">
    <polygon :class="selectedClass == '506' ? 'selected' : ''" class="cls-1" points="907.82 439.68 907.82 523.5 1004.35 523.5 1004.35 439.7 907.82 439.68"/>
  </g>
  <g id="_505" data-name="505">
    <polygon :class="selectedClass == '505' ? 'selected' : ''" class="cls-1" points="1135.16 523.5 1004.35 523.5 1004.35 439.76 1004.35 439.7 1135.16 439.73 1135.16 523.5"/>
  </g>
  <g id="_504" data-name="504">
    <polygon :class="selectedClass == '504' ? 'selected' : ''" class="cls-1" points="1188.97 523.5 1135.16 523.5 1135.16 439.76 1135.16 439.73 1188.97 439.74 1188.97 523.5"/>
  </g>
  <g id="_503" data-name="503">
    <polygon :class="selectedClass == '503' ? 'selected' : ''" class="cls-1" points="1240.92 523.5 1188.97 523.5 1188.97 439.74 1240.92 439.75 1240.92 523.5"/>
  </g>
  <g id="_503-1" data-name="503-1">
    <polygon :class="selectedClass == '503-1' ? 'selected' : ''" class="cls-1" points="1293.5 523.5 1293.5 439.76 1240.92 439.75 1240.92 523.5 1293.5 523.5"/>
  </g>
  <g id="_502-1" data-name="502-1">
    <polygon :class="selectedClass == '502-1' ? 'selected' : ''" class="cls-1" points="1227.21 333.15 1279.5 333.15 1279.5 283.37 1279.5 268.5 1227.21 268.5 1227.21 333.15"/>
  </g>
  <g id="_502" data-name="502">
    <rect :class="selectedClass == '502' ? 'selected' : ''" class="cls-1" x="1136.22" y="268.5" width="90.99" height="64.65"/>
  </g>
  <g id="_501" data-name="501">
    <polygon :class="selectedClass == '501' ? 'selected' : ''" class="cls-1" points="1136.22 333.15 1063.43 333.15 1063.69 268.5 1136.22 268.5 1136.22 333.15"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <polyline class="cls-1" points="1063.43 268.5 1063.43 333.15 1003.3 333.15 1003.3 268.5 1063.69 268.5"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-1" x="297.5" y="267.5" width="59" height="65.65"/>
  </g>
  <g id="_513" data-name="513">
    <polygon :class="selectedClass == '513' ? 'selected' : ''" class="cls-1" points="297.5 226.5 297.5 267.81 297.5 333.15 84.64 333.15 84.44 268.5 84.44 226.5 297.5 226.5"/>
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