<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import { UtensilsCrossed, Users, LayoutDashboard, User } from 'lucide-vue-next'
import Dialog from 'primevue/dialog'

const router = useRouter()

const isWaiterSelectOpen = ref(false)

const setRole = (role) => {
  if (role === 'waiter') {
    isWaiterSelectOpen.value = true
    return
  }
  
  store.role = role
  store.activeTable = null
  store.activeWaiterId = null
  if (role === 'admin') router.push('/admin')
}

const loginAsWaiter = (waiterId) => {
  store.role = 'waiter'
  store.activeWaiterId = waiterId
  store.activeTable = null
  isWaiterSelectOpen.value = false
  router.push('/waiter')
}
</script>

<template>
  <main class="flex-1 flex flex-col items-center justify-center p-6 animate-[fadeIn_0.3s_ease-out] min-h-screen">
    <div class="max-w-2xl w-full">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 text-white mb-6 shadow-sm">
          <UtensilsCrossed :stroke-width="1.5" class="w-6 h-6" />
        </div>
        <h1 class="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">Sistema de Reservas</h1>
        <p class="text-neutral-500 text-sm font-medium">Selecciona tu rol operativo para continuar</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Tarjeta Camarero -->
        <button @click="setRole('waiter')" class="group text-left bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all cursor-pointer flex flex-col">
          <div class="h-10 w-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
            <Users :stroke-width="1.5" class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-semibold tracking-tight text-neutral-900">Camarero</h2>
          <p class="text-sm text-neutral-500 mt-1 leading-relaxed">Gestión de mesas en salón, confirmación y alertas de limpieza.</p>
        </button>

        <!-- Tarjeta Administrador -->
        <button @click="setRole('admin')" class="group text-left bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all cursor-pointer flex flex-col">
          <div class="h-10 w-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
            <LayoutDashboard :stroke-width="1.5" class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-semibold tracking-tight text-neutral-900">Administrador</h2>
          <p class="text-sm text-neutral-500 mt-1 leading-relaxed">Configuración interactiva de salas, topología y mesas.</p>
        </button>
      </div>
    </div>

    <!-- Modal Seleccionar Mesero -->
    <Dialog v-model:visible="isWaiterSelectOpen" modal header="Identificación" :style="{ width: '28rem' }" :pt="{ root: { class: 'bg-white rounded-2xl shadow-xl border border-neutral-200' }, header: { class: 'p-6 pb-0' }, title: { class: 'text-xl font-semibold tracking-tight text-neutral-900' }, content: { class: 'p-6' }, mask: { class: 'bg-neutral-900/40 backdrop-blur-sm' } }">
      <div class="flex flex-col gap-4 mt-2">
        <p class="text-sm font-medium text-neutral-500 mb-2">Selecciona tu perfil de mesero para iniciar el turno.</p>
        
        <div v-if="store.waiters.length > 0" class="grid grid-cols-1 gap-2">
          <button v-for="waiter in store.waiters" :key="waiter.id" @click="loginAsWaiter(waiter.id)" class="flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-xl transition-all text-left">
            <div class="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 shrink-0">
              <User :stroke-width="1.5" class="w-4 h-4" />
            </div>
            <span class="text-sm font-semibold tracking-tight text-neutral-900">{{ waiter.name }}</span>
          </button>
        </div>
        <div v-else class="text-center p-6 bg-neutral-50 border border-neutral-200 rounded-xl border-dashed">
          <p class="text-sm font-medium text-neutral-500">No hay meseros registrados.</p>
          <p class="text-xs text-neutral-400 mt-1">Solicita a un administrador que te añada al sistema.</p>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button @click="isWaiterSelectOpen = false" class="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">Volver</button>
        </div>
      </div>
    </Dialog>
  </main>
</template>
