<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRole } from '../composables/useRole'
import { UtensilsCrossed, LogOut, PackageOpen } from 'lucide-vue-next'

const router = useRouter()
const { currentRole, logout } = useRole()

onMounted(() => {
  if (!currentRole.value) {
    router.push('/')
  }
})

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <main v-if="currentRole" class="flex-1 w-full mx-auto bg-white min-h-screen flex flex-col">
    <!-- Navegación Superior -->
    <nav class="border-b border-neutral-200 bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-sm">
          <UtensilsCrossed :stroke-width="1.5" class="w-4 h-4" />
        </div>
        <span class="font-medium tracking-tight text-neutral-900">Reservas</span>
      </div>
      <button @click="handleLogout" class="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2">
        <LogOut :stroke-width="1.5" class="w-4 h-4" />
        Cambiar Rol
      </button>
    </nav>

    <!-- Contenido del Dashboard -->
    <div class="max-w-6xl w-full mx-auto p-8 flex-1">
      <header class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight text-neutral-900">{{ currentRole.title }}</h1>
        <p class="text-sm text-neutral-500 mt-2 font-medium">{{ currentRole.description }}</p>
      </header>

      <!-- Contenedor vacío (Placeholder para el futuro contenido) -->
      <div class="w-full h-64 border border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center bg-neutral-50/50">
        <PackageOpen :stroke-width="1.5" class="w-6 h-6 text-neutral-400 mb-3" />
        <p class="text-sm text-neutral-500 font-medium">Panel en construcción</p>
        <p class="text-xs text-neutral-400 mt-1">Aquí se implementarán las funcionalidades específicas.</p>
      </div>
    </div>
  </main>
</template>
