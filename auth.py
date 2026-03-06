import os
from dotenv import load_dotenv
from fastapi import APIRouter
from typing import Annotated
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from fastapi import HTTPException
from pydantic import BaseModel
import bcrypt
from database import engine
import time
from sqlalchemy import text
from jose import jwt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
print(SECRET_KEY)
class User(BaseModel):
    email : str
    password : str

router = APIRouter()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Validate token here
    try:
        return decode_token(credentials.credentials)
    except:
        raise HTTPException(status_code=403, detail="Invalid token")

def create_token(user_email):
    token = jwt.encode({'sub': user_email}, SECRET_KEY, algorithm='HS256')
    return token 

def decode_token(token):
    mail = jwt.decode(token, SECRET_KEY,algorithms=['HS256'])
    return mail['sub']

# @router.get("/")
# def home():
#     return {"message":"Hey, whats up?"}

@router.post("/auth/signup")
async def sign_up(user: User):
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    mail = user.email
    with engine.connect() as conn:
        try:
            conn.execute(text("insert into users(email, passhash, created_at) values (:email, :passhash, :created_at)"), {"email":mail,"passhash":hashed,"created_at":int(time.time())})
        except:
            raise HTTPException(status_code=400, detail="Email already registered")
        conn.commit()
    return create_token(mail) 

@router.post("/auth/login")
async def login(user: User):
    mail = user.email
    pword = user.password.encode('utf-8')
    ph = ""
    with engine.connect() as conn:
        check_passhash = conn.execute(text("select passhash from users where email = :email"),{"email":mail})
        row = check_passhash.fetchone()
        if row is None:
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        ph = row[0]
        if not bcrypt.checkpw(pword, ph.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        return create_token(mail)
@router.get("/auth/me")
def me(user_email: str = Depends(get_current_user)):
    return {"email": user_email}
