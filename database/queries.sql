USE ecommerce_db;

SELECT
    p.id_producto,
    p.nombre AS producto,
    p.precio,
    p.stock,
    c.nombre AS categoria
FROM productos p
INNER JOIN categorias c
    ON p.id_categoria = c.id_categoria;

    SELECT
    nombre,
    precio
FROM productos
WHERE precio > (
    SELECT AVG(precio)
    FROM productos
);

SELECT
    c.nombre AS categoria,
    COUNT(p.id_producto) AS cantidad_productos,
    ROUND(AVG(p.precio), 2) AS precio_promedio
FROM categorias c
LEFT JOIN productos p
    ON c.id_categoria = p.id_categoria
GROUP BY c.id_categoria, c.nombre
ORDER BY cantidad_productos DESC;