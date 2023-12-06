<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("8");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1365.05 768">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="356.5 335.5 760.5 335.5 760.5 269.66 766.46 269.66 766.46 241.18 907.3 241.18 907.3 270.19 907.3 335.5"/>
    <line class="cls-1" x1="907.3" y1="270.5" x2="1003.3" y2="270.5"/>
    <polyline class="cls-1" points="70.5 446.36 46.5 446.36 46.5 270.5 83.38 270.5"/>
    <polyline class="cls-1" points="1278.5 286.01 1317.67 286.01 1317.67 441.09 1293.5 441.09"/>
    <text class="cls-3" transform="translate(47.14 288.63)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(936.89 309.46)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(1279.81 303.39)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(171.94 270.39)"><tspan class="cls-4"><tspan x="0" y="0">826</tspan></tspan><tspan class="cls-5"><tspan x="-35.62" y="25.2">계단강의실</tspan></tspan></text>
    <text class="cls-3" transform="translate(308.69 297.85)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(789.69 269.85)"><tspan x="0" y="0">엘레베이터</tspan></text>
    <text class="cls-3" transform="translate(1015.17 297.95)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-3" transform="translate(1069.3 309.95)"><tspan x="0" y="0">801</tspan></text>
    <text class="cls-3" transform="translate(1110.3 309.95)"><tspan x="0" y="0">802</tspan></text>
    <text class="cls-3" transform="translate(1164.3 309.95)"><tspan x="0" y="0">803</tspan></text>
    <text class="cls-3" transform="translate(1230.3 309.95)"><tspan x="0" y="0">805</tspan></text>
    <text class="cls-3" transform="translate(1254.3 488.95)"><tspan x="0" y="0">806</tspan></text>
    <text class="cls-3" transform="translate(1212.3 488.95)"><tspan x="0" y="0">807</tspan></text>
    <text class="cls-3" transform="translate(1171.3 488.95)"><tspan x="0" y="0">808</tspan></text>
    <text class="cls-3" transform="translate(1129.3 488.95)"><tspan x="0" y="0">809</tspan></text>
    <text class="cls-3" transform="translate(1089.3 488.95)"><tspan x="0" y="0">810</tspan></text>
    <text class="cls-3" transform="translate(1049.3 488.95)"><tspan x="0" y="0">811</tspan></text>
    <text class="cls-3" transform="translate(1007.3 488.95)"><tspan x="0" y="0">812</tspan></text>
    <text class="cls-3" transform="translate(938.3 488.95)"><tspan x="0" y="0">813</tspan></text>
    <text class="cls-3" transform="translate(819.3 488.95)"><tspan x="0" y="0">814</tspan></text>
    <text class="cls-3" transform="translate(679.3 488.95)"><tspan x="0" y="0">815</tspan></text>
    <text class="cls-3" transform="translate(576.29 489.7)"><tspan x="0" y="0">816</tspan></text>
    <text class="cls-3" transform="translate(509.29 489.7)"><tspan x="0" y="0">817</tspan></text>
    <text class="cls-3" transform="translate(441.29 489.7)"><tspan x="0" y="0">818</tspan></text>
    <text class="cls-3" transform="translate(374.29 489.7)"><tspan x="0" y="0">819</tspan></text>
    <text class="cls-3" transform="translate(310.29 489.7)"><tspan x="0" y="0">820</tspan></text>
    <text class="cls-3" transform="translate(251.29 489.7)"><tspan x="0" y="0">822</tspan></text>
    <text class="cls-3" transform="translate(194.29 489.7)"><tspan x="0" y="0">823</tspan></text>
    <text class="cls-3" transform="translate(139.29 489.7)"><tspan x="0" y="0">824</tspan></text>
    <text class="cls-3" transform="translate(83.29 489.7)"><tspan x="0" y="0">825</tspan></text>
  </g>
  <g id="_825" data-name="825">
    <polygon :class="selectedClass == '825' ? 'selected' : ''" class="cls-1" points="127.16 523.5 70.5 523.5 70.5 446.36 70.5 441.09 127.16 441.09 127.16 523.5"/>
  </g>
  <g id="_824" data-name="824">
    <rect :class="selectedClass == '824' ? 'selected' : ''" class="cls-1" x="127.16" y="441.09" width="56.97" height="82.41"/>
  </g>
  <g id="_823" data-name="823">
    <rect :class="selectedClass == '823' ? 'selected' : ''" class="cls-1" x="184.13" y="441.09" width="56.97" height="82.41"/>
  </g>
  <g id="_822" data-name="822">
    <rect :class="selectedClass == '822' ? 'selected' : ''" class="cls-1" x="241.1" y="441.09" width="55.91" height="82.41"/>
  </g>
  <g id="_820" data-name="820">
    <rect :class="selectedClass == '820' ? 'selected' : ''" class="cls-1" x="297.01" y="441.09" width="59.49" height="82.41"/>
  </g>
  <g id="_819" data-name="819">
    <rect :class="selectedClass == '819' ? 'selected' : ''" class="cls-1" x="356.5" y="441.09" width="67.63" height="82.41"/>
  </g>
  <g id="_818" data-name="818">
    <rect :class="selectedClass == '818' ? 'selected' : ''" class="cls-1" x="424.13" y="441.09" width="67.52" height="82.41"/>
  </g>
  <g id="_817" data-name="817">
    <rect :class="selectedClass == '817' ? 'selected' : ''" class="cls-1" x="491.65" y="441.09" width="67.52" height="82.41"/>
  </g>
  <g id="_816" data-name="816">
    <rect :class="selectedClass == '816' ? 'selected' : ''" class="cls-1" x="559.16" y="441.09" width="68.04" height="82.41"/>
  </g>
  <g id="_815" data-name="815">
    <rect :class="selectedClass == '815' ? 'selected' : ''" class="cls-1" x="627.21" y="441.09" width="136.62" height="82.41"/>
  </g>
  <g id="_814" data-name="814">
    <rect :class="selectedClass == '814' ? 'selected' : ''" class="cls-1" x="763.82" y="441.09" width="143.47" height="82.41"/>
  </g>
  <g id="_813" data-name="813">
    <rect :class="selectedClass == '813' ? 'selected' : ''" class="cls-1" x="907.3" y="441.09" width="95.47" height="82.41"/>
  </g>
  <g id="_812" data-name="812">
    <rect :class="selectedClass == '812' ? 'selected' : ''" class="cls-1" x="1002.77" y="441.09" width="41.67" height="82.41"/>
  </g>
  <g id="_811" data-name="811">
    <rect :class="selectedClass == '811' ? 'selected' : ''" class="cls-1" x="1044.44" y="441.09" width="41.67" height="82.41"/>
  </g>
  <g id="_810" data-name="810">
    <rect :class="selectedClass == '810' ? 'selected' : ''" class="cls-1" x="1086.11" y="441.09" width="40.62" height="82.41"/>
  </g>
  <g id="_809" data-name="809">
    <rect :class="selectedClass == '809' ? 'selected' : ''" class="cls-1" x="1126.73" y="441.09" width="42.2" height="82.41"/>
  </g>
  <g id="_808" data-name="808">
    <rect :class="selectedClass == '808' ? 'selected' : ''" class="cls-1" x="1168.92" y="441.09" width="40.09" height="82.41"/>
  </g>
  <g id="_807" data-name="807">
    <rect :class="selectedClass == '807' ? 'selected' : ''" class="cls-1" x="1209.01" y="441.09" width="41.67" height="82.41"/>
  </g>
  <g id="_806" data-name="806">
    <rect :class="selectedClass == '806' ? 'selected' : ''" class="cls-1" x="1250.68" y="441.09" width="42.82" height="82.41"/>
  </g>
  <g id="_805" data-name="805">
    <rect :class="selectedClass == '805' ? 'selected' : ''" class="cls-1" x="1215.34" y="270.5" width="63.16" height="65"/>
  </g>
  <g id="_803" data-name="803">
    <rect :class="selectedClass == '803' ? 'selected' : ''" class="cls-1" x="1149.41" y="270.5" width="65.93" height="65"/>
  </g>
  <g id="_802" data-name="802">
    <rect :class="selectedClass == '802' ? 'selected' : ''" class="cls-1" x="1106.15" y="270.5" width="43.25" height="65"/>
  </g>
  <g id="_801" data-name="801">
    <rect :class="selectedClass == '801' ? 'selected' : ''" class="cls-1" x="1062.9" y="270.5" width="43.25" height="65"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <rect class="cls-1" x="1003.3" y="270.5" width="59.6" height="65"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <rect class="cls-1" x="297.01" y="269.5" width="59.49" height="65.57"/>
  </g>
  <g id="_826" data-name="826">
    <polygon :class="selectedClass == '826' ? 'selected' : ''" class="cls-1" points="297.01 228.52 297.01 335.07 83.91 335.07 83.38 270.5 83.38 228.52 297.01 228.52"/>
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