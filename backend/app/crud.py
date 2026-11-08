from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Categoria, Producto
from app.schemas import ProductoCreate, ProductoUpdate


async def get_productos(db: AsyncSession, activo: Optional[bool] = None):
    stmt = select(Producto)
    if activo is not None:
        stmt = stmt.where(Producto.activo == activo)
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_producto_by_id(db: AsyncSession, producto_id: int):
    stmt = select(Producto).where(Producto.id_producto == producto_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_producto(db: AsyncSession, producto: ProductoCreate):
    nuevo = Producto(
        id_categoria=producto.id_categoria,
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        sku=producto.sku,
        precio=producto.precio,
        stock=producto.stock,
        imagen_url=producto.imagen_url,
        activo=producto.activo,
    )
    db.add(nuevo)
    await db.commit()
    await db.refresh(nuevo)
    return nuevo


async def update_producto(db: AsyncSession, producto_id: int, producto: ProductoUpdate):
    actual = await get_producto_by_id(db, producto_id)
    if not actual:
        return None

    for field, value in producto.model_dump(exclude_unset=True).items():
        setattr(actual, field, value)

    await db.commit()
    await db.refresh(actual)
    return actual


async def delete_producto(db: AsyncSession, producto_id: int):
    actual = await get_producto_by_id(db, producto_id)
    if not actual:
        return False

    await db.delete(actual)
    await db.commit()
    return True


async def get_categorias(db: AsyncSession):
    result = await db.execute(select(Categoria))
    return result.scalars().all()