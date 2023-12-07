<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("6");
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
    });

    onBeforeUnmount(() => {
      clearInterval(updateTimeInterval);
    });
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1366 767.79">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="355.5 335.5 761.19 335.5 761.19 268.5 766.46 268.5 766.46 241.18 908.35 241.18 908.35 269.13 908.35 335.5"/>
    <line class="cls-1" x1="908.35" y1="269.5" x2="1003.3" y2="269.5"/>
    <polyline class="cls-1" points="70.5 445.84 45.5 445.84 45.5 269.5 82.86 269.5"/>
    <polyline class="cls-1" points="1280.5 284.69 1318.5 284.69 1318.5 441.5 1293.5 441.5"/>
    <text class="cls-3" transform="translate(46.2 288.64)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(937.49 308.43)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1281.49 304.43)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(308.03 298.37)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(791.03 268.37)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-3" transform="translate(1016.31 298.7)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-2" transform="translate(172.43 269.7)"><tspan class="cls-5"><tspan x="0" y="0">612</tspan></tspan><tspan class="cls-6"><tspan x="-35.62" y="25.2">계단강의실</tspan></tspan></text>
    <text class="cls-3" transform="translate(109.19 489.28)"><tspan x="0" y="0">611</tspan></text>
    <text class="cls-3" transform="translate(213.19 489.28)"><tspan x="0" y="0">610</tspan></text>
    <text class="cls-3" transform="translate(345.19 489.28)"><tspan x="0" y="0">609</tspan></text>
    <text class="cls-3" transform="translate(509.19 489.28)"><tspan x="0" y="0">608</tspan></text>
    <text class="cls-3" transform="translate(674.54 489.39)"><tspan x="0" y="0">607</tspan></text>
    <text class="cls-3" transform="translate(816.42 489.39)"><tspan x="0" y="0">606-2</tspan></text>
    <text class="cls-3" transform="translate(963.42 489.39)"><tspan x="0" y="0">606-1</tspan></text>
    <text class="cls-4" transform="translate(1122.28 492.63)"><tspan x="0" y="0">605-1</tspan></text>
    <text class="cls-4" transform="translate(1068.28 492.63)"><tspan x="0" y="0">605-2</tspan></text>
    <text class="cls-3" transform="translate(1190.74 489.63)"><tspan x="0" y="0">604</tspan></text>
    <text class="cls-3" transform="translate(1251.74 489.63)"><tspan x="0" y="0">603</tspan></text>
    <text class="cls-3" transform="translate(1210.74 309.63)"><tspan x="0" y="0">602</tspan></text>
    <text class="cls-3" transform="translate(1102.74 309.63)"><tspan x="0" y="0">601</tspan></text>
  </g>
  <g id="_611" data-name="611">
    <polygon :class="selectedClass == '611' ? 'selected' : ''" class="cls-1" points="176.48 525.5 70.5 525.5 70.5 445.84 70.5 441.5 176.48 441.5 176.48 525.5"/>
  </g>
  <g id="_610" data-name="610">
    <rect :class="selectedClass == '610' ? 'selected' : ''" class="cls-1" x="176.48" y="441.5" width="105.49" height="84"/>
  </g>
  <g id="_609" data-name="609">
    <rect :class="selectedClass == '609' ? 'selected' : ''" class="cls-1" x="281.98" y="441.5" width="163.25" height="84"/>
  </g>
  <g id="_608" data-name="608">
    <rect :class="selectedClass == '608' ? 'selected' : ''" class="cls-1" x="445.23" y="441.5" width="161.93" height="84"/>
  </g>
  <g id="_607" data-name="607">
    <rect :class="selectedClass == '607' ? 'selected' : ''" class="cls-1" x="607.16" y="441.5" width="165.63" height="84"/>
  </g>
  <g id="_606-2" data-name="606-2">
    <rect :class="selectedClass == '606-2' ? 'selected' : ''" class="cls-1" x="772.79" y="441.5" width="145.85" height="84"/>
  </g>
  <g id="_606-1" data-name="606-1">
    <rect :class="selectedClass == '606-1' ? 'selected' : ''" class="cls-1" x="918.64" y="441.5" width="146.64" height="84"/>
  </g>
  <g id="_605-2" data-name="605-2">
    <rect :class="selectedClass == '605-2' ? 'selected' : ''" class="cls-1" x="1065.27" y="441.5" width="54.07" height="84"/>
  </g>
  <g id="_605-1" data-name="605-1">
    <rect :class="selectedClass == '605-1' ? 'selected' : ''" class="cls-1" x="1119.34" y="441.5" width="51.96" height="84"/>
  </g>
  <g id="_604" data-name="604">
    <rect :class="selectedClass == '604' ? 'selected' : ''" class="cls-1" x="1171.3" y="441.5" width="69.89" height="84"/>
  </g>
  <g id="_603" data-name="603">
    <rect :class="selectedClass == '603' ? 'selected' : ''" class="cls-1" x="1241.19" y="441.5" width="52.31" height="84"/>
  </g>
  <g id="_602" data-name="602">
    <rect :class="selectedClass == '602' ? 'selected' : ''" class="cls-1" x="1172.09" y="269.5" width="108.41" height="66"/>
  </g>
  <g id="_601" data-name="601">
    <polygon :class="selectedClass == '601' ? 'selected' : ''" class="cls-1" points="1063.69 335.5 1172.09 335.5 1172.09 269.5 1063.96 269.5 1063.69 335.5"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <polyline class="cls-1" points="1063.69 269.5 1063.69 335.5 1003.3 335.5 1003.3 269.5 1063.96 269.5"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-1" x="296.48" y="268.5" width="59.02" height="67"/>
  </g>
  <g id="_612" data-name="612">
    <polygon :class="selectedClass == '612' ? 'selected' : ''" class="cls-1" points="296.48 227.99 296.48 269.66 296.48 335.5 83.38 335.5 82.86 269.5 82.86 227.99 296.48 227.99"/>
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