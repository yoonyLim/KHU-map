<script setup>
    import { RouterView } from 'vue-router'
</script>

<template>
    <div>
        <router-view v-slot="{ Component }">
            <Transition>
                <component :is="Component" />
            </Transition>
        </router-view>
    </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>