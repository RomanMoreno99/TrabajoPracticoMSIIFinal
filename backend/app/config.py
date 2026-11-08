from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class Settings(BaseSettings):
    db_user: str
    db_password: str
    db_host: str = "127.0.0.1"
    db_port: int = 3306
    db_name: str = "ecommerce_db"

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