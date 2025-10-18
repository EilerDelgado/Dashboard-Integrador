# Sistema de Navegación con Control de Acceso por Roles

## 📋 Estructura de Menús del Sistema Educativo

### 🔐 Permisos por Rol

#### **Administrador** (admin)
Acceso completo a todos los módulos:
- ✅ Dashboard
- ✅ Ingreso y Registro (ver y crear estudiantes)
- ✅ Historial Estudiantil (ver y crear)
- ✅ Módulo Familiar (ver y crear)
- ✅ Seguimiento de Notas (ver y crear)
- ✅ Asistencias (ver y crear)
- ✅ Bienestar Estudiantil (ver y crear)
- ✅ Materias (ver y crear)
- ✅ Estadísticas

#### **Profesor** (profesor)
Acceso educativo y de seguimiento:
- ✅ Dashboard
- ✅ Ingreso y Registro (solo ver estudiantes)
- ✅ Historial Estudiantil (ver y crear)
- ✅ Módulo Familiar (solo ver)
- ✅ Seguimiento de Notas (ver y crear)
- ✅ Asistencias (ver y crear)
- ✅ Bienestar Estudiantil (ver y crear)
- ✅ Materias (solo ver)
- ✅ Estadísticas

#### **Estudiante** (estudiante)
Acceso limitado a su información:
- ✅ Dashboard
- ✅ Módulo Familiar (ver y crear)
- ✅ Seguimiento de Notas (solo ver sus propias notas)
- ✅ Asistencias (solo ver sus propias asistencias)

---

## 🗂️ Módulos del Sistema

### 1. **Dashboard**
- Ruta: `/dashboard`
- Roles: admin, profesor, estudiante
- Vista general del sistema con estadísticas

### 2. **Ingreso y Registro**
- **Ver Estudiantes**: `/estudiantes` (admin, profesor)
- **Crear Estudiante**: `/estudiantes/crear` (admin)
- Gestión de registro de estudiantes

### 3. **Historial Estudiantil**
- **Ver Historial**: `/historial` (admin, profesor)
- **Crear Registro**: `/historial/crear` (admin, profesor)
- Registro académico histórico

### 4. **Módulo Familiar**
- **Ver Familiares**: `/familiares` (admin, profesor, estudiante)
- **Crear Familiar**: `/familiares/crear` (admin, estudiante)
- Información de acudientes y familia

### 5. **Seguimiento de Notas**
- **Ver Notas**: `/notas` (admin, profesor, estudiante)
- **Registrar Nota**: `/notas/crear` (admin, profesor)
- Sistema principal de calificaciones

### 6. **Asistencias**
- **Ver Asistencias**: `/asistencias` (admin, profesor, estudiante)
- **Registrar Asistencia**: `/asistencias/crear` (admin, profesor)
- Control de asistencia diaria

### 7. **Bienestar Estudiantil**
- **Ver Registros**: `/bienestar` (admin, profesor)
- **Crear Registro**: `/bienestar/crear` (admin, profesor)
- Seguimiento del bienestar del estudiante

### 8. **Materias**
- **Ver Materias**: `/materias` (admin, profesor)
- **Crear Materia**: `/materias/crear` (admin)
- Gestión del plan de estudios

### 9. **Estadísticas**
- **Ver Reportes**: `/estadisticas` (admin, profesor)
- Análisis y reportes del sistema

---

## 🔧 Implementación Técnica

### Componente SideBarNew.jsx
Sidebar dinámico que renderiza menús según el rol del usuario autenticado.

**Características:**
- ✅ Submenús colapsables
- ✅ Indicador visual de ruta activa
- ✅ Filtrado automático por roles
- ✅ Animaciones suaves
- ✅ Iconos de Lucide React

### Sistema de Rutas Protegidas
Todas las rutas están protegidas mediante el componente `PrivateRoute` que:
1. Verifica autenticación del usuario
2. Valida roles permitidos
3. Redirige a Error403 si no tiene permisos
4. Redirige a Login si no está autenticado

### Estilos Personalizados
Archivo: `dashboard-custom.css`
- Estilos para submenús colapsables
- Efectos hover y transiciones
- Indicadores de ruta activa
- Animaciones de chevrones

---

## 📝 Credenciales de Prueba

```javascript
// Administrador
Email: admin@dashboard.com
Password: admin123

// Profesor
Email: profesor@dashboard.com
Password: profesor123

// Estudiante
Email: estudiante@dashboard.com
Password: estudiante123
```

---

## 🚀 Próximos Pasos

Los módulos actualmente muestran páginas placeholder. Para completar el sistema:

1. **Estudiantes**: Implementar CRUD completo de estudiantes
2. **Historial**: Sistema de seguimiento académico histórico
3. **Familiares**: Base de datos de acudientes
4. **Asistencias**: Registro diario con calendario
5. **Bienestar**: Fichas de seguimiento psicosocial
6. **Estadísticas**: Gráficos y reportes dinámicos

Cada módulo seguirá el mismo patrón profesional implementado en el módulo de Notas.
