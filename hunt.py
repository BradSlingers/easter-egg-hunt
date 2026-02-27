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
from auth import get_current_user

router = APIRouter()

@router.get("/hunt/next-hint")
def get_hint(user_email: str = Depends(get_current_user)):
    with engine.connect() as conn:
        find_user_id = conn.execute(text("select id from users where email = :email "),{"email":user_email})
        row = find_user_id.fetchone()
        if row is None:
            return {"message":"no id"}
        user_id = row[0]
        cursor_with_hint = conn.execute(text("""
        select egg_hint, egg_order
        from eggs
        where egg_id not in (select egg_id
        from user_progress
        where user_id = :id)
        order by egg_order
        limit 1
        """),{"id":user_id})
        row_with_hint = cursor_with_hint.fetchone()
        if row_with_hint is None:
            return {"message":"No more hints"}
        return {"hint":row_with_hint[0],"egg":row_with_hint[1]}
        
                 
        
    