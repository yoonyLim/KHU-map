<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("전자정보-응용과학대학관");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1315.16 768">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-5" points="358 641.5 59.5 641.5 59.5 311"/>
    <line class="cls-5" x1="920" y1="641.5" x2="817" y2="641.5"/>
    <line class="cls-5" x1="1017" y1="641.5" x2="920" y2="641.5"/>
    <line class="cls-5" x1="1280.5" y1="311" x2="1280.5" y2="522"/>
    <line class="cls-5" x1="817" y1="522" x2="1017" y2="522"/>
    <polyline class="cls-5" points="59.5 522 197 522 358 522"/>
    <line class="cls-5" x1="196" y1="641.5" x2="196" y2="521.5"/>
    <line class="cls-5" x1="304" y1="522" x2="304" y2="641.5"/>
    <polyline class="cls-5" points="817 641.5 920 641.5 920 522"/>
    <line class="cls-5" x1="817" y1="607" x2="920" y2="607"/>
  </g>
  <g id="_06" data-name="06">
    <rect :class="selectedClass == 'B06' ? 'selected' : ''" class="cls-5" x="358" y="522" width="240" height="119.5"/>
  </g>
  <g id="_08" data-name="08">
    <rect :class="selectedClass == 'B08' ? 'selected' : ''" class="cls-5" x="598" y="522" width="219" height="119.5"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-5" x="1017" y="522" width="124" height="119.5"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <rect class="cls-5" x="1141" y="522" width="139.5" height="119.5"/>
  </g>
  <g id="_09" data-name="09">
    <polygon :class="selectedClass == 'B09' ? 'selected' : ''" class="cls-5" points="817 311 1280.5 311 1280.5 308 1280.5 12 817 12 817 311"/>
  </g>
  <g id="_07" data-name="07">
    <polygon :class="selectedClass == 'B07' ? 'selected' : ''" class="cls-5" points="598 311 817 311 817 12 598 12 598 31 598 311"/>
  </g>
  <g id="_휴게실" data-name="휴게실">
    <polygon :class="selectedClass == '휴게실' ? 'selected' : ''" class="cls-5" points="474 311 598 311 598 157.26 474.75 157 474 311"/>
  </g>
  <g id="_05-_1" data-name="05-`1">
    <polygon :class="selectedClass == 'B05-1' ? 'selected' : ''" class="cls-5" points="474.48 156.52 598 157 598 31 474 31 474.48 156.52"/>
  </g>
  <g id="_05" data-name="05">
    <polygon :class="selectedClass == 'B05' ? 'selected' : ''" class="cls-5" points="370 311 474 311 474 31 370 31 370 200.5 370 311"/>
  </g>
  <g id="_03" data-name="03">
    <rect :class="selectedClass == 'B03' ? 'selected' : ''" class="cls-5" x="211" y="200.5" width="159" height="110.5"/>
  </g>
  <g id="B01">
    <rect :class="selectedClass == 'B01' ? 'selected' : ''" class="cls-5" x="59.5" y="200.5" width="151.5" height="110.5"/>
  </g>
  <g id="_텍스트" data-name="텍스트">
    <text class="cls-3" transform="translate(851 630)"><tspan x="0" y="0">입구</tspan></text>
    <text class="cls-3" transform="translate(849 544)"><tspan x="0" y="0">입구</tspan></text>
    <text class="cls-4" transform="translate(676 599.52)"><tspan x="0" y="0">B08</tspan></text>
    <text class="cls-4" transform="translate(439 599.52)"><tspan x="0" y="0">B06</tspan></text>
    <text class="cls-4" transform="translate(99 268.52)"><tspan x="0" y="0">B01</tspan></text>
    <text class="cls-4" transform="translate(260 268.52)"><tspan x="0" y="0">B03</tspan></text>
    <text class="cls-4" transform="translate(385 170.52)"><tspan x="0" y="0">B05</tspan></text>
    <text class="cls-4" transform="translate(670 160.52)"><tspan x="0" y="0">B07</tspan></text>
    <text class="cls-4" transform="translate(481 254.52)"><tspan x="0" y="0">휴게실</tspan></text>
    <text class="cls-1" transform="translate(1041 572.52)"><tspan x="0" y="0">남자</tspan><tspan x="-18" y="43.2">화장실</tspan></text>
    <text class="cls-1" transform="translate(1173 572.52)"><tspan x="0" y="0">여자</tspan><tspan x="-18" y="43.2">화장실</tspan></text>
    <text class="cls-4" transform="translate(1021 159.52)"><tspan x="0" y="0">B09</tspan></text>
    <text class="cls-2" transform="translate(483 109.52)"><tspan x="0" y="0">B05-1</tspan></text>
    <text class="cls-4" transform="translate(212 599.52)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-4" transform="translate(932 599.52)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(312 584.52)"><tspan x="0" y="0">엘리</tspan><tspan x="-9" y="21.6">베이터</tspan></text>
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
        font-size: 36px;
      }

      .cls-5 {
        fill: none;
        stroke: #000;
        stroke-miterlimit: 10;
      }

      .cls-2 {
        font-size: 32px;
      }

      .cls-3 {
        font-size: 18px;
      }

      .cls-4 {
        font-size: 36.77px;
      }

      .selected {
        fill: red;
        fill-opacity: 0.3;
      }
</style>