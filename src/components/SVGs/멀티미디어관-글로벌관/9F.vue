<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("9");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1368.24 768">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="358.5 335.33 762.51 335.33 762.51 268.5 769.63 268.5 769.63 241.18 910.46 241.18 910.46 268.5 910.46 335.5"/>
    <line class="cls-1" x1="1005.41" y1="268.5" x2="910.46" y2="268.5"/>
    <polyline class="cls-1" points="71.5 445.31 48.5 445.31 48.5 268.5 86.02 268.5"/>
    <polyline class="cls-1" points="1283.12 284.96 1320.31 284.96 1320.31 441.62 1295.5 441.62"/>
    <text class="cls-2" transform="translate(49.42 288.47)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(939.62 309.14)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(1282.62 302.14)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(310.99 298.14)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-2" transform="translate(791.99 268.14)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-2" transform="translate(1017.79 298.21)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-2" transform="translate(103.79 283.21)"><tspan x="0" y="0">928</tspan></text>
    <text class="cls-2" transform="translate(174.79 283.21)"><tspan x="0" y="0">929</tspan></text>
    <text class="cls-2" transform="translate(245.79 283.23)"><tspan x="0" y="0">930</tspan></text>
    <text class="cls-2" transform="translate(1071.79 309.23)"><tspan x="0" y="0">901</tspan></text>
    <text class="cls-2" transform="translate(1112.99 309.21)"><tspan x="0" y="0">902</tspan></text>
    <text class="cls-2" transform="translate(1157.99 309.21)"><tspan x="0" y="0">903</tspan></text>
    <text class="cls-2" transform="translate(1199.99 309.21)"><tspan x="0" y="0">904</tspan></text>
    <text class="cls-2" transform="translate(1243.99 309.21)"><tspan x="0" y="0">905</tspan></text>
    <text class="cls-2" transform="translate(1256.99 489.21)"><tspan x="0" y="0">906</tspan></text>
    <text class="cls-2" transform="translate(1214.99 489.21)"><tspan x="0" y="0">907</tspan></text>
    <text class="cls-2" transform="translate(1172.99 489.21)"><tspan x="0" y="0">908</tspan></text>
    <text class="cls-2" transform="translate(1133.99 489.21)"><tspan x="0" y="0">909</tspan></text>
    <text class="cls-2" transform="translate(1091.99 489.21)"><tspan x="0" y="0">910</tspan></text>
    <text class="cls-2" transform="translate(1051.99 489.21)"><tspan x="0" y="0">911</tspan></text>
    <text class="cls-2" transform="translate(1008.99 489.21)"><tspan x="0" y="0">912</tspan></text>
    <text class="cls-2" transform="translate(940.99 489.21)"><tspan x="0" y="0">913</tspan></text>
    <text class="cls-2" transform="translate(820.99 489.21)"><tspan x="0" y="0">914</tspan></text>
    <text class="cls-2" transform="translate(720.71 489.65)"><tspan x="0" y="0">915</tspan></text>
    <text class="cls-2" transform="translate(665.71 489.65)"><tspan x="0" y="0">916</tspan></text>
    <text class="cls-2" transform="translate(610.54 489.63)"><tspan x="0" y="0">917</tspan></text>
    <text class="cls-2" transform="translate(557.54 489.63)"><tspan x="0" y="0">918</tspan></text>
    <text class="cls-2" transform="translate(503.54 489.63)"><tspan x="0" y="0">919</tspan></text>
    <text class="cls-2" transform="translate(449.54 489.63)"><tspan x="0" y="0">920</tspan></text>
    <text class="cls-2" transform="translate(396.54 489.63)"><tspan x="0" y="0">921</tspan></text>
    <text class="cls-2" transform="translate(341.54 489.63)"><tspan x="0" y="0">922</tspan></text>
    <text class="cls-2" transform="translate(289.54 489.63)"><tspan x="0" y="0">923</tspan></text>
    <text class="cls-2" transform="translate(236.54 489.63)"><tspan x="0" y="0">924</tspan></text>
    <text class="cls-2" transform="translate(184.54 489.63)"><tspan x="0" y="0">925</tspan></text>
    <text class="cls-2" transform="translate(131.54 489.63)"><tspan x="0" y="0">926</tspan></text>
    <text class="cls-2" transform="translate(82.54 489.63)"><tspan x="0" y="0">927</tspan></text>
  </g>
  <g id="_927" data-name="927">
    <polygon :class="selectedClass == '927' ? 'selected' : ''" class="cls-1" points="124 524.5 71.5 524.5 71.5 446 71.5 445.31 71.5 441.62 124 441.62 124 524.5"/>
  </g>
  <g id="_926" data-name="926">
    <rect :class="selectedClass == '926' ? 'selected' : ''" class="cls-1" x="124" y="441.62" width="51.69" height="82.88"/>
  </g>
  <g id="_925" data-name="925">
    <rect :class="selectedClass == '925' ? 'selected' : ''" class="cls-1" x="175.69" y="441.62" width="51.69" height="82.88"/>
  </g>
  <g id="_924" data-name="924">
    <rect :class="selectedClass == '924' ? 'selected' : ''" class="cls-1" x="227.38" y="441.62" width="51.16" height="82.88"/>
  </g>
  <g id="_923" data-name="923">
    <rect :class="selectedClass == '923' ? 'selected' : ''" class="cls-1" x="278.55" y="441.62" width="52.75" height="82.88"/>
  </g>
  <g id="_922" data-name="922">
    <rect :class="selectedClass == '922' ? 'selected' : ''" class="cls-1" x="331.3" y="441.62" width="54.33" height="82.88"/>
  </g>
  <g id="_921" data-name="921">
    <rect :class="selectedClass == '921' ? 'selected' : ''" class="cls-1" x="385.63" y="441.62" width="54.86" height="82.88"/>
  </g>
  <g id="_920" data-name="920">
    <rect :class="selectedClass == '920' ? 'selected' : ''" class="cls-1" x="440.48" y="441.62" width="53.27" height="82.88"/>
  </g>
  <g id="_919" data-name="919">
    <rect :class="selectedClass == '919' ? 'selected' : ''" class="cls-1" x="493.76" y="441.62" width="53.27" height="82.88"/>
  </g>
  <g id="_918" data-name="918">
    <rect :class="selectedClass == '918' ? 'selected' : ''" class="cls-1" x="547.03" y="441.62" width="55.38" height="82.88"/>
  </g>
  <g id="_917" data-name="917">
    <rect :class="selectedClass == '917' ? 'selected' : ''" class="cls-1" x="602.42" y="441.62" width="53.8" height="82.88"/>
  </g>
  <g id="_916" data-name="916">
    <rect :class="selectedClass == '916' ? 'selected' : ''" class="cls-1" x="656.22" y="441.62" width="54.86" height="82.88"/>
  </g>
  <g id="_915" data-name="915">
    <rect :class="selectedClass == '915' ? 'selected' : ''" class="cls-1" x="711.08" y="441.62" width="55.91" height="82.88"/>
  </g>
  <g id="_914" data-name="914">
    <rect :class="selectedClass == '914' ? 'selected' : ''" class="cls-1" x="766.99" y="441.62" width="143.47" height="82.88"/>
  </g>
  <g id="_913" data-name="913">
    <rect :class="selectedClass == '913' ? 'selected' : ''" class="cls-1" x="910.46" y="441.62" width="94.95" height="82.88"/>
  </g>
  <g id="_912" data-name="912">
    <rect :class="selectedClass == '912' ? 'selected' : ''" class="cls-1" x="1005.41" y="441.62" width="41.67" height="82.88"/>
  </g>
  <g id="_911" data-name="911">
    <rect :class="selectedClass == '911' ? 'selected' : ''" class="cls-1" x="1047.08" y="441.62" width="41.67" height="82.88"/>
  </g>
  <g id="_910" data-name="910">
    <rect :class="selectedClass == '910' ? 'selected' : ''" class="cls-1" x="1088.75" y="441.62" width="41.14" height="82.88"/>
  </g>
  <g id="_909" data-name="909">
    <rect :class="selectedClass == '909' ? 'selected' : ''" class="cls-1" x="1129.89" y="441.62" width="41.14" height="82.88"/>
  </g>
  <g id="_908" data-name="908">
    <rect :class="selectedClass == '908' ? 'selected' : ''" class="cls-1" x="1171.03" y="441.62" width="41.14" height="82.88"/>
  </g>
  <g id="_907" data-name="907">
    <rect :class="selectedClass == '907' ? 'selected' : ''" class="cls-1" x="1212.18" y="441.62" width="40.62" height="82.88"/>
  </g>
  <g id="_906" data-name="906">
    <rect :class="selectedClass == '906' ? 'selected' : ''" class="cls-1" x="1252.79" y="441.62" width="42.71" height="82.88"/>
  </g>
  <g id="_905" data-name="905">
    <rect :class="selectedClass == '905' ? 'selected' : ''" class="cls-1" x="1238.55" y="268.5" width="44.57" height="67"/>
  </g>
  <g id="_904" data-name="904">
    <rect :class="selectedClass == '904' ? 'selected' : ''" class="cls-1" x="1194.77" y="268.5" width="43.78" height="67"/>
  </g>
  <g id="_903" data-name="903">
    <rect :class="selectedClass == '903' ? 'selected' : ''" class="cls-1" x="1152.04" y="268.5" width="42.73" height="67"/>
  </g>
  <g id="_902" data-name="902">
    <rect :class="selectedClass == '902' ? 'selected' : ''" class="cls-1" x="1108.79" y="268.5" width="43.25" height="67"/>
  </g>
  <g id="_901" data-name="901">
    <rect :class="selectedClass == '901' ? 'selected' : ''" class="cls-1" x="1066.07" y="268.5" width="42.73" height="67"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <rect class="cls-1" x="1005.41" y="268.5" width="60.66" height="67"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-1" x="298.86" y="268.5" width="59.64" height="66.83"/>
  </g>
  <g id="_930" data-name="930">
    <rect :class="selectedClass == '930' ? 'selected' : ''" class="cls-1" x="227.38" y="227.5" width="71.47" height="107.83"/>
  </g>
  <g id="_929" data-name="929">
    <rect :class="selectedClass == '929' ? 'selected' : ''" class="cls-1" x="156.7" y="227.5" width="70.68" height="107.83"/>
  </g>
  <g id="_928" data-name="928">
    <polygon :class="selectedClass == '928' ? 'selected' : ''" class="cls-1" points="86.02 227.5 156.7 227.5 156.7 335.33 86.02 335.33 86.02 268.5 86.02 227.5"/>
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

      .selected {
        fill: red;
        fill-opacity: 0.3;
      }
</style>