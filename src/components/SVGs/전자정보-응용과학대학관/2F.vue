<script>
    export default {
    name: "FloorMap"
    }
</script>

<script setup>
    import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
    import bldgList from '@/assets/bldgList.json';

    const curBldg = ref("전자정보-응용과학대학관");
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1033.06 768.5">
  <g id="_레이어_2" data-name="레이어 2">
    <polyline class="cls-1" points="330 114 14.5 114 14.5 279.5"/>
    <line class="cls-1" x1="915" y1="114" x2="781" y2="114"/>
    <line class="cls-1" x1="915" y1="164.5" x2="915" y2="114"/>
    <line class="cls-1" x1="915" y1="309.5" x2="915" y2="164.5"/>
    <line class="cls-1" x1="915" y1="574.5" x2="915" y2="554.5"/>
    <line class="cls-1" x1="915" y1="640.5" x2="915" y2="574.5"/>
    <line class="cls-1" x1="14.5" y1="654" x2="14.5" y2="684.5"/>
    <polyline class="cls-1" points="870.5 309.5 870.5 114 870.5 82.5 915 82.5 915 .5 781 .5 781 57.25 781 114"/>
    <line class="cls-1" x1="915" y1="57.25" x2="781" y2="57.25"/>
    <line class="cls-1" x1="781" y1="164.5" x2="915" y2="164.5"/>
    <polyline class="cls-1" points="74 279.5 74 164.5 330 164.5"/>
    <line class="cls-1" x1="781" y1="314.5" x2="781" y2="279.5"/>
    <line class="cls-1" x1="781" y1="574.5" x2="781" y2="518"/>
    <line class="cls-1" x1="434" y1="640.5" x2="546" y2="640.5"/>
    <line class="cls-1" x1="137" y1="640.5" x2="161.74" y2="640.5"/>
    <line class="cls-1" x1="137" y1="574.5" x2="137" y2="640.5"/>
    <line class="cls-1" x1="137" y1="531.5" x2="137" y2="574.5"/>
    <line class="cls-1" x1="137" y1="487.5" x2="137" y2="531.5"/>
    <line class="cls-1" x1="137" y1="226.5" x2="137" y2="279.5"/>
    <line class="cls-1" x1="198" y1="226.5" x2="137" y2="226.5"/>
    <line class="cls-1" x1="302" y1="226.5" x2="198" y2="226.5"/>
    <line class="cls-1" x1="330" y1="226.5" x2="302" y2="226.5"/>
    <line class="cls-1" x1="711" y1="226.5" x2="639" y2="226.5"/>
    <line class="cls-1" x1="639" y1="279.5" x2="711" y2="279.5"/>
    <line class="cls-1" x1="302" y1="279.5" x2="330" y2="279.5"/>
    <line class="cls-1" x1="198" y1="279.5" x2="302" y2="279.5"/>
    <line class="cls-1" x1="74" y1="279.5" x2="137" y2="279.5"/>
    <line class="cls-1" x1="733" y1="314.5" x2="781" y2="314.5"/>
    <line class="cls-1" x1="733" y1="574.5" x2="733" y2="518"/>
    <line class="cls-1" x1="434" y1="574.5" x2="546" y2="574.5"/>
    <line class="cls-1" x1="198" y1="531.5" x2="198" y2="574.5"/>
    <line class="cls-1" x1="198" y1="487.5" x2="198" y2="531.5"/>
    <line class="cls-1" x1="198" y1="226.5" x2="198" y2="279.5"/>
    <line class="cls-1" x1="138" y1="574.5" x2="163" y2="574.5"/>
    <line class="cls-1" x1="138" y1="531.5" x2="198" y2="531.5"/>
    <line class="cls-1" x1="302" y1="226.5" x2="302" y2="279.5"/>
    <line class="cls-1" x1="885" y1="574.5" x2="915" y2="574.5"/>
    <line class="cls-1" x1="885" y1="554.5" x2="885" y2="574.5"/>
    <line class="cls-1" x1="870.5" y1="574.5" x2="885" y2="574.5"/>
    <text class="cls-2" transform="translate(359.12 145.5)"><tspan x="0" y="0">201</tspan></text>
    <text class="cls-2" transform="translate(516.12 145.5)"><tspan x="0" y="0">203</tspan></text>
    <text class="cls-2" transform="translate(647 145.5)"><tspan x="0" y="0">203-2</tspan></text>
    <text class="cls-2" transform="translate(716 145.5)"><tspan x="0" y="0">203-3</tspan></text>
    <text class="cls-2" transform="translate(831.12 33.5)"><tspan x="0" y="0">205</tspan></text>
    <text class="cls-2" transform="translate(346 261.5)"><tspan x="0" y="0">202-1</tspan></text>
    <text class="cls-2" transform="translate(517.12 261.5)"><tspan x="0" y="0">204</tspan></text>
    <text class="cls-2" transform="translate(743.12 377.5)"><tspan x="0" y="0">206</tspan></text>
    <text class="cls-2" transform="translate(876.12 364.5)"><tspan x="0" y="0">207</tspan></text>
    <text class="cls-2" transform="translate(876.12 470.5)"><tspan x="0" y="0">209</tspan></text>
    <text class="cls-2" transform="translate(740.12 475.5)"><tspan x="0" y="0">208</tspan></text>
    <text class="cls-2" transform="translate(710.12 613.5)"><tspan x="0" y="0">218</tspan></text>
    <text class="cls-2" transform="translate(589.12 613.5)"><tspan x="0" y="0">220</tspan></text>
    <text class="cls-2" transform="translate(344.12 613.5)"><tspan x="0" y="0">226</tspan></text>
    <text class="cls-2" transform="translate(151.12 298.5)"><tspan x="0" y="0">250</tspan></text>
    <text class="cls-2" transform="translate(150.12 328.5)"><tspan x="0" y="0">248</tspan></text>
    <text class="cls-2" transform="translate(151.12 364.5)"><tspan x="0" y="0">246</tspan></text>
    <text class="cls-2" transform="translate(151.12 400.5)"><tspan x="0" y="0">244</tspan></text>
    <text class="cls-2" transform="translate(150.12 435.5)"><tspan x="0" y="0">242</tspan></text>
    <text class="cls-2" transform="translate(151.12 470.5)"><tspan x="0" y="0">240</tspan></text>
    <text class="cls-6" transform="translate(16 400.5)"><tspan x="0" y="0">동아리방</tspan></text>
    <text class="cls-2" transform="translate(27.12 515.5)"><tspan x="0" y="0">239</tspan></text>
    <text class="cls-2" transform="translate(27.12 559.5)"><tspan x="0" y="0">237</tspan></text>
    <text class="cls-2" transform="translate(27.12 596.5)"><tspan x="0" y="0">235</tspan></text>
    <text class="cls-2" transform="translate(27.12 635.5)"><tspan x="0" y="0">233</tspan></text>
    <text class="cls-2" transform="translate(44 720.5)"><tspan x="0" y="0">229-1</tspan></text>
    <text class="cls-2" transform="translate(190.12 720.5)"><tspan x="0" y="0">229</tspan></text>
    <text class="cls-2" transform="translate(313.12 720.5)"><tspan x="0" y="0">227</tspan></text>
    <text class="cls-2" transform="translate(413.12 720.5)"><tspan x="0" y="0">225</tspan></text>
    <text class="cls-2" transform="translate(510.12 720.5)"><tspan x="0" y="0">223</tspan></text>
    <text class="cls-2" transform="translate(610.12 720.5)"><tspan x="0" y="0">221</tspan></text>
    <text class="cls-2" transform="translate(705.12 720.5)"><tspan x="0" y="0">219</tspan></text>
    <text class="cls-2" transform="translate(786.12 720.5)"><tspan x="0" y="0">217</tspan></text>
    <text class="cls-2" transform="translate(868.12 720.5)"><tspan x="0" y="0">215</tspan></text>
    <text class="cls-2" transform="translate(876.12 669.5)"><tspan x="0" y="0">213</tspan></text>
    <text class="cls-2" transform="translate(230.77 603.33)"><tspan x="0" y="0">여자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-2" transform="translate(173.77 603.33)"><tspan x="0" y="0">남자</tspan><tspan x="-9" y="21.6">화장실</tspan></text>
    <text class="cls-2" transform="translate(149.77 515.35)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(738.77 551.35)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(471.77 613.35)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-2" transform="translate(658.77 261.35)"><tspan x="0" y="0">계단</tspan></text>
    <text class="cls-3" transform="translate(752.77 250.35)"><tspan x="0" y="0">남자</tspan><tspan x="-5.5" y="13.2">화장실</tspan></text>
    <text class="cls-3" transform="translate(716.77 250.35)"><tspan x="0" y="0">여자</tspan><tspan x="-5.5" y="13.2">화장실</tspan></text>
    <text class="cls-5" transform="translate(307.77 249.35)"><tspan x="0" y="0">엘레</tspan><tspan x="-4.5" y="10.8">베이터</tspan></text>
    <text class="cls-5" transform="translate(890.77 563.35)"><tspan x="0" y="0">엘레</tspan><tspan x="-4.5" y="10.8">베이터</tspan></text>
    <text class="cls-4" transform="translate(877.1 532.35)"><tspan x="0" y="0">여자 화장실</tspan></text>
    <text class="cls-4" transform="translate(877.1 548.35)"><tspan x="0" y="0">남자 화장실</tspan></text>
    <text class="cls-2" transform="translate(229.77 261.35)"><tspan x="0" y="0">계단</tspan></text>
  </g>
  <g id="_남자화장실2" data-name="남자화장실2">
    <polygon class="cls-1" points="915 538.5 915 554.5 885 554.5 877 554.5 877 538.5 915 538.5"/>
  </g>
  <g id="_여자화장실2" data-name="여자화장실2">
    <rect class="cls-1" x="877" y="522" width="38" height="16.5"/>
  </g>
  <g id="_209" data-name="209">
    <rect :class="selectedClass == '209' ? 'selected' : ''" class="cls-1" x="870.5" y="405.5" width="44.5" height="116.5"/>
  </g>
  <g id="_207" data-name="207">
    <rect :class="selectedClass == '207' ? 'selected' : ''" class="cls-1" x="870.5" y="309.5" width="44.5" height="96"/>
  </g>
  <g id="_203-3" data-name="203-3">
    <rect :class="selectedClass == '203-3' ? 'selected' : ''" class="cls-1" x="711" y="114" width="70" height="50.5"/>
  </g>
  <g id="_203-2" data-name="203-2">
    <rect :class="selectedClass == '203-2' ? 'selected' : ''" class="cls-1" x="639" y="114" width="72" height="50.5"/>
  </g>
  <g id="_203" data-name="203">
    <rect :class="selectedClass == '203' ? 'selected' : ''" class="cls-1" x="417" y="114" width="222" height="50.5"/>
  </g>
  <g id="_201" data-name="201">
    <rect :class="selectedClass == '201' ? 'selected' : ''" class="cls-1" x="330" y="114" width="87" height="50.5"/>
  </g>
  <g id="_남자화장실3" data-name="남자화장실3">
    <rect class="cls-1" x="746" y="226.5" width="35" height="53"/>
  </g>
  <g id="_여자화장실3" data-name="여자화장실3">
    <rect class="cls-1" x="711" y="226.5" width="35" height="53"/>
  </g>
  <g id="_204" data-name="204">
    <rect :class="selectedClass == '204' ? 'selected' : ''" class="cls-1" x="417" y="226.5" width="222" height="53"/>
  </g>
  <g id="_202-1" data-name="202-1">
    <rect :class="selectedClass == '202-1' ? 'selected' : ''" class="cls-1" x="330" y="226.5" width="87" height="53"/>
  </g>
  <g id="_206" data-name="206">
    <polyline :class="selectedClass == '206' ? 'selected' : ''" class="cls-1" points="733 314.5 733 420.5 781 420.5 781 314.5"/>
  </g>
  <g id="_208" data-name="208">
    <rect :class="selectedClass == '208' ? 'selected' : ''" class="cls-1" x="733" y="420.5" width="48" height="97.5"/>
  </g>
  <g id="_218" data-name="218">
    <polygon :class="selectedClass == '218' ? 'selected' : ''" class="cls-1" points="669 640.5 781 640.5 781 574.5 733 574.5 669 574.5 669 640.5"/>
  </g>
  <g id="_220" data-name="220">
    <rect :class="selectedClass == '220' ? 'selected' : ''" class="cls-1" x="546" y="574.5" width="123" height="66"/>
  </g>
  <g id="_226" data-name="226">
    <rect :class="selectedClass == '226' ? 'selected' : ''" class="cls-1" x="279" y="574.5" width="155" height="66"/>
  </g>
  <g id="_여자화장실" data-name="여자화장실">
    <rect class="cls-1" x="219" y="574.5" width="60" height="66"/>
  </g>
  <g id="_남자화장실" data-name="남자화장실">
    <polygon class="cls-1" points="219 640.5 219 574.5 198 574.5 163 574.5 161.74 574.5 161.74 640.5 219 640.5"/>
  </g>
  <g id="_240" data-name="240">
    <polygon :class="selectedClass == '240' ? 'selected' : ''" class="cls-1" points="198 447.5 198 487.5 138 487.5 137 487.5 137 447.5 198 447.5"/>
  </g>
  <g id="_242" data-name="242">
    <polyline :class="selectedClass == '242' ? 'selected' : ''" class="cls-1" points="198 447.5 137 447.5 137 412.5 198 412.5 198 447.5"/>
  </g>
  <g id="_244" data-name="244">
    <rect :class="selectedClass == '244' ? 'selected' : ''" class="cls-1" x="137" y="377.5" width="61" height="35"/>
  </g>
  <g id="_246" data-name="246">
    <polyline :class="selectedClass == '246' ? 'selected' : ''" class="cls-1" points="137 377.5 137 337.5 198 337.5 198 377.5 137 377.5"/>
  </g>
  <g id="_248" data-name="248">
    <rect :class="selectedClass == '248' ? 'selected' : ''" class="cls-1" x="137" y="304.5" width="61" height="33"/>
  </g>
  <g id="_250" data-name="250">
    <rect :class="selectedClass == '250' ? 'selected' : ''" class="cls-1" x="137" y="279.5" width="61" height="25"/>
  </g>
  <g id="_215" data-name="215">
    <polygon :class="selectedClass == '215' ? 'selected' : ''" class="cls-1" points="915 684.5 915 744.5 844 744.5 844 684.5 870.5 684.5 915 684.5"/>
  </g>
  <g id="_213" data-name="213">
    <rect :class="selectedClass == '213' ? 'selected' : ''" class="cls-1" x="870.5" y="640.5" width="44.5" height="44"/>
  </g>
  <g id="_217" data-name="217">
    <rect :class="selectedClass == '217' ? 'selected' : ''" class="cls-1" x="762" y="684.5" width="82" height="60"/>
  </g>
  <g id="_219" data-name="219">
    <rect :class="selectedClass == '219' ? 'selected' : ''" class="cls-1" x="677" y="684.5" width="85" height="60"/>
  </g>
  <g id="_221" data-name="221">
    <rect :class="selectedClass == '221' ? 'selected' : ''" class="cls-1" x="575" y="684.5" width="102" height="60"/>
  </g>
  <g id="_223" data-name="223">
    <rect :class="selectedClass == '223' ? 'selected' : ''" class="cls-1" x="477" y="684.5" width="98" height="60"/>
  </g>
  <g id="_225" data-name="225">
    <rect :class="selectedClass == '225' ? 'selected' : ''" class="cls-1" x="376" y="684.5" width="101" height="60"/>
  </g>
  <g id="_227" data-name="227">
    <rect :class="selectedClass == '227' ? 'selected' : ''" class="cls-1" x="275" y="684.5" width="101" height="60"/>
  </g>
  <g id="_229" data-name="229">
    <polygon :class="selectedClass == '229' ? 'selected' : ''" class="cls-1" points="275 744.5 137.75 744.5 138 684.5 275 684.5 275 744.5"/>
  </g>
  <g id="_229-1" data-name="229-1">
    <polyline :class="selectedClass == '229-1' ? 'selected' : ''" class="cls-1" points="137.75 745.25 138 684.5 14.5 684.5 14.5 744.5 137.75 744.5"/>
  </g>
  <g id="_233" data-name="233">
    <rect :class="selectedClass == '233' ? 'selected' : ''" class="cls-1" x="14.5" y="606.5" width="59.5" height="47.5"/>
  </g>
  <g id="_235" data-name="235">
    <rect :class="selectedClass == '235' ? 'selected' : ''" class="cls-1" x="14.5" y="574.5" width="59.5" height="32"/>
  </g>
  <g id="_237" data-name="237">
    <rect :class="selectedClass == '237' ? 'selected' : ''" class="cls-1" x="14.5" y="531.5" width="59.5" height="43"/>
  </g>
  <g id="_239" data-name="239">
    <rect :class="selectedClass == '239' ? 'selected' : ''" class="cls-1" x="14.5" y="487.5" width="59.5" height="44"/>
  </g>
  <g id="_동아리방" data-name="동아리방">
    <rect :class="selectedClass == '동아리방' ? 'selected' : ''" class="cls-1" x="14.5" y="279.5" width="59.5" height="208"/>
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
  font-size: 18px;
}

.cls-3 {
  font-size: 11px;
}

.cls-4 {
  font-size: 7px;
}

.cls-5 {
  font-size: 9px;
}

.cls-6 {
  font-size: 14px;
}

      .selected {
        fill: red;
        fill-opacity: 0.3;
      }
</style>