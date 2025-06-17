CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    contraseña_hash TEXT NOT NULL,
    rol VARCHAR(50) CHECK (rol IN ('estudiante', 'instructor', 'admin')) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    preferencias JSONB,
    foto TEXT NULL -- << nueva columna para guardar la imagen de perfil
);

-- Insertar usuario admin
INSERT INTO usuarios (nombre, correo, contraseña_hash, rol, preferencias, foto)
VALUES (
    'Admin General',
    'admin@ejemplo.com',
    crypt('admin', gen_salt('bf')),
    'admin',
    '{}'::jsonb,
    NULL
);
