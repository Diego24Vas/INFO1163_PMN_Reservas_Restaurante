# INFO1163_PMN_Reservas_Restaurante

Grupo 8: Prototipo Mínimo Navegable sobre el tema Reservas con Representación Visual (Restaurante) Relación entre mesa física, tiempo y disponibilidad

## Descripción del Proyecto

Este proyecto es un Prototipo Mínimo Navegable (PMN) para un sistema de reservas de restaurante. Implementa la relación entre mesas físicas, tiempo y disponibilidad, permitiendo a los usuarios visualizar y gestionar reservas en tiempo real.

El PMN fue desarrollado utilizando:

- Vue 3 con Composition API
- Vite como bundler y servidor de desarrollo
- PrimeVue para componentes UI
- Tailwind CSS para styling
- Vue Router para navegación

## Instalación

### Prerrequisitos

- Node.js (versión 18 o superior recomendada)
- npm, pnpm o yarn

### Pasos para instalar y ejecutar

1. Clonar el repositorio (si no lo has hecho ya):

```bash
git clone https://github.com/tu-usuario/INFO1163_PMN_Reservas_Restaurante.git
cd INFO1163_PMN_Reservas_Restaurante
```

2. Instalar dependencias:

```bash
# Usando npm
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
# Usando npm
npm run dev
```

4. Abrir en el navegador:
   La aplicación estará disponible en http://localhost:5173 (o otro puerto que indique Vite)

### Para construir para producción:

```bash
# Usando npm
npm run build
```

Los archivos de producción se generarán en el directorio `dist/`.

## Características principales

- Visualización de mesas del restaurante en tiempo real
- Sistema de reservas basado en franjas horarias
- Indicadores de disponibilidad (disponible, reservado, en mantenimiento)
- Interfaz responsiva diseñada para móviles y escritorio
- Navegación intuitiva entre diferentes vistas del restaurante

## Estructura del proyecto

```
web/
├── public/         # Assets estáticos
├── src/
│   ├── assets/     # Recursos como imágenes, iconos
│   ├── components/ # Componentes Vue reutilizables
│   ├── layouts/    # Layouts de página
│   ├── pages/      # Vistas principales de la aplicación
│   ├── router/     # Configuración de Vue Router
│   ├── styles/     # Estilos globales y temas
│   ├── utils/      # Funciones utilitarias
│   ├── App.vue     # Componente raíz
│   └── main.js     # Punto de entrada de la aplicación
├── index.html      # Plantilla HTML principal
├── package.json    # Dependencias y scripts
└── vite.config.js  # Configuración de Vite
```

## Tecnologías utilizadas

- **Vue 3** - Framework progresivo para construir interfaces de usuario
- **Vite** - Herramienta de construcción rápida que sirve código fuente mediante módulos ES
- **PrimeVue** - Biblioteca de componentes UI ricos para Vue
- **Tailwind CSS** - Framework CSS utility-first para diseño rápido y personalizable
- **Vue Router** - Enrutador oficial para Vue.js
- **Lucide Vue** - Conjunto de iconos bellamente diseñados

## Contribuir

Este es un proyecto académico del grupo 8 para la materia INFO1163. Las contribuciones externas no son esperadas, pero si encuentras algún problema o tienes sugerencias, por favor abre un issue.

## Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
