from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.database import engine


app = FastAPI(
    title="Ecommerce API",
    description="API para el trabajo práctico de Metodología de Sistemas II",
    version="1.0.0",
)


@app.get("/")
async def home():
    return {"mensaje": "Ecommerce API funcionando"}


@app.get("/health/db")
async def check_database():
    try:
        async with engine.connect() as connection:
            result = await connection.execute(text("SELECT 1"))
            value = result.scalar_one()

        return {
            "database": "conectada",
            "resultado_prueba": value,
        }
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=503,
            detail="No se pudo conectar con MySQL. Revisa la configuración.",
        ) from error