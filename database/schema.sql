-- ==========================================
-- BASE DE DATOS: ECOMMERCE
-- Motor: MySQL 8.4
-- ==========================================

CREATE DATABASE IF NOT EXISTS ecommerce_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;


-- ==========================================
-- 1. TABLA ROLES
-- ==========================================

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
) ENGINE=InnoDB;


-- ==========================================
-- 2. TABLA USUARIOS
-- ==========================================

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ==========================================
-- 3. TABLA CLIENTES
-- ==========================================

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    direccion VARCHAR(200),
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ==========================================
-- 4. TABLA CATEGORIAS
-- ==========================================

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    activa BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;


-- ==========================================
-- 5. TABLA PRODUCTOS
-- ==========================================

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    sku VARCHAR(50) NOT NULL UNIQUE,
    precio DECIMAL(12,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen_url VARCHAR(500),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_productos_precio
        CHECK (precio >= 0),

    CONSTRAINT chk_productos_stock
        CHECK (stock >= 0),

    CONSTRAINT fk_productos_categorias
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_productos_nombre (nombre),
    INDEX idx_productos_categoria (id_categoria)
) ENGINE=InnoDB;


-- ==========================================
-- 6. TABLA CARRITOS
-- ==========================================

CREATE TABLE carritos (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NULL,
    token_sesion CHAR(36) NOT NULL UNIQUE,
    estado ENUM('activo', 'convertido', 'abandonado')
        NOT NULL DEFAULT 'activo',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_carritos_clientes
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ==========================================
-- 7. TABLA DETALLE_CARRITO
-- ==========================================

CREATE TABLE detalle_carrito (
    id_detalle_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,

    CONSTRAINT chk_detalle_carrito_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT fk_detalle_carrito_carritos
        FOREIGN KEY (id_carrito)
        REFERENCES carritos(id_carrito)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_detalle_carrito_productos
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT uq_carrito_producto
        UNIQUE (id_carrito, id_producto)
) ENGINE=InnoDB;


-- ==========================================
-- 8. TABLA PEDIDOS
-- ==========================================

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    numero_pedido VARCHAR(40) NOT NULL UNIQUE,
    fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM(
        'pendiente',
        'confirmado',
        'preparando',
        'enviado',
        'entregado',
        'cancelado'
    ) NOT NULL DEFAULT 'pendiente',
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    direccion_entrega VARCHAR(200) NOT NULL,

    CONSTRAINT chk_pedidos_total
        CHECK (total >= 0),

    CONSTRAINT fk_pedidos_clientes
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_pedidos_fecha (fecha_pedido),
    INDEX idx_pedidos_estado (estado)
) ENGINE=InnoDB;


-- ==========================================
-- 9. TABLA DETALLE_PEDIDO
-- ==========================================

CREATE TABLE detalle_pedido (
    id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,

    CONSTRAINT chk_detalle_pedido_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_detalle_pedido_precio
        CHECK (precio_unitario >= 0),

    CONSTRAINT fk_detalle_pedido_pedidos
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_detalle_pedido_productos
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_detalle_pedido_pedido (id_pedido),
    INDEX idx_detalle_pedido_producto (id_producto)
) ENGINE=InnoDB;