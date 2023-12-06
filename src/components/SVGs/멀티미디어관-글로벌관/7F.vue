<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("7");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1366 766.85">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="357.5 334.54 761.32 334.54 761.32 269.5 767.65 269.5 767.65 240.5 907.5 240.5 907.5 268.87 907.5 334.54"/>
    <line class="cls-1" x1="907.5" y1="268.5" x2="1003.5" y2="268.5"/>
    <polyline class="cls-1" points="71.5 446.36 45.5 446.36 45.5 268.5 83.25 268.5"/>
    <polyline class="cls-1" points="1279.5 284.96 1317.67 284.96 1317.67 441.62 1293.5 441.62"/>
    <text class="cls-3" transform="translate(47.02 287.8)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(937.45 308.48)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1280.45 302.48)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(171.85 269.08)"><tspan class="cls-4"><tspan x="0" y="0">713</tspan></tspan><tspan class="cls-5"><tspan x="-35.62" y="25.2">계단강의실</tspan></tspan></text>
    <text class="cls-3" transform="translate(309.89 296.64)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(790.73 268.53)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-3" transform="translate(1016.73 296.53)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(1083.86 308.53)"><tspan x="0" y="0">701</tspan></text>
    <text class="cls-3" transform="translate(1164.86 308.53)"><tspan x="0" y="0">702</tspan></text>
    <text class="cls-3" transform="translate(1235.86 308.53)"><tspan x="0" y="0">703</tspan></text>
    <text class="cls-3" transform="translate(1197.86 488.53)"><tspan x="0" y="0">704</tspan></text>
    <text class="cls-3" transform="translate(1080.86 488.53)"><tspan x="0" y="0">705</tspan></text>
    <text class="cls-3" transform="translate(955.74 488.53)"><tspan x="0" y="0">705-1</tspan></text>
    <text class="cls-3" transform="translate(818.86 488.53)"><tspan x="0" y="0">707</tspan></text>
    <text class="cls-3" transform="translate(672.2 489.06)"><tspan x="0" y="0">708</tspan></text>
    <text class="cls-3" transform="translate(562.2 489.06)"><tspan x="0" y="0">709</tspan></text>
    <text class="cls-3" transform="translate(489.29 488.9)"><tspan x="0" y="0">710</tspan></text>
    <text class="cls-3" transform="translate(403.17 488.9)"><tspan x="0" y="0">711-1</tspan></text>
    <text class="cls-3" transform="translate(332.17 488.9)"><tspan x="0" y="0">711-2</tspan></text>
    <text class="cls-3" transform="translate(233.17 488.9)"><tspan x="0" y="0">712-1</tspan></text>
    <text class="cls-3" transform="translate(104.17 488.9)"><tspan x="0" y="0">712-2</tspan></text>
  </g>
  <g id="_712-2" data-name="712-2">
    <polygon :class="selectedClass == '712-2' ? 'selected' : ''" class="cls-1" points="199.56 523.5 71.5 523.5 71.5 446.36 71.5 441.62 199.56 441.62 199.56 523.5"/>
  </g>
  <g id="_712-1" data-name="712-1">
    <rect :class="selectedClass == '712-1' ? 'selected' : ''" class="cls-1" x="199.56" y="441.62" width="127.94" height="81.88"/>
  </g>
  <g id="_711-2" data-name="711-2">
    <rect :class="selectedClass == '711-2' ? 'selected' : ''" class="cls-1" x="327.5" y="441.62" width="69.07" height="81.88"/>
  </g>
  <g id="_711-1" data-name="711-1">
    <rect :class="selectedClass == '711-1' ? 'selected' : ''" class="cls-1" x="396.57" y="441.62" width="71.6" height="81.88"/>
  </g>
  <g id="_710" data-name="710">
    <rect :class="selectedClass == '710' ? 'selected' : ''" class="cls-1" x="468.18" y="441.62" width="75.16" height="81.88"/>
  </g>
  <g id="_709" data-name="709">
    <rect :class="selectedClass == '709' ? 'selected' : ''" class="cls-1" x="543.34" y="441.62" width="73.19" height="81.88"/>
  </g>
  <g id="_708" data-name="708">
    <rect :class="selectedClass == '708' ? 'selected' : ''" class="cls-1" x="616.53" y="441.62" width="147.96" height="81.88"/>
  </g>
  <g id="_707" data-name="707">
    <rect :class="selectedClass == '707' ? 'selected' : ''" class="cls-1" x="764.48" y="441.62" width="143.02" height="81.88"/>
  </g>
  <g id="_705-1" data-name="705-1">
    <rect :class="selectedClass == '705-1' ? 'selected' : ''" class="cls-1" x="907.5" y="441.62" width="156" height="81.88"/>
  </g>
  <g id="_705" data-name="705">
    <rect :class="selectedClass == '705' ? 'selected' : ''" class="cls-1" x="1063.5" y="441.62" width="72.06" height="81.88"/>
  </g>
  <g id="_704" data-name="704">
    <rect :class="selectedClass == '704' ? 'selected' : ''" class="cls-1" x="1135.56" y="441.62" width="157.94" height="81.88"/>
  </g>
  <g id="_703" data-name="703">
    <rect :class="selectedClass == '703' ? 'selected' : ''" class="cls-1" x="1227.08" y="268.5" width="52.42" height="66.04"/>
  </g>
  <g id="_702" data-name="702">
    <rect :class="selectedClass == '702' ? 'selected' : ''" class="cls-1" x="1135.56" y="268.5" width="91.52" height="66.04"/>
  </g>
  <g id="_701" data-name="701">
    <polyline :class="selectedClass == '701' ? 'selected' : ''" class="cls-1" points="1063.26 334.5 1135.56 334.54 1135.56 268.5 1063 268.5 1063 334.54"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <polyline class="cls-1" points="1062.77 268.5 1062.77 334.5 1062.77 334.54 1003.5 334.54 1003.5 268.5 1064 268.5"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-1" x="297.5" y="269.5" width="60" height="65.04"/>
  </g>
  <g id="_713" data-name="713">
    <polygon :class="selectedClass == '713' ? 'selected' : ''" class="cls-1" points="297.5 227.33 297.5 269.66 297.5 334.54 83.25 334.54 83.25 268.5 83.25 227.33 297.5 227.33"/>
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