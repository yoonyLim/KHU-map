<script setup>
    import { onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute();
    const router = useRouter();

    const bldgName = route.params.bldg;

    onMounted(() => {
        if (localStorage.getItem('reloaded')) {
        localStorage.removeItem('reloaded');
    } else {
        localStorage.setItem('reloaded', '1');
        router.go(0);
    }
    });
</script>

<template>
    <div class="w-full flex-col">
        <div>This is {{ bldgName }} page</div>
    </div>
</template>