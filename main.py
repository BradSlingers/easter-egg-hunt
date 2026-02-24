from fastapi import FastAPI
from sqlalchemy import text
from database import engine

app = FastAPI()

@app.get("/")
def home():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 'Easter Egg Hunt is Live'"))
        message = result.scalar()
    return {"message":message}