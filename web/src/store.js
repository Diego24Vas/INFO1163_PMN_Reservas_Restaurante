import { reactive } from 'vue'

export const store = reactive({
  role: null, // 'admin', 'waiter', null
  rooms: [
    {
      id: 'room_1',
      name: 'Salón Principal',
      tables: [
        { id: 't_1', number: 1, capacity: 4, state: 'disponible', x: 1400, y: 1500 },
        { id: 't_2', number: 2, capacity: 2, state: 'ocupada', x: 1550, y: 1500 }
      ],
      elements: [
        { id: 'e_1', type: 'wall', x: 1372, y: 1400, width: 256, height: 8, rotation: 0 }
      ]
    }
  ],
  activeRoomId: 'room_1',
  activeTable: null,
  tableCounter: 3,
  elementCounter: 2
})

export const stateConfig = {
  disponible: { color: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Disponible', icon: 'check-circle' },
  asignacion: { color: 'bg-amber-50 border-amber-200 text-amber-700', label: 'En Asignación', icon: 'clock' },
  ocupada: { color: 'bg-rose-50 border-rose-200 text-rose-700', label: 'Ocupada', icon: 'users' },
  sucia: { color: 'bg-neutral-100 border-neutral-300 text-neutral-500', label: 'Sucia / Limpieza', icon: 'trash-2' }
}
