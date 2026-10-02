#The main purpose is to read values from your .env file and make them available to your Python code.

from typing import List
from pydantic_settings import BaseSettings #BaseSettings is what allows Pydantic to automatically read configuration values from environment variables
from pydantic import field_validator #field_validator allows you to modify or validate a value before it is stored in your settings object.

class Settings(BaseSettings):
    API_PREFIX:str = "/api"   #default will be /api
    DEBUG: bool = False

    DATABASE_URL: str

    ALLOWED_ORIGINS: str = ""

    GOOGLE_API_KEY: str

    @field_validator("ALLOWED_ORIGINS")  #This tells Pydantic: "Whenever you receive a value for ALLOWED_ORIGINS, run it through the following function."
    def parse_allowed_origins(cls, v: str) -> List[str]: #cls is settings class and v is value being received
        #You're saying the function will return a list of strings
        return v.split(",") if v else [] #allowed origins is , separated in.env so this separates it into list and if it does not exist it returns an empty string

    class Config:  #special class, "Here are some rules for how you should load my settings."
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings() #This creates an object of your Settings class.