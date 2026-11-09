from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import router as auth_router
from app.crud import (
    create_producto,
    delete_producto,
    get_producto_by_id,
    get_productos,
    update_producto,
)
from app.database import get_db
from app.models import Categoria, Producto, Usuario
from app.schemas import (
    CategoriaCreate,
    CategoriaOut,
    ProductoCreate,
    ProductoOut,
    ProductoUpdate,
)
from app.security import get_current_user

app = FastAPI(
    title="Ecommerce API",
    version="1.0.0",
    description="API de e-commerce con FastAPI + MySQL + JWT",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/")
async def root():
    return {"mensaje": "Ecommerce API funcionando"}


@app.get("/health/db")
async def health_db(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(1))
        value = result.scalar_one()
        return {
            "database": "conectada",
            "resultado_prueba": value,
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"No se pudo conectar con MySQL: {str(e)}",
        )


@app.get("/auth/me", response_model=dict)
async def get_me(current_user: Usuario = Depends(get_current_user)):
    return {
        "id_usuario": current_user.id_usuario,
        "nombre": current_user.nombre,
        "email": current_user.email,
    }


@app.get("/categorias", response_model=list[CategoriaOut])
async def listar_categorias(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Categoria))
    categorias = result.scalars().all()
    return categorias


@app.post("/categorias", response_model=CategoriaOut)
async def crear_categoria(
    categoria: CategoriaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    nueva = Categoria(
        nombre=categoria.nombre,
        descripcion=categoria.descripcion,
        activa=categoria.activa,
    )
    db.add(nueva)
    await db.commit()
    await db.refresh(nueva)
    return nueva


@app.get("/productos", response_model=list[ProductoOut])
async def listar_productos(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    productos = await get_productos(db)
    return productos


@app.get("/productos/{producto_id}", response_model=ProductoOut)
async def obtener_producto(
    producto_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    producto = await get_producto_by_id(db, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@app.post("/productos", response_model=ProductoOut)
async def crear_producto_endpoint(
    producto: ProductoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return await create_producto(db, producto)


@app.put("/productos/{producto_id}", response_model=ProductoOut)
async def actualizar_producto_endpoint(
    producto_id: int,
    producto: ProductoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    actualizado = await update_producto(db, producto_id, producto)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return actualizado


@app.delete("/productos/{producto_id}")
async def eliminar_producto_endpoint(
    producto_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    eliminado = await delete_producto(db, producto_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"mensaje": "Producto eliminado correctamente"}


@app.get("/reportes/productos-categoria")
async def productos_con_categoria(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    stmt = (
        select(
            Producto.id_producto,
            Producto.nombre.label("producto"),
            Producto.precio,
            Producto.stock,
            Categoria.nombre.label("categoria"),
        )
        .join(Categoria, Producto.id_categoria == Categoria.id_categoria)
    )
    result = await db.execute(stmt)
    return result.mappings().all()