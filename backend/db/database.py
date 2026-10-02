from sqlalchemy import create_engine  #create_engine() creates the connection interface between your Python application and the database.
from sqlalchemy.orm import sessionmaker  #A session represents a working conversation with the database.
from sqlalchemy.ext.declarative import declarative_base  #This creates the base class that your database models will inherit from.

from core.config import settings

engine = create_engine(
    settings.DATABASE_URL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  #Sessions created by this factory should communicate with this database engine."

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)  #Create the database tables represented by my Base models if they don't already exist."