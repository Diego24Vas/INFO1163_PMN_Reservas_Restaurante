<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import NavBar from '../components/NavBar.vue'
import { PackageOpen } from 'lucide-vue-next'

const router = useRouter()

onMounted(() => {
  if (store.role !== 'waiter') router.push('/')
})
</script>

<template>
  <div class="flex-1 flex flex-col w-full h-full min-h-screen bg-neutral-50">
    <NavBar roleName="Camarero" />
    
    <main class="flex-1 max-w-6xl w-full mx-auto p-8 flex flex-col animate-[fadeIn_0.2s_ease-out]">
      <header class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight text-neutral-900">Panel de Camarero</h1>
        <p class="text-sm text-neutral-500 mt-2 font-medium">Gestión de mesas en salón, confirmación de ocupación y alertas de limpieza.</p>
      </header>

      <div class="w-full h-64 border border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center bg-white shadow-sm">
        <PackageOpen :stroke-width="1.5" class="w-6 h-6 text-neutral-400 mb-3" />
        <p class="text-sm text-neutral-500 font-medium">Panel en construcción</p>
        <p class="text-xs text-neutral-400 mt-1">Aquí se implementarán las funcionalidades específicas del camarero.</p>
      </div>
    </main>
  </div>
</template>
