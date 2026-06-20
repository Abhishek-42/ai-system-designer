import os
from dotenv import load_dotenv

# Construct the absolute path to backend/.env
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(backend_dir, ".env")

# Load environment variables from .env file explicitly
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "DiagramMaker AI Service"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "AI microservice powered by Groq for the Diagram Generator"
    
    # API Keys
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")

settings = Settings()
