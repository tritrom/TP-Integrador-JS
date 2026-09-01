# Proyecto Integrador: Web App de Gestión de Usuarios y Datos
### Departamento de Desarrollo Backend

**Repositorio en GitHub:** [tritrom/TP-Integrador-JS](https://github.com/tritrom/TP-Integrador-JS)

Este proyecto representa el desarrollo progresivo de una aplicación web profesional de servidor, diseñada bajo arquitectura modular utilizando el ecosistema de **Node.js** y **Express.js** [4]. Está preparado para escalar hacia la persistencia de datos relacionales utilizando **PostgreSQL** y el ORM **Sequelize** [5].

---

## 🚀 Requisitos del Sistema
Para instalar y ejecutar esta aplicación de manera local, asegúrate de contar con los siguientes elementos instalados en tu sistema:
*   **Node.js**: Versión **v18.0.0** o superior [4].
*   **npm** (Node Package Manager): Versión **9.0.0** o superior (usualmente se instala junto con Node.js).
*   **Git**: Para clonar y gestionar el control de versiones en GitHub [5].

---

## 🛠️ Instrucciones de Instalación

Sigue estos pasos detallados para configurar el entorno de desarrollo localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tritrom/TP-Integrador-JS.git
   cd nombre-de-tu-proyecto
   ```

2. **Instalar dependencias:**
   Ejecuta el siguiente comando en la raíz del proyecto para descargar e instalar todas las librerías necesarias:
   ```bash
   npm install
   ```
   *Esto instalará automáticamente las dependencias obligatorias (`express` y `dotenv`) y la dependencia de desarrollo (`nodemon`) declaradas en el archivo `package.json`* [13].

3. **Configurar las variables de entorno:**
   Crea un archivo llamado `.env` en el directorio raíz del proyecto y copia las siguientes variables de configuración [11, 12]:
   ```env
   PORT=3000
   NODE_ENV=development
   ```

---

## 💻 Instrucciones de Ejecución

El proyecto cuenta con dos scripts personalizados y optimizados para el ciclo de vida del software backend [13]:

### Modo de Desarrollo (Recomendado para pruebas e iteración local)
Este modo utiliza `nodemon` para monitorear los archivos en tiempo real y reiniciar automáticamente el servidor cada vez que realices y guardes un cambio en el código [13]:
```bash
npm run dev
```

### Modo de Producción
Inicia el proceso del servidor de forma directa y estable utilizando el ejecutable nativo de Node.js [13]:
```bash
npm start
```

---

## 🔍 Ejemplos de Uso y Endpoints Activos

Una vez levantado el servidor de forma exitosa, puedes interactuar con los siguientes recursos públicos desde tu navegador o cliente de APIs (como Postman o Insomnia) [17]:

### 1. Vista de Inicio (Ruta Raíz `/`)
*   **Método:** `GET`
*   **URL:** `http://localhost:3000/`
*   **Descripción:** Retorna una página de bienvenida estructurada en formato HTML. Esta vista se sirve de forma estática directamente desde la carpeta pública del servidor utilizando el middleware nativo `express.static` [14].
*   **Ejemplo de acceso:** Abre tu navegador favorito e ingresa a `http://localhost:3000/`.

### 2. Endpoint de Estado Técnico de la API (`/status`)
*   **Método:** `GET`
*   **URL:** `http://localhost:3000/status`
*   **Descripción:** Retorna un objeto estructurado en formato **JSON** con información detallada de la salud del aplicativo, ideal para sistemas de monitoreo técnico o balanceadores de carga [8, 14].
*   **Ejemplo de Respuesta (JSON):**
    ```json
    {
      "status": "active",
      "message": "El servidor Express está en línea y funcionando correctamente.",
      "environment": "development",
      "timestamp": "2026-08-27T18:26:53.000Z"
    }
    ```

### 3. Registro Histórico de Logs (`logs/log.txt`)
*   **Descripción:** Cada vez que un usuario accede a las rutas públicas descritas anteriormente, el middleware de auditoría intercepta la petición y escribe de manera persistente no bloqueante una línea en el archivo `log.txt` [15, 16].
*   **Ubicación física:** `logs/log.txt`
*   **Estructura del registro:** `[FECHA - HORA] Ruta accedida: /ruta` [16]
*   **Ejemplo de Registros Guardados:**
    ```text
    [27/8/2026 - 18:43:05] Ruta accedida: /
    [27/8/2026 - 18:43:10] Ruta accedida: /status
    [27/8/2026 - 18:44:22] Ruta accedida: /status
    ```

---

## 📂 Estructura del Proyecto

Para cumplir con la arquitectura de diseño modular requerida y preparar óptimamente el software para la persistencia relacional que se integrará en el Módulo 7 [4, 5, 17], el proyecto sigue la siguiente jerarquía de archivos y directorios:

```text
nombre-de-tu-proyecto/
├── config/             # Configuración del entorno y conexión de Sequelize (Preparado para Fase 2)
├── controllers/        # Controladores: encargados de manejar las peticiones y preparar las respuestas
├── logs/               # Almacenamiento local del archivo plano de auditoría (log.txt)
├── middlewares/        # Middlewares globales e interceptores personalizados (ej: logger.js)
├── models/             # Modelos de bases de datos para PostgreSQL con Sequelize (Preparado para Fase 2)
├── public/             # Carpeta pública para servir archivos web estáticos (HTML, CSS, JS de la Wallet)
├── routes/             # Enrutamiento modular e independiente de la aplicación (router.js)
├── services/           # Servicios de lógica de negocio y consultas de datos (Preparado para Fase 2)
├── .env                # Configuración de variables de entorno (Oculto en Git)
├── .gitignore          # Archivo para excluir node_modules y el archivo .env de Git
├── index.js            # Punto de entrada de la aplicación y arranque del servidor HTTP
├── package.json        # Archivo de configuración del proyecto y dependencias de NPM
└── README.md           # Documentación técnica obligatoria y reflexiones de diseño (Este archivo)
```

---

## ⚙️ Decisiones de Diseño y Justificaciones Técnicas
Como **Responsable Técnico del Proyecto** [9], detallo a continuación los fundamentos lógicos y de ingeniería aplicados para la toma de decisiones críticas de este backend [22]:

### 1. Elección del Nombre del Archivo Principal (`index.js` sobre `app.js`)
Se determinó utilizar **`index.js`** en el directorio raíz como el punto de inicio de la aplicación por las siguientes ventajas técnicas [12]:
*   **Resolución Nativa:** En el ecosistema de Node.js, `index.js` es reconocido por defecto por el motor de resolución de módulos. Si se hace referencia al directorio raíz, el proceso de inicio se activa de forma automática sin configuraciones adicionales.
*   **Separación de Responsabilidades:** En un enfoque profesional que escalará a bases de datos relacionales [5], `index.js` actúa estrictamente como el **orquestador del proceso global** (inicializa variables con `dotenv`, arranca el servidor Express en el puerto dinámico y establece la conexión física inicial con PostgreSQL a través del ORM Sequelize) [11, 12]. Posteriormente, delegará la inicialización de la configuración interna de Express a archivos secundarios de configuración, logrando un código limpio y desacoplado.

### 2. Estructura de Directorios Modular
La consigna exige al menos 5 carpetas bien nombradas [17]. En este diseño se ha implementado una arquitectura de **8 carpetas** incorporando adicionalmente `config`, `models` y `services` [5, 17].
*   **Justificación:** Esta elección estratégica previene la refactorización dolorosa en las siguientes etapas. Al estructurar `/models` para las entidades relacionales de Sequelize y `/services` para concentrar la lógica de negocio y consultas, nos aseguramos de que el código de controladores y rutas permanezca limpio, testeable y preparado para la Fase 2 sin necesidad de alterar la infraestructura de arranque construida en la Fase 1 [5, 21].

### 3. Elección y Nombramiento de los Scripts en `package.json`
Se incorporaron los dos scripts de ejecución estándar de la industria [13]:
*   `npm run dev` (ejecuta `nodemon index.js`): Optimizado para desarrollo ágil, eliminando la necesidad manual de apagar y levantar el proceso Node tras cada edición del código fuente [13].
*   `npm start` (ejecuta `node index.js`): Diseñado para el entorno productivo real [13]. Al prescindir del watcher de `nodemon`, consume sustancialmente menos recursos de CPU y memoria RAM, lo que garantiza estabilidad de procesos en servidores de producción virtualizados o en la nube.

### 4. Uso de la Carpeta `/public` para Recursos Estáticos
Se habilitó el middleware nativo `express.static` apuntando a la carpeta `/public` [14].
*   **Justificación:** Al tratarse de una arquitectura de backend híbrida que debe proveer la interfaz visual inicial de nuestra wallet digital, la carpeta `/public` centraliza todos los archivos estáticos necesarios (`index.html`, `transferencias.html`, `historial.html`) junto con sus dependencias cliente (hojas de estilo CSS e imágenes corporativas). Esto mantiene el frontend separado lógicamente del backend en Express, optimizando el rendimiento de carga y garantizando la entrega inmediata sin consumir ciclos de CPU dedicados al renderizado dinámico de plantillas en esta etapa.

### 5. Persistencia Local en Archivos Planos (`logs/log.txt`)
Se optó por registrar específicamente el evento de **visita de rutas públicas** mediante el módulo nativo `fs` y su función asíncrona `fs.appendFile()` [15, 16].
*   **Justificación:** El registro de visitas ofrece un historial de auditoría de tráfico en tiempo real de nuestra API. La elección de `fs.appendFile()` es crítica sobre otros métodos de escritura: al ejecutarse de manera asíncrona, evita que el hilo único (single-thread) de Node.js se bloquee esperando que el disco físico complete la escritura, permitiendo que el servidor Express continúe procesando peticiones entrantes de otros usuarios de manera ágil e ininterrumpida.

---

## 🧠 Reflexiones Técnicas de la Entrega (Fase 1)

1.  **Modularidad desde el Día Uno:** El mayor desafío al comenzar un proyecto backend no es hacer que el servidor funcione en local, sino anticipar el crecimiento de la lógica. Estructurar el proyecto de forma modular desde la primera fase, dividiendo la ruta, el middleware y el punto de entrada, asegura una transición limpia para las siguientes fases que requerirán autenticación JWT y operaciones CRUD complejas sobre PostgreSQL [5, 6, 7].
2.  **La Importancia del Middleware:** El middleware de logs implementado demuestra la versatilidad de Express para interceptar peticiones [15, 20]. Comprender este flujo de intercepción y asincronía es fundamental, pues este mismo mecanismo será reutilizado en la Fase 3 para proteger rutas utilizando JSON Web Tokens (JWT) y validar permisos de usuario de forma centralizada [6].
3.  **Preparación para Producción:** El uso inteligente de variables de entorno mediante `dotenv` garantiza que la aplicación sea portable y segura [11, 12, 20]. Esto nos permitirá cambiar entre bases de datos de desarrollo y producción de forma totalmente transparente en las próximas entregas simplemente modificando el archivo de variables local, respetando las mejores prácticas de la industria de software de nube.
