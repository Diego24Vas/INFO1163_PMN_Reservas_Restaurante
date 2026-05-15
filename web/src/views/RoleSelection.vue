<script setup>
import { useRouter } from 'vue-router'
import { useRole } from '../composables/useRole'
import { UtensilsCrossed, Users, LayoutDashboard } from 'lucide-vue-next'

const router = useRouter()
const { selectRole } = useRole()

const handleSelectRole = (roleKey) => {
  selectRole(roleKey)
  router.push('/dashboard')
}
</script>

<template>
  <main class="flex-1 flex flex-col items-center justify-center p-6 transition-opacity duration-300 min-h-screen">
    <div class="max-w-2xl w-full">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 text-white mb-6 shadow-sm">
          <UtensilsCrossed :stroke-width="1.5" class="w-6 h-6" />
        </div>
        <h1 class="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">Bienvenido al Sistema</h1>
        <p class="text-neutral-500 text-sm font-medium">Selecciona tu rol operativo para continuar</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Tarjeta Camarero -->
        <button @click="handleSelectRole('camarero')" class="group text-left bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all cursor-pointer flex flex-col">
          <div class="h-10 w-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
            <Users :stroke-width="1.5" class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-semibold tracking-tight text-neutral-900">Camarero</h2>
          <p class="text-sm text-neutral-500 mt-1 leading-relaxed">Gestión de mesas en salón, confirmación de ocupación y alertas de limpieza.</p>
        </button>

        <!-- Tarjeta Administrador -->
        <button @click="handleSelectRole('administrador')" class="group text-left bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all cursor-pointer flex flex-col">
          <div class="h-10 w-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
            <LayoutDashboard :stroke-width="1.5" class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-semibold tracking-tight text-neutral-900">Administrador</h2>
          <p class="text-sm text-neutral-500 mt-1 leading-relaxed">Configuración de topología del local, gestión de personal y auditoría de métricas.</p>
        </button>
      </div>
    </div>
  </main>
</template>
