### 📊 Mis Estadísticas
<p align="left">
  <img src="https://github-readme-stats.vercel.app/api?username=KenLozano&show_icons=true&theme=radial" alt="Estadísticas de GitHub" width="48%" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=KenLozano&layout=compact&theme=radial" alt="Lenguajes más usados" width="48%" />
</p>

# CHOAYOAPP - Sistema de Fidelización de Clientes 🎁

Aplicación móvil híbrida desarrollada para **CHOAYO STORE**. Este sistema permite a los clientes registrarse, acumular puntos por sus compras mediante escaneo, visualizar su historial de transacciones, editar su perfil y canjear sus puntos por recompensas exclusivas del catálogo.

Desarrollado con **Ionic Framework** y **Angular** (Standalone Components).

---

## ⚙️ Requisitos Previos (Para una PC nueva)

Antes de descargar y ejecutar este proyecto en una computadora nueva, asegúrate de tener instaladas las siguientes herramientas esenciales:

1. **[Node.js](https://nodejs.org/es/)**: Descarga e instala la versión LTS (Recomendado). Esto incluirá `npm`, el gestor de paquetes que necesitamos.
2. **[Git](https://git-scm.com/downloads)**: Para poder clonar el repositorio y manejar las ramas del proyecto.
3. **[Visual Studio Code](https://code.visualstudio.com/)**: El editor de código recomendado para trabajar.
4. **Ionic CLI**: Una vez instalado Node.js, abre una terminal (CMD o PowerShell) como administrador y ejecuta el siguiente comando para instalar la herramienta de Ionic a nivel global:
```bash
   npm install -g @ionic/cli
```
5. **Supabase**: El proyecto usa Supabase como base de datos en la nube. Después de clonar el repositorio e instalar las dependencias del proyecto, todo queda listo automáticamente — la conexión ya está configurada en `src/environments/supabase.config.ts`.

---

## 🗄️ Base de Datos (Supabase)

El proyecto está conectado a Supabase (PostgreSQL en la nube). Las credenciales ya están configuradas en `src/environments/supabase.config.ts`.

Tablas disponibles: `usuarios`, `comercios`, `recompensas`, `puntos`, `historico_puntos`, `canjes`.

Para usar la base de datos en cualquier página, inyecta `SupabaseService`:

```typescript
import { SupabaseService } from '../../services/supabase.service';

constructor(private supabaseService: SupabaseService) {}

async cargarDatos() {
  const usuarios = await this.supabaseService.getAll('usuarios');
}
```

Métodos disponibles: `getAll(tabla)`, `insertar(tabla, valores)`, `actualizar(tabla, id, valores)`, `getRecompensas()`.
