USE ecommerce_db;

DROP PROCEDURE IF EXISTS sp_registrar_pedido;

DELIMITER //

CREATE PROCEDURE sp_registrar_pedido(
    IN p_id_cliente INT,
    IN p_direccion VARCHAR(200),
    IN p_id_producto INT,
    IN p_cantidad INT
)
BEGIN

    DECLARE v_stock INT;
    DECLARE v_precio DECIMAL(12,2);
    DECLARE v_total DECIMAL(12,2);
    DECLARE v_id_pedido INT;
    DECLARE v_numero_pedido VARCHAR(40);

    -- Si ocurre un error, deshacer toda la operación
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Validar cantidad
    IF p_cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad debe ser mayor a cero';
    END IF;

    -- Buscar y bloquear el producto
    SELECT stock, precio
    INTO v_stock, v_precio
    FROM productos
    WHERE id_producto = p_id_producto
    AND activo = TRUE
    FOR UPDATE;

    -- Verificar stock
    IF v_stock < p_cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente';
    END IF;

    SET v_total = v_precio * p_cantidad;

    -- Generar número de pedido
    SET v_numero_pedido = CONCAT(
        'PED-',
        UUID()
    );

    -- Crear pedido
    INSERT INTO pedidos (
        id_cliente,
        numero_pedido,
        estado,
        total,
        direccion_entrega
    )
    VALUES (
        p_id_cliente,
        v_numero_pedido,
        'confirmado',
        v_total,
        p_direccion
    );

    SET v_id_pedido = LAST_INSERT_ID();

    -- Registrar detalle
    INSERT INTO detalle_pedido (
        id_pedido,
        id_producto,
        cantidad,
        precio_unitario
    )
    VALUES (
        v_id_pedido,
        p_id_producto,
        p_cantidad,
        v_precio
    );

    -- Descontar stock
    UPDATE productos
    SET stock = stock - p_cantidad
    WHERE id_producto = p_id_producto;

    COMMIT;

    -- Devolver información de la compra
    SELECT
        v_id_pedido AS id_pedido,
        v_numero_pedido AS numero_pedido,
        v_total AS total,
        'Pedido registrado correctamente' AS mensaje;

END //

DELIMITER ;