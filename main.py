from fastapi import FastAPI
from sqlalchemy import text
from database import engine
from auth import router as auth_router

app = FastAPI()
app.include_router(auth_router)

@app.get("/")
def home():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 'Easter Egg Hunt is Live'"))
        message = result.scalar()
    return {"message":message}