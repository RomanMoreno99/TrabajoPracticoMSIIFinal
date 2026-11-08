from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class UsuarioOut(BaseModel):
    id_usuario: int
    id_rol: int
    nombre: str
    email: str
    activo: bool

    class Config:
        from_attributes = True


class CategoriaCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=80)
    descripcion: Optional[str] = None
    activa: bool = True


class CategoriaOut(CategoriaCreate):
    id_categoria: int

    class Config:
        from_attributes = True


class ProductoCreate(BaseModel):
    id_categoria: int
    nombre: str = Field(..., min_length=2, max_length=120)
    descripcion: Optional[str] = None
    sku: str = Field(..., min_length=3, max_length=50)
    precio: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    imagen_url: Optional[str] = None
    activo: bool = True


class ProductoUpdate(BaseModel):
    id_categoria: Optional[int] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    sku: Optional[str] = None
    precio: Optional[float] = None
    stock: Optional[int] = None
    imagen_url: Optional[str] = None
    activo: Optional[bool] = None


class ProductoOut(ProductoCreate):
    id_producto: int

    class Config:
        from_attributes = True