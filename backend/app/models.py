from sqlalchemy import Boolean, Column, DateTime, DECIMAL, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class Rol(Base):
    __tablename__ = "roles"

    id_rol = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30), nullable=False, unique=True)
    descripcion = Column(String(150), nullable=True)


class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    id_rol = Column(Integer, ForeignKey("roles.id_rol"), nullable=False)
    nombre = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    activo = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(DateTime, server_default=func.current_timestamp())

    rol = relationship("Rol")


class Categoria(Base):
    __tablename__ = "categorias"

    id_categoria = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(80), nullable=False, unique=True)
    descripcion = Column(String(200), nullable=True)
    activa = Column(Boolean, default=True, nullable=False)


class Producto(Base):
    __tablename__ = "productos"

    id_producto = Column(Integer, primary_key=True, index=True)
    id_categoria = Column(Integer, ForeignKey("categorias.id_categoria"), nullable=False)
    nombre = Column(String(120), nullable=False)
    descripcion = Column(Text, nullable=True)
    sku = Column(String(50), nullable=False, unique=True)
    precio = Column(DECIMAL(12, 2), nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    imagen_url = Column(String(500), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(DateTime, server_default=func.current_timestamp())
    fecha_actualizacion = Column(DateTime, server_default=func.current_timestamp())

    categoria = relationship("Categoria")