import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "DiagramMaker AI Service"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "AI microservice powered by Groq for the Diagram Generator"
    
    # API Keys
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")

settings = Settings()
