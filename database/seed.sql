USE ecommerce_db;

-- ROLES
INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador del sistema'),
('empleado', 'Empleado del comercio');

-- CATEGORIAS
INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica', 'Productos electrónicos'),
('Informática', 'Computadoras y accesorios'),
('Hogar', 'Productos para el hogar'),
('Deportes', 'Artículos deportivos');

-- PRODUCTOS
INSERT INTO productos
(id_categoria, nombre, descripcion, sku, precio, stock)
VALUES
(1, 'Auriculares Bluetooth', 'Auriculares inalámbricos', 'ELEC001', 45000, 20),
(1, 'Smart TV 43 pulgadas', 'Televisor Smart LED', 'ELEC002', 380000, 10),
(2, 'Mouse inalámbrico', 'Mouse óptico USB', 'INFO001', 18000, 35),
(2, 'Teclado mecánico', 'Teclado mecánico RGB', 'INFO002', 65000, 15),
(3, 'Licuadora', 'Licuadora de 500W', 'HOG001', 55000, 12),
(4, 'Pelota de fútbol', 'Pelota profesional', 'DEP001', 32000, 25);

--CLIENTES
INSERT INTO clientes
(nombre, apellido, email, telefono, direccion)
VALUES
('Juan', 'Perez', 'juan@gmail.com', '3804000001', 'Centro'),
('Maria', 'Gomez', 'maria@gmail.com', '3804000002', 'Zona Norte'),
('Lucas', 'Diaz', 'lucas@gmail.com', '3804000003', 'Zona Sur');