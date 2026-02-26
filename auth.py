from fastapi import APIRouter
from pydantic import BaseModel
import bcrypt
from database import engine
import time
from sqlalchemy import text
from jose import jwt
#to be moved to env
SECRET_KEY = "my-secret-key"
class User(BaseModel):
    email : str
    password : str

router = APIRouter()

def create_token(user_email):
    token = jwt.encode({'sub': user_email}, SECRET_KEY, algorithm='HS256')
    return token 

def decode_token(token):
    mail = jwt.decode(token, SECRET_KEY,algorithms=['HS256'])
    return mail['sub']

@router.get("/")
def home():
    return {"message":"Hey, whats up?"}

@router.post("/auth/signup")
async def sign_up(user: User):
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    mail = user.email
    with engine.connect() as conn:
        conn.execute(text("insert into users(email, passhash, created_at) values (:email, :passhash, :created_at)"), {"email":mail,"passhash":hashed,"created_at":int(time.time())})
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
            return {"message":"incorrect email or password"}
        ph = row[0]
        if bcrypt.checkpw(pword,ph.encode('utf-8')):
            return create_token(mail)
    return {"message":"incorrect email or password"} 
