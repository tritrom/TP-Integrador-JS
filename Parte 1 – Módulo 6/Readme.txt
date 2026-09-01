



Backend para Wallet/
├── config/             # Configuración de Sequelize y variables de entorno (Fase 2)
├── controllers/        # Controladores: manejan las respuestas de las peticiones [1, 6]
├── logs/               # Carpeta para guardar el archivo plano log.txt [6, 7]
├── middlewares/        # Funciones intermedias (ej: el logger de accesos) [1, 6]
├── models/             # Modelos de Sequelize para PostgreSQL (vacía en Fase 1, se usa en Fase 2) [1, 2]
├── public/             # Archivos estáticos de tu servidor (HTML, CSS, imágenes) [6, 8]
├── routes/             # Definición de rutas y endpoints de la aplicación [1, 6]
├── services/           # Lógica de negocio y consultas a la base de datos (Fase 2) [1]
├── .env                # Variables de entorno (puerto, credenciales de DB) [9]
├── .gitignore          # Archivo para excluir node_modules y el archivo .env de Git
├── index.js            # Punto de entrada principal de tu servidor Express [10]
├── package.json        # Gestión de dependencias y scripts de ejecución [10, 11]
└── README.md           # Documentación técnica y justificaciones del proyecto [1, 6]