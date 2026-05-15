import { ref } from 'vue'

// JSON con datos inventados
const rolesData = {
  "camarero": {
    id: "camarero",
    title: "Rol: Camarero",
    description: "Gestión de mesas en salón, confirmación de ocupación y alertas de limpieza."
  },
  "administrador": {
    id: "administrador",
    title: "Rol: Administrador",
    description: "Configuración de topología del local, gestión de personal y auditoría de métricas."
  }
}

// Estado global simple (simulando un store)
const currentRole = ref(null)

export function useRole() {
  const selectRole = (roleKey) => {
    if (rolesData[roleKey]) {
      currentRole.value = rolesData[roleKey]
    }
  }

  const logout = () => {
    currentRole.value = null
  }

  return {
    rolesData,
    currentRole,
    selectRole,
    logout
  }
}
