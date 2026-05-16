<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { store, stateConfig } from '../store'
import NavBar from '../components/NavBar.vue'
import { MapPin, Users, ZoomIn, ZoomOut, Maximize, Clock, CheckCircle2, XCircle, Trash2, Check, Lock, AlertTriangle } from 'lucide-vue-next'
import Dialog from 'primevue/dialog'

const router = useRouter()
const canvasContainer = ref(null)
const zoomLevel = ref(1)

// Modal de acciones y Timer
const isActionDialogOpen = ref(false)
const activeTableItem = ref(null)
const timeRemaining = ref({})
const elapsedTimes = ref({}) // Para medir tiempo en ocupada/sucia
let timerInterval = null

onMounted(async () => {
  if (store.role !== 'waiter' || !store.activeWaiterId) {
    router.push('/')
    return
  }
  if (!store.isLoaded) await store.loadTopology()
  
  setTimeout(centerView, 50)
  setTimeout(centerView, 150)

  // Loop de comprobación de locks y alertas (cada segundo)
  timerInterval = setInterval(() => {
    let needsSave = false
    const now = Date.now()
    
    store.rooms.forEach(room => {
      room.tables.forEach(table => {
        // Lógica de Lock en Asignación (60s)
        if (table.state === 'asignacion' && table.lockedUntil) {
          const secondsLeft = Math.ceil((table.lockedUntil - now) / 1000)
          if (secondsLeft <= 0) {
            table.state = 'disponible'
            table.lockedUntil = null
            table.lockedBy = null
            table.stateUpdatedAt = now
            needsSave = true
            
            if (activeTableItem.value && activeTableItem.value.id === table.id) {
              isActionDialogOpen.value = false
            }
          } else {
            timeRemaining.value[table.id] = secondsLeft
          }
        }

        // Lógica de Alertas de Tiempo (Ocupada y Sucia)
        if (table.state === 'ocupada' || table.state === 'sucia') {
          if (!table.stateUpdatedAt) {
            table.stateUpdatedAt = now
            needsSave = true
          }
          
          const elapsedMinutes = Math.floor((now - table.stateUpdatedAt) / 60000)
          let isWarning = false
          
          // Umbrales de alerta según Reglas de Negocio (RN07 y RN08)
          // RN07: Alerta de Inactividad (>120 min)
          if (table.state === 'ocupada' && elapsedMinutes >= 120) isWarning = true
          // RN08: Tiempo Máximo de Limpieza (>10 min)
          if (table.state === 'sucia' && elapsedMinutes >= 10) isWarning = true
          
          elapsedTimes.value[table.id] = { minutes: elapsedMinutes, isWarning }
        } else {
          delete elapsedTimes.value[table.id]
        }
      })
    })
    
    if (needsSave) store.saveTopology()
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', stopPan)
})

const waiterName = computed(() => {
  const w = store.waiters.find(w => w.id === store.activeWaiterId)
  return w ? w.name : 'Camarero'
})

const getWaiterNameById = (id) => {
  const w = store.waiters.find(w => w.id === id)
  return w ? w.name : 'Otro camarero'
}

const activeRoom = computed(() => {
  return store.rooms.find(r => r.id === store.activeRoomId) || store.rooms[0]
})

const selectRoom = (roomId) => {
  store.activeRoomId = roomId
  centerView()
}

const centerView = () => {
  if (canvasContainer.value) {
    const targetX = 1500 - (canvasContainer.value.clientWidth / 2)
    const targetY = 1500 - (canvasContainer.value.clientHeight / 2)
    canvasContainer.value.scrollLeft = targetX
    canvasContainer.value.scrollTop = targetY
  }
}

const zoomIn = () => { zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2) }
const zoomOut = () => { zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5) }
const resetZoom = () => { zoomLevel.value = 1; centerView() }

// Lógica de click en Mesa
const handleTableClick = (table) => {
  activeTableItem.value = table
  isActionDialogOpen.value = true
}

// Lógica de Máquina de Estados
const changeTableState = async (newState) => {
  if (!activeTableItem.value) return
  
  const table = activeTableItem.value
  table.state = newState
  table.stateUpdatedAt = Date.now() // Actualizamos timestamp de estado
  
  if (newState === 'asignacion') {
    table.lockedUntil = Date.now() + 60000 // 60 segundos desde ahora
    table.lockedBy = store.activeWaiterId
    timeRemaining.value[table.id] = 60
  } else {
    table.lockedUntil = null
    table.lockedBy = null
    
    // Asignación de propiedad de la mesa
    if (newState === 'ocupada') {
      table.assignedTo = store.activeWaiterId
    } else if (newState === 'disponible') {
      table.assignedTo = null
    }
  }
  
  await store.saveTopology()
  isActionDialogOpen.value = false
}

// Variables para Panning (Scroll con arrastre)
let isPanning = false
let panStartX, panStartY, scrollLeftStart, scrollTopStart

const startPan = (e) => {
  if (e.button !== 0) return
  isPanning = true
  panStartX = e.clientX
  panStartY = e.clientY
  if (canvasContainer.value) {
    scrollLeftStart = canvasContainer.value.scrollLeft
    scrollTopStart = canvasContainer.value.scrollTop
  }
  document.body.style.userSelect = 'none'
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', stopPan)
}

const handleMouseMove = (e) => {
  if (isPanning && canvasContainer.value) {
    const dx = e.clientX - panStartX
    const dy = e.clientY - panStartY
    canvasContainer.value.scrollLeft = scrollLeftStart - dx
    canvasContainer.value.scrollTop = scrollTopStart - dy
  }
}

const stopPan = () => {
  isPanning = false
  document.body.style.userSelect = 'auto'
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', stopPan)
}
</script>

<template>
  <div class="flex-1 flex flex-col w-full h-full min-h-screen bg-neutral-50">
    <NavBar roleName="Camarero" />
    
    <main class="flex-1 max-w-6xl w-full mx-auto p-8 flex flex-col animate-[fadeIn_0.2s_ease-out]">
      <header class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-semibold tracking-tight text-neutral-900">Bienvenido, {{ waiterName }}</h1>
          <p class="text-sm text-neutral-500 mt-2 font-medium">Visualiza las salas y gestiona el estado de las mesas operativas.</p>
        </div>
      </header>

      <!-- Pestañas de Salas -->
      <div v-if="store.rooms.length > 0" class="flex gap-2 mb-4 overflow-x-auto pb-2 hide-scrollbar">
        <button 
          v-for="room in store.rooms" :key="room.id"
          @click="selectRoom(room.id)"
          :class="['px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border whitespace-nowrap flex items-center gap-2 shadow-sm', 
            store.activeRoomId === room.id 
              ? 'bg-neutral-900 text-white border-neutral-900' 
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
          ]">
          <MapPin :stroke-width="1.5" class="w-4 h-4" :class="store.activeRoomId === room.id ? 'text-neutral-300' : 'text-neutral-400'" />
          {{ room.name }}
        </button>
      </div>

      <!-- Visor de Topología -->
      <div class="flex-1 relative bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm min-h-[500px]">
        <template v-if="activeRoom">
          
          <!-- Controles de Zoom Flotantes -->
          <div class="absolute right-6 bottom-6 z-30 flex flex-col gap-2 bg-white p-1 rounded-xl shadow-lg border border-neutral-200">
            <button @click="zoomIn" class="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
              <ZoomIn :stroke-width="1.5" class="w-4 h-4" />
            </button>
            <div class="w-full h-px bg-neutral-100 my-0.5"></div>
            <button @click="resetZoom" class="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors" title="Centrar Vista">
              <Maximize :stroke-width="1.5" class="w-4 h-4" />
            </button>
            <div class="w-full h-px bg-neutral-100 my-0.5"></div>
            <button @click="zoomOut" class="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
              <ZoomOut :stroke-width="1.5" class="w-4 h-4" />
            </button>
          </div>

          <!-- Lienzo de Navegación -->
          <div ref="canvasContainer" class="absolute inset-0 overflow-auto bg-neutral-50/50 hide-scrollbar">
            <div 
              class="absolute transition-transform duration-200 origin-top-left cursor-grab active:cursor-grabbing" 
              :style="{ transform: `scale(${zoomLevel})`, width: '3000px', height: '3000px' }" 
              @mousedown.self="startPan">
              
              <!-- Elementos Arquitectónicos (Solo lectura) -->
              <div 
                v-for="el in activeRoom.elements" :key="el.id"
                :class="[
                  'absolute rounded-sm flex items-center justify-center origin-center shadow-sm select-none pointer-events-none',
                  el.type === 'wall' ? 'bg-neutral-800' : 
                  el.type === 'window' ? 'bg-sky-100/80 border-2 border-sky-300 backdrop-blur-sm' : 
                  'bg-amber-600 border border-amber-800'
                ]"
                :style="{ 
                  left: el.x + 'px', top: el.y + 'px', 
                  width: el.width + 'px', height: el.height + 'px',
                  transform: `rotate(${el.rotation}deg)` 
                }">
              </div>

              <!-- Mesas (Interactivas) -->
              <button 
                v-for="table in activeRoom.tables" :key="table.id"
                @click="handleTableClick(table)"
                :class="[
                  'absolute flex flex-col items-center justify-center w-20 h-20 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-neutral-200 group',
                  stateConfig[table.state || 'disponible'].color,
                  (elapsedTimes[table.id]?.isWarning) ? 'ring-2 ring-rose-500 animate-pulse' : ''
                ]"
                :style="{ left: table.x + 'px', top: table.y + 'px' }">
                <span class="text-lg font-bold tracking-tight">{{ table.number }}</span>
                <span class="text-[10px] font-semibold uppercase tracking-widest opacity-75 mt-0.5 flex items-center gap-1">
                  <Users :stroke-width="2" class="w-3 h-3" /> {{ table.capacity }}
                </span>
                
                <!-- Indicador de Tiempo (Solo Asignación) -->
                <div v-if="table.state === 'asignacion' && timeRemaining[table.id]" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm z-10 flex items-center gap-1">
                  <Clock :stroke-width="2" class="w-3 h-3" /> {{ timeRemaining[table.id] }}s
                </div>

                <!-- Indicador de Tiempo (Ocupada/Sucia) -->
                <div v-if="elapsedTimes[table.id]" :class="['absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm z-10 flex items-center gap-1 transition-colors', elapsedTimes[table.id].isWarning ? 'bg-rose-500 text-white' : 'bg-neutral-800 text-white']">
                  <AlertTriangle v-if="elapsedTimes[table.id].isWarning" :stroke-width="2" class="w-3 h-3" />
                  <Clock v-else :stroke-width="2" class="w-3 h-3" />
                  {{ elapsedTimes[table.id].minutes }}m
                </div>

                <!-- Indicador de Estado Visual -->
                <div class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white bg-current opacity-80 group-hover:scale-110 transition-transform"></div>
              </button>
              
            </div>
          </div>

        </template>
        <template v-else>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <MapPin :stroke-width="1.5" class="w-12 h-12 mb-3 opacity-50" />
            <p class="text-sm font-medium">No hay salas disponibles.</p>
          </div>
        </template>
      </div>

    </main>

    <!-- Modal de Acciones de Mesa -->
    <Dialog v-model:visible="isActionDialogOpen" modal :header="activeTableItem ? `Mesa ${activeTableItem.number}` : ''" :style="{ width: '28rem' }" :pt="{ root: { class: 'bg-white rounded-2xl shadow-xl border border-neutral-200' }, header: { class: 'p-6 pb-0' }, title: { class: 'text-xl font-semibold tracking-tight text-neutral-900' }, content: { class: 'p-6' }, mask: { class: 'bg-neutral-900/40 backdrop-blur-sm' } }">
      <div v-if="activeTableItem" class="flex flex-col gap-5 mt-2">
        
        <!-- Estado de la Mesa -->
        <div class="flex items-center gap-3 p-4 rounded-xl border" :class="stateConfig[activeTableItem.state || 'disponible'].color.split(' ').map(c => c.replace('bg-', 'bg-').replace('border-', 'border-').replace('text-', 'text-')).join(' ')">
          <div class="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shrink-0">
            <CheckCircle2 v-if="activeTableItem.state === 'disponible'" :stroke-width="1.5" class="w-5 h-5" />
            <Clock v-else-if="activeTableItem.state === 'asignacion'" :stroke-width="1.5" class="w-5 h-5" />
            <Users v-else-if="activeTableItem.state === 'ocupada'" :stroke-width="1.5" class="w-5 h-5" />
            <Trash2 v-else :stroke-width="1.5" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-sm font-semibold tracking-tight">Estado actual: {{ stateConfig[activeTableItem.state || 'disponible'].label }}</p>
            <p class="text-xs opacity-80 font-medium">Capacidad: {{ activeTableItem.capacity }} personas</p>
          </div>
        </div>

        <!-- Acciones: DISPONIBLE -->
        <template v-if="activeTableItem.state === 'disponible'">
          <p class="text-sm text-neutral-500 font-medium">¿Deseas iniciar el proceso de asignación para esta mesa?</p>
          <div class="flex justify-end gap-3 mt-2">
            <button @click="isActionDialogOpen = false" class="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">Cancelar</button>
            <button @click="changeTableState('asignacion')" class="px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm">Iniciar Asignación</button>
          </div>
        </template>

        <!-- Acciones: EN ASIGNACION -->
        <template v-else-if="activeTableItem.state === 'asignacion'">
          <!-- Si la mesa fue bloqueada por OTRO camarero -->
          <template v-if="activeTableItem.lockedBy && activeTableItem.lockedBy !== store.activeWaiterId">
            <div class="flex flex-col items-center text-center p-4 bg-neutral-50 rounded-xl border border-neutral-200 border-dashed">
              <Lock :stroke-width="1.5" class="w-8 h-8 text-neutral-400 mb-2" />
              <p class="text-sm font-semibold text-neutral-900">Mesa Bloqueada</p>
              <p class="text-xs text-neutral-500 mt-1">El camarero <b>{{ getWaiterNameById(activeTableItem.lockedBy) }}</b> está asignando esta mesa.</p>
            </div>
            <div class="flex justify-end mt-2">
              <button @click="isActionDialogOpen = false" class="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">Cerrar</button>
            </div>
          </template>
          
          <!-- Si la mesa fue bloqueada por EL MISMO camarero -->
          <template v-else>
            <div class="flex flex-col items-center justify-center p-4">
              <div class="text-4xl font-bold tracking-tighter text-amber-500 mb-1 font-mono">{{ timeRemaining[activeTableItem.id] || 0 }}s</div>
              <p class="text-xs font-medium text-neutral-500 uppercase tracking-widest">Para confirmar ocupación</p>
            </div>
            <div class="grid grid-cols-2 gap-3 mt-2">
              <button @click="changeTableState('disponible')" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">
                <XCircle :stroke-width="1.5" class="w-4 h-4" /> Cancelar
              </button>
              <button @click="changeTableState('ocupada')" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm">
                <Check :stroke-width="1.5" class="w-4 h-4" /> Confirmar
              </button>
            </div>
          </template>
        </template>

        <!-- Acciones: OCUPADA -->
        <template v-else-if="activeTableItem.state === 'ocupada'">
          <template v-if="activeTableItem.assignedTo && activeTableItem.assignedTo !== store.activeWaiterId">
            <div class="flex flex-col items-center text-center p-4 bg-neutral-50 rounded-xl border border-neutral-200 border-dashed">
              <Users :stroke-width="1.5" class="w-8 h-8 text-neutral-400 mb-2" />
              <p class="text-sm font-semibold text-neutral-900">Mesa Atendida</p>
              <p class="text-xs text-neutral-500 mt-1">El camarero <b>{{ getWaiterNameById(activeTableItem.assignedTo) }}</b> está a cargo de esta mesa.</p>
            </div>
            <div class="flex justify-end mt-2">
              <button @click="isActionDialogOpen = false" class="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">Cerrar</button>
            </div>
          </template>
          <template v-else>
            <p class="text-sm text-neutral-500 font-medium">¿Los clientes se han retirado? Marca la mesa para que el personal de limpieza se encargue.</p>
            <div class="flex justify-end gap-3 mt-2">
              <button @click="isActionDialogOpen = false" class="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">Volver</button>
              <button @click="changeTableState('sucia')" class="px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm">Marcar para Limpieza</button>
            </div>
          </template>
        </template>

        <!-- Acciones: SUCIA -->
        <template v-else-if="activeTableItem.state === 'sucia'">
          <template v-if="activeTableItem.assignedTo && activeTableItem.assignedTo !== store.activeWaiterId">
            <div class="flex flex-col items-center text-center p-4 bg-neutral-50 rounded-xl border border-neutral-200 border-dashed">
              <Trash2 :stroke-width="1.5" class="w-8 h-8 text-neutral-400 mb-2" />
              <p class="text-sm font-semibold text-neutral-900">Limpieza en Progreso</p>
              <p class="text-xs text-neutral-500 mt-1">El camarero <b>{{ getWaiterNameById(activeTableItem.assignedTo) }}</b> es responsable de habilitar esta mesa.</p>
            </div>
            <div class="flex justify-end mt-2">
              <button @click="isActionDialogOpen = false" class="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">Cerrar</button>
            </div>
          </template>
          <template v-else>
            <p class="text-sm text-neutral-500 font-medium">¿La mesa ya fue limpiada y está lista para recibir nuevos clientes?</p>
            <div class="flex justify-end gap-3 mt-2">
              <button @click="isActionDialogOpen = false" class="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">Volver</button>
              <button @click="changeTableState('disponible')" class="px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm">Marcar como Disponible</button>
            </div>
          </template>
        </template>

      </div>
    </Dialog>
  </div>
</template>