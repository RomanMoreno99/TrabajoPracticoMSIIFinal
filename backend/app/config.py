from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class Settings(BaseSettings):
    db_user: str = "admin@ecommerce.com"
    db_password: str = "admin123"
    db_host: str = "127.0.0.1"
    db_port: int = 3300
    db_name: str = "ecommerce_db"

    jwt_secret_key: str = "mi_clave_super_secreta_123456"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    @property
    def database_url(self) -> URL:
        return URL.create(
            drivername="mysql+asyncmy",
            username=self.db_user,
            password=self.db_password,
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
        )


settings = Settings()