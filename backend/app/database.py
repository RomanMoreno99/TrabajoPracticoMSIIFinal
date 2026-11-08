<<<<<<< HEAD
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings

=======
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import settings


>>>>>>> 411f5e4 (Segundo commit)
engine = create_async_engine(
    settings.database_url,
    echo=False,
    pool_pre_ping=True,
)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with SessionLocal() as session:
<<<<<<< HEAD
        yield session
=======
        yield session
>>>>>>> 411f5e4 (Segundo commit)
