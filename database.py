import os
from sqlalchemy import create_engine

database_path = os.getenv("DATABASE_PATH", "eggs.db")
engine = create_engine(f"sqlite:///{database_path}", echo=True)