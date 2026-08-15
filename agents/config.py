import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    demo_mode: bool = True
    gemini_api_key: str = ""
    openai_api_key: str = ""
    port: int = 8000
    database_url: str = "postgresql://career_user:career_secret_change_in_prod@localhost:5432/career_db"
    backend_url: str = "http://localhost:5000"
    allowed_origins: str = "http://localhost:5173,http://localhost:5000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def active_provider(self) -> str:
        if self.demo_mode:
            return "demo"
        if self.gemini_api_key:
            return "gemini"
        if self.openai_api_key:
            return "openai"
        return "demo"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

settings = Settings()
