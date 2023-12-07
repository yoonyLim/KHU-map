<script setup>
    import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import bldgList from '@/assets/bldgList.json';

    const router = useRouter();
    
    const curBldg = ref("멀티미디어관-글로벌관");
    const curFloor = ref("1");
    const floorInfo = ref(null);
    
    const bldgInfo = ref(null);

    function changeBldg(val) {
        curBldg.value = val;
    }

    function changeFloor(val) {
        curFloor.value = val;
    }

    const curTime = ref(null)

    const updateTime = () => {
      curTime.value = new Date().toLocaleDateString('ko-KR', {timeZone: "Asia/Seoul", weekday: 'long', hour: '2-digit', minute: 'numeric', second: 'numeric', hour12: false});
    }

    const weekday = ref("");
    const timeHMS = ref(null);

    watch(curTime, () => {
      weekday.value = curTime.value.split(" ")[0].split("(")[1].split("요일")[0];
      timeHMS.value = curTime.value.split(" ")[1].split(":");
    })

    const updateTimeInterval = setInterval(updateTime, 1000);

    function isVacant(room) {
        var vacancy = true;

        console.log(room)

        for (var classroom of room.classes) {
            var days = classroom.days;
            var timeStart = classroom.timeStart;
            var timeEnd = classroom.timeEnd;

            if (typeof days == 'object') {
                for (var day of days) {
                if (day == weekday.value) {
                    if (checkTime(timeStart, timeEnd)) {
                        vacancy = false;
                    }
                }
                }
            } else {
                if (days == weekday.value) {
                    if (checkTime(timeStart, timeEnd)) {
                        vacancy = false;
                    }
                }
            }
        }

      return vacancy;
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

    watch(curBldg, () => {
        for (var bldg of bldgList.bldgs) {
            if (bldg.bldgName == curBldg.value) {
                bldgInfo.value = bldg;
                curFloor.value = "1";
                if (bldg.floors.length == 0) {
                    floorInfo.value = null;
                } else {
                    for (var floor of bldg.floors) {
                        if (floor.floor == curFloor.value) {
                            floorInfo.value = floor;
                        }
                    }
                }
            }
        }
    });

    watch(curFloor, () => {
        for (var bldg of bldgList.bldgs) {
            if (bldg.bldgName == curBldg.value) {
                bldgInfo.value = bldg;
                if (bldg.floors.length == 0) {
                    floorInfo.value = null;
                } else {
                    for (var floor of bldg.floors) {
                        if (floor.floor == curFloor.value) {
                            floorInfo.value = floor;
                        }
                    }
                }
            }
        }
    });

    function goToClassroom(bldgName, floor, classroom) {
      router.push({ name: "bldg-map-classroom", params: { bldg: bldgName, floor: floor, classroom: classroom }});
    }

    onMounted(() => {
        if (localStorage.getItem('reloaded')) {
            localStorage.removeItem('reloaded');
        } else {
            localStorage.setItem('reloaded', '1');
            router.go(0);
        }

        for (var bldg of bldgList.bldgs) {
            if (bldg.bldgName == curBldg.value) {
                bldgInfo.value = bldg;
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
    <div class="px-8 w-full py-8 flex justify-center">
        <div class="max-w-screen-xl w-full flex-col">
            <div class="mb-8">
                <button @click="router.push({ name: 'home'});" class="px-4 py-2 bg-gray-300 hover:bg-gray-500 transition-bg-colors duration-300 ease-in-out">
                    <span class="font-bold text-white">&#x2190; 3D 맵으로</span>
                </button>
            </div>
            <div class="w-full flex flex-col">
                <span class="font-bold text-3xl">{{ curBldg }}</span>
                <span class="mt-4 font-bold text-3xl text-gray-400">{{ curFloor }}F</span>
            </div>
            <!--건물별 버튼-->
            <div v-if="bldgInfo" class="w-full flex flex-wrap py-4 border-b">
                <div v-for="bldg in bldgList.bldgs" :key="bldg.id" class="mt-4">
                    <button 
                    @click="changeBldg(bldg.bldgName)"
                    :class="curBldg == bldg.bldgName ? 'text-white bg-red-300' : 'bg-gray-300'"
                    class="px-4 py-2 mr-4 hover:bg-red-300 transition-bg-colors duration-300 ease-in-out">
                        <span>{{ bldg.bldgName }}</span>
                    </button>
                </div>
            </div>
            <!--층별 버튼-->
            <div v-if="bldgInfo" class="w-full flex mt-4 py-4 border-b">
                <div v-for="floor in bldgInfo.floors" :key="floor.id">
                    <button 
                    @click="changeFloor(floor.floor)"
                    :class="curFloor == floor.floor ? 'text-white bg-red-300' : 'bg-gray-300'"
                    class="px-4 py-2 mr-4 hover:bg-red-300 transition-bg-colors duration-300 ease-in-out">
                        <span>{{ floor.floor }}F</span>
                    </button>
                </div>
            </div>
            <!--빈 강의 정보-->
            <div v-if="floorInfo != null" class="w-full flex flex-col flex-wrap">
                <span class="mt-4 font-bold text-xl">빈 강의실</span>
                <div class="mb-4 font-bold text-gray-500">{{ curTime }}</div>
                <div class="flex flex-wrap">
                    <div v-for="room in floorInfo.rooms" :key="room.id" class="flex flex-row flex-wrap">
                        <button @click="goToClassroom(curBldg, floorInfo.floor, room);" v-if="typeof room != 'object' && curTime != null" 
                        class="mt-4 mr-4 flex bg-gray-300 hover:bg-red-300 transition-bg-colors duration-300 ease-in-out">
                            <span class="px-4 py-2 font-bold">
                                {{ room }}
                            </span>
                        </button>
                        <button @click="goToClassroom(curBldg, floorInfo.floor, room.roomNumber);" v-if="typeof room == 'object' && isVacant(room) && curTime != null" 
                        class="mt-4 mr-4 flex bg-gray-300 hover:bg-red-300 transition-bg-colors duration-300 ease-in-out">
                            <span class="px-4 py-2 font-bold">
                                {{ room.roomNumber }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>