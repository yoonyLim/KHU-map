<script setup>
    import { onMounted, ref, defineAsyncComponent, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import bldgList from '@/assets/bldgList.json';

    const route = useRoute();
    const router = useRouter();
    
    const bldgName = route.params.bldg;
    const curFloor = ref("");
    const selectedClass = ref("");
    
    const bldgInfo = ref(null);

    if (route.params.floor) {
        curFloor.value = route.params.floor;
        selectedClass.value = route.params.class;
    } else {
        curFloor.value = "1";
    }

    const comp = computed(() => {
        if (bldgName == "멀티미디어관-글로벌관") {
            if (curFloor.value == "1") {
                return defineAsyncComponent(() => import("@/components/SVGs/멀티미디어관-글로벌관/1F.vue"));
            } else if (curFloor.value == "2") {
                return defineAsyncComponent(() => import("@/components/SVGs/멀티미디어관-글로벌관/2F.vue"));
            } else if (curFloor.value == "3") {
                return defineAsyncComponent(() => import("@/components/SVGs/멀티미디어관-글로벌관/3F.vue"));
            } else if (curFloor.value == "4") {
                return defineAsyncComponent(() => import("@/components/SVGs/멀티미디어관-글로벌관/4F.vue"));
            } else if (curFloor.value == "5") {
                return defineAsyncComponent(() => import("@/components/SVGs/멀티미디어관-글로벌관/5F.vue"));
            } else if (curFloor.value == "6") {
                return defineAsyncComponent(() => import("@/components/SVGs/멀티미디어관-글로벌관/6F.vue"));
            }
        }
        return null;
    });

    function changeFloor(val) {
        curFloor.value = val;
    }

    onMounted(() => {
        if (localStorage.getItem('reloaded')) {
            localStorage.removeItem('reloaded');
        } else {
            localStorage.setItem('reloaded', '1');
            router.go(0);
        }

        for (var bldg of bldgList.bldgs) {
            if (bldg.bldgName == bldgName) {
                bldgInfo.value = bldg;
            }
        }
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
                <span class="font-bold text-3xl">{{ bldgName }}</span>
                <span class="mt-4 font-bold text-3xl text-gray-400">{{ curFloor }}F</span>
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
            <div class="w-full h-full">
                <component :query="selectedClass" :is="comp"></component>
            </div>
        </div>
    </div>
</template>