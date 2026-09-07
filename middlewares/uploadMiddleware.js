// Middleware de subida de archivos con multer.
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

// Asegurar que la carpeta destino exista.
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, nombreUnico);
    }
});

// Filtro de tipo de archivo (solo imágenes).
const TIPOS_PERMITIDOS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (TIPOS_PERMITIDOS.includes(ext) && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo imágenes: jpg, png, gif, webp.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Máx 5 MB.
});

module.exports = upload;