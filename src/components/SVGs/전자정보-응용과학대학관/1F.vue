<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("전자정보-응용과학대학관");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1087.67 768">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="5 192.12 5 4.5 382.5 4.5 382.5 192.5 212.2 192.5"/>
    <line class="cls-1" x1="5" y1="663.29" x2="5" y2="632.43"/>
    <line class="cls-1" x1="614.53" y1="735" x2="488.73" y2="735"/>
    <line class="cls-1" x1="1047.5" y1="516.12" x2="1047.5" y2="618.19"/>
    <line class="cls-1" x1="992.5" y1="63.5" x2="992.5" y2="232.5"/>
    <line class="cls-1" x1="891.05" y1="63.5" x2="992.5" y2="63.5"/>
    <line class="cls-1" x1="143.36" y1="192.12" x2="68.59" y2="192.12"/>
    <line class="cls-1" x1="212.2" y1="4.5" x2="212.2" y2="192.12"/>
    <line class="cls-1" x1="212.2" y1="493.57" x2="212.2" y2="433.04"/>
    <line class="cls-1" x1="212.2" y1="541.5" x2="212.2" y2="493.57"/>
    <line class="cls-1" x1="614.53" y1="541.5" x2="488.73" y2="541.5"/>
    <line class="cls-1" x1="488.73" y1="609.88" x2="614.53" y2="609.88"/>
    <line class="cls-1" x1="143.36" y1="609.88" x2="177.78" y2="609.88"/>
    <line class="cls-1" x1="143.36" y1="542.23" x2="143.36" y2="609.88"/>
    <line class="cls-1" x1="143.36" y1="493.57" x2="143.36" y2="542.23"/>
    <line class="cls-1" x1="143.36" y1="433.04" x2="143.36" y2="493.57"/>
    <line class="cls-1" x1="143.36" y1="493.57" x2="212.2" y2="493.57"/>
    <line class="cls-1" x1="143.36" y1="542.23" x2="177.78" y2="542.23"/>
    <line class="cls-1" x1="987.19" y1="542.23" x2="1047.5" y2="542.23"/>
    <line class="cls-1" x1="891.05" y1="192.12" x2="891.05" y2="232.5"/>
    <line class="cls-1" x1="743.89" y1="192.12" x2="800.86" y2="192.12"/>
    <line class="cls-1" x1="575.5" y1="63.5" x2="575.5" y2="136.34"/>
    <line class="cls-1" x1="837.65" y1="506.26" x2="837.65" y2="471.02"/>
    <line class="cls-1" x1="837.65" y1="541.5" x2="837.65" y2="506.26"/>
    <line class="cls-1" x1="891.05" y1="506.26" x2="837.65" y2="506.26"/>
    <line class="cls-1" x1="891.05" y1="471.02" x2="891.05" y2="506.26"/>
    <line class="cls-1" x1="743.89" y1="136.34" x2="800.86" y2="136.34"/>
    <path class="cls-1" d="m575.5,192.12h-76.09v40.38c143.09-11.01,221.64,33.83,216,151.5h122.24"/>
    <circle class="cls-1" cx="568" cy="350" r="68.5"/>
    <text class="cls-3" transform="translate(160.8 236.58)"><tspan x="0" y="0">140</tspan></text>
    <text class="cls-3" transform="translate(160.8 298.58)"><tspan x="0" y="0">138</tspan></text>
    <text class="cls-3" transform="translate(19.8 256.58)"><tspan x="0" y="0">139</tspan></text>
    <text class="cls-3" transform="translate(160.8 383.58)"><tspan x="0" y="0">136</tspan></text>
    <text class="cls-3" transform="translate(159.67 470.58)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(534.67 755.58)"><tspan x="0" y="0">입구</tspan></text>
    <text class="cls-3" transform="translate(536.67 105.58)"><tspan x="0" y="0">입구</tspan></text>
    <text class="cls-3" transform="translate(842.67 529.58)"><tspan x="0" y="0">입구</tspan></text>
    <text class="cls-3" transform="translate(1051.67 583.58)"><tspan x="0" y="0">입구</tspan></text>
    <text class="cls-3" transform="translate(534.67 527.58)"><tspan x="0" y="0">입구</tspan></text>
    <text class="cls-3" transform="translate(537.67 583.58)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-6" transform="translate(181.67 570.58)"><tspan x="0" y="0">여자</tspan><tspan x="-6" y="14.4">화장실</tspan></text>
    <text class="cls-6" transform="translate(809.67 161.58)"><tspan x="0" y="0">여자</tspan><tspan x="-6" y="14.4">화장실</tspan></text>
    <text class="cls-6" transform="translate(217.67 570.58)"><tspan x="0" y="0">남자</tspan><tspan x="-6" y="14.4">화장실</tspan></text>
    <text class="cls-6" transform="translate(856.67 161.58)"><tspan x="0" y="0">남자</tspan><tspan x="-6" y="14.4">화장실</tspan></text>
    <text class="cls-5" transform="translate(1003.17 490.58)"><tspan x="0" y="0">남자화장실</tspan></text>
    <text class="cls-5" transform="translate(1003.17 510.58)"><tspan x="0" y="0">여자화장실</tspan></text>
    <text class="cls-5" transform="translate(1020.67 527.58)"><tspan x="0" y="0">엘레</tspan><tspan x="-4.5" y="10.8">베이터</tspan></text>
    <text class="cls-3" transform="translate(846.67 493.58)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(753.67 171.58)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(758.67 349.58)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(19.8 451.58)"><tspan x="0" y="0">135</tspan></text>
    <text class="cls-3" transform="translate(19.8 523.58)"><tspan x="0" y="0">133</tspan></text>
    <text class="cls-3" transform="translate(19.8 600.58)"><tspan x="0" y="0">131</tspan></text>
    <text class="cls-3" transform="translate(34.8 708.58)"><tspan x="0" y="0">129</tspan></text>
    <text class="cls-3" transform="translate(153.8 708.58)"><tspan x="0" y="0">127</tspan></text>
    <text class="cls-3" transform="translate(287.8 708.58)"><tspan x="0" y="0">125</tspan></text>
    <text class="cls-3" transform="translate(413.8 708.58)"><tspan x="0" y="0">123</tspan></text>
    <text class="cls-3" transform="translate(624.8 708.58)"><tspan x="0" y="0">121</tspan></text>
    <text class="cls-3" transform="translate(702.8 708.58)"><tspan x="0" y="0">119</tspan></text>
    <text class="cls-3" transform="translate(806.8 708.58)"><tspan x="0" y="0">117</tspan></text>
    <text class="cls-3" transform="translate(912.8 708.58)"><tspan x="0" y="0">115</tspan></text>
    <text class="cls-3" transform="translate(1000.8 686.58)"><tspan x="0" y="0">113</tspan></text>
    <text class="cls-3" transform="translate(1002.8 462.58)"><tspan x="0" y="0">109</tspan></text>
    <text class="cls-4" transform="translate(991.34 400.58)"><tspan x="0" y="0">107-2</tspan></text>
    <text class="cls-4" transform="translate(991.34 334.58)"><tspan x="0" y="0">107-1</tspan></text>
    <text class="cls-3" transform="translate(1002.8 267.58)"><tspan x="0" y="0">105</tspan></text>
    <rect class="cls-1" x="5" y="298.93" width="63.59" height="113.34"/>
    <text class="cls-3" transform="translate(847.8 298.58)"><tspan x="0" y="0">104</tspan></text>
    <text class="cls-2" transform="translate(849.67 387.58)"><tspan x="0" y="0">106</tspan><tspan x="-11.66" y="19.2">106-1</tspan><tspan x="-11.66" y="38.4">106-4</tspan></text>
    <text class="cls-3" transform="translate(843.68 462.58)"><tspan x="0" y="0">copy</tspan></text>
    <text class="cls-3" transform="translate(838.8 583.58)"><tspan x="0" y="0">114</tspan></text>
    <text class="cls-3" transform="translate(774.8 583.58)"><tspan x="0" y="0">116</tspan></text>
    <text class="cls-3" transform="translate(711.8 583.58)"><tspan x="0" y="0">118</tspan></text>
    <text class="cls-3" transform="translate(639.8 583.58)"><tspan x="0" y="0">120</tspan></text>
    <text class="cls-3" transform="translate(409.8 583.58)"><tspan x="0" y="0">122</tspan></text>
    <text class="cls-3" transform="translate(273.67 583.58)"><tspan x="0" y="0">122-1</tspan></text>
    <text class="cls-3" transform="translate(639.8 171.58)"><tspan x="0" y="0">102</tspan></text>
    <text class="cls-3" transform="translate(639.8 39.58)"><tspan x="0" y="0">101</tspan></text>
    <text class="cls-3" transform="translate(806.8 39.58)"><tspan x="0" y="0">102</tspan></text>
  </g>
  <g id="_102" data-name="102">
    <polygon :class="selectedClass == '102' ? 'selected' : ''" class="cls-1" points="743.89 63.5 891.05 63.5 891 4.5 744 4.5 743.89 63.5"/>
  </g>
  <g id="_101" data-name="101">
    <polyline :class="selectedClass == '101' ? 'selected' : ''" class="cls-1" points="743.89 4.5 743.89 63.5 575.5 63.5 575.5 4.5 744 4.5"/>
  </g>
  <g id="_102-2" data-name="102">
    <rect :class="selectedClass == '102-2' ? 'selected' : ''" class="cls-1" x="575.5" y="136.34" width="168.39" height="55.78"/>
  </g>
  <g id="_여자화장실3" data-name="여자화장실3">
    <polygon class="cls-1" points="843.58 192.12 800.86 192.12 800.86 136.34 843.5 136.34 843.58 192.12"/>
  </g>
  <g id="_남자화장실3" data-name="남자화장실3">
    <polyline class="cls-1" points="843.58 136.34 843.58 192.12 891.05 192.12 891.05 136.34 843.5 136.34"/>
  </g>
  <g id="_105" data-name="105">
    <rect :class="selectedClass == '105' ? 'selected' : ''" class="cls-1" x="992.5" y="232.5" width="55" height="60.5"/>
  </g>
  <g id="_107-1" data-name="107-1">
    <rect :class="selectedClass == '107-1' ? 'selected' : ''" class="cls-1" x="992.5" y="293" width="55" height="67.65"/>
  </g>
  <g id="_107-2" data-name="107-2">
    <rect :class="selectedClass == '107-2' ? 'selected' : ''" class="cls-1" x="992.5" y="360.65" width="55" height="72.4"/>
  </g>
  <g id="_109" data-name="109">
    <polygon :class="selectedClass == '109' ? 'selected' : ''" class="cls-1" points="1047.5 479.33 1047.5 433.04 992.5 433.04 992.5 479.33 1003.8 479.33 1047.5 479.33"/>
  </g>
  <g id="_남자화장실2" data-name="남자화장실2">
    <rect class="cls-1" x="1003.8" y="479.33" width="43.7" height="18.4"/>
  </g>
  <g id="_여자화장실2" data-name="여자화장실2">
    <rect class="cls-1" x="1003.8" y="497.73" width="43.7" height="18.4"/>
  </g>
  <g id="_113" data-name="113">
    <polygon :class="selectedClass == '113' ? 'selected' : ''" class="cls-1" points="987.19 663.29 987.19 618.19 1047.5 618.19 1047.5 735 987.19 735 987.19 663.29"/>
  </g>
  <g id="_115" data-name="115">
    <rect :class="selectedClass == '115' ? 'selected' : ''" class="cls-1" x="871.11" y="663.29" width="116.08" height="71.71"/>
  </g>
  <g id="_117" data-name="117">
    <rect :class="selectedClass == '117' ? 'selected' : ''" class="cls-1" x="771.58" y="663.29" width="99.52" height="71.71"/>
  </g>
  <g id="_119" data-name="119">
    <rect :class="selectedClass == '119' ? 'selected' : ''" class="cls-1" x="671.06" y="663.29" width="100.52" height="71.71"/>
  </g>
  <g id="_121" data-name="121">
    <rect :class="selectedClass == '121' ? 'selected' : ''" class="cls-1" x="614.53" y="663.29" width="56.53" height="71.71"/>
  </g>
  <g id="_123" data-name="123">
    <rect :class="selectedClass == '123' ? 'selected' : ''" class="cls-1" x="374.79" y="663.29" width="113.93" height="71.71"/>
  </g>
  <g id="_125" data-name="125">
    <rect :class="selectedClass == '125' ? 'selected' : ''" class="cls-1" x="237.12" y="663.29" width="137.67" height="71.71"/>
  </g>
  <g id="_127" data-name="127">
    <rect :class="selectedClass == '127' ? 'selected' : ''" class="cls-1" x="101.82" y="663.29" width="135.3" height="71.71"/>
  </g>
  <g id="_129" data-name="129">
    <rect :class="selectedClass == '129' ? 'selected' : ''" class="cls-1" x="5" y="663.29" width="96.82" height="71.71"/>
  </g>
  <g id="_104" data-name="104">
    <rect :class="selectedClass == '104' ? 'selected' : ''" class="cls-1" x="837.65" y="232.5" width="53.41" height="113.91"/>
  </g>
  <g id="_106" data-name="106">
    <rect :class="selectedClass == '106' ? 'selected' : ''" class="cls-1" x="837.65" y="346.41" width="53.41" height="94.95"/>
  </g>
  <g id="_제본실" data-name="제본실">
    <rect class="cls-1" x="837.65" y="441.35" width="53.41" height="29.67"/>
  </g>
  <g id="_114" data-name="114">
    <rect :class="selectedClass == '114' ? 'selected' : ''" class="cls-1" x="823.41" y="541.5" width="67.65" height="68.38"/>
  </g>
  <g id="_116" data-name="116">
    <rect :class="selectedClass == '116' ? 'selected' : ''" class="cls-1" x="760.51" y="541.5" width="62.9" height="68.38"/>
  </g>
  <g id="_118" data-name="118">
    <polygon :class="selectedClass == '118' ? 'selected' : ''" class="cls-1" points="699.98 609.88 760.51 609.88 760.51 542.23 760.51 541.5 699.98 541.5 699.98 609.88"/>
  </g>
  <g id="_120" data-name="120">
    <polyline :class="selectedClass == '120' ? 'selected' : ''" class="cls-1" points="699.98 542.23 699.98 609.88 614.53 609.88 614.53 541.5 699.98 541.5"/>
  </g>
  <g id="_122" data-name="122">
    <polygon :class="selectedClass == '122' ? 'selected' : ''" class="cls-1" points="367.67 609.88 488.73 609.88 488.73 542.23 488.73 541.5 367.67 541.5 367.67 609.88"/>
  </g>
  <g id="_122-1" data-name="122-1">
    <polygon :class="selectedClass == '122-1' ? 'selected' : ''" class="cls-1" points="247.8 609.88 367.67 609.88 367.67 542.23 367.67 541.5 247.8 541.5 247.8 609.88"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <polygon class="cls-1" points="212.2 609.88 247.8 609.88 247.8 542.23 247.8 541.5 212.2 541.5 212.2 609.88"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <rect class="cls-1" x="177.78" y="542.23" width="34.42" height="67.65"/>
  </g>
  <g id="_136" data-name="136">
    <rect :class="selectedClass == '136' ? 'selected' : ''" class="cls-1" x="143.36" y="320.3" width="68.84" height="112.75"/>
  </g>
  <g id="_138" data-name="138">
    <rect :class="selectedClass == '138' ? 'selected' : ''" class="cls-1" x="143.36" y="263.33" width="68.84" height="56.97"/>
  </g>
  <g id="_140" data-name="140">
    <rect :class="selectedClass == '140' ? 'selected' : ''" class="cls-1" x="143.36" y="192.12" width="68.84" height="71.21"/>
  </g>
  <g id="_131" data-name="131">
    <rect :class="selectedClass == '131' ? 'selected' : ''" class="cls-1" x="5" y="557.66" width="63.59" height="74.77"/>
  </g>
  <g id="_133" data-name="133">
    <rect :class="selectedClass == '133' ? 'selected' : ''" class="cls-1" x="5" y="479.33" width="63.59" height="78.33"/>
  </g>
  <g id="_135" data-name="135">
    <rect :class="selectedClass == '135' ? 'selected' : ''" class="cls-1" x="5" y="412.27" width="63.59" height="67.05"/>
  </g>
  <g id="_139" data-name="139">
    <rect :class="selectedClass == '139' ? 'selected' : ''" class="cls-1" x="5" y="192.12" width="63.59" height="106.81"/>
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

      .cls-2 {
        font-size: 16px;
      }

      .cls-3 {
        font-size: 18px;
      }

      .cls-4 {
        font-size: 17px;
      }

      .cls-5 {
        font-size: 9px;
      }

      .cls-6 {
        font-size: 12px;
      }

      .selected {
        fill: red;
        fill-opacity: 0.3;
      }
</style>