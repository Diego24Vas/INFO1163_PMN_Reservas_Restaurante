<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { store } from './store'

onMounted(() => {
  store.loadTopology()
})
</script>

<template>
  <RouterView />
</template>
