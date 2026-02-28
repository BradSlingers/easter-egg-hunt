from fastapi import FastAPI
from sqlalchemy import text
from database import engine
from auth import router as auth_router
from hunt import router as hunt_router
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

index_html_path = "./static/index.html"

app = FastAPI()
app.include_router(auth_router)
app.include_router(hunt_router)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def home():
    return FileResponse(index_html_path)