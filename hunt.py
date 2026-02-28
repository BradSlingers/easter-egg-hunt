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
import time

class Coordinates(BaseModel):
    latitude : float
    longitude : float

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
        
@router.post("/hunt/check-location")
def check_location(user_coord:Coordinates,user_email: str = Depends(get_current_user)):
    with engine.connect() as conn:
        find_user_id = conn.execute(text("select id from users where email = :email "),{"email":user_email})
        row = find_user_id.fetchone()
        if row is None:
            return {"message":"no id"}
        user_id = row[0]
        cursor_with_hint = conn.execute(text("""
        select egg_lat, egg_lon, egg_id 
        from eggs
        where egg_id not in (select egg_id
        from user_progress
        where user_id = :id)
        order by egg_order
        limit 1
        """),{"id":user_id})
        row_with_hint = cursor_with_hint.fetchone()
        if row_with_hint is None:
            return {"message":"No lat,lon and id"}
        egg_lat = row_with_hint[0]
        egg_lon = row_with_hint[1]
        egg_id = row_with_hint[2]
        user_lat = user_coord.latitude
        user_lon = user_coord.longitude
        #Haversine to go here
        if egg_lat == user_lat and egg_lon == user_lon:
            conn.execute(text("""
                              insert into user_progress(user_id,egg_id,found_at) 
                              values(:user_id,:egg_id,:found_at)
                              """),
                              {"user_id":user_id,"egg_id":egg_id,"found_at":int(time.time())})        
            conn.commit()
            return {"message":"You have found an egg!"}
        return {"message":"No egg found. Try again"}

@router.get("/hunt/progress")
def get_progress(user_email: str = Depends(get_current_user)):
    found_egg_list = []
    with engine.connect() as conn:
        find_user_id = conn.execute(text("""
                                         select id 
                                         from users 
                                         where email = :email 
                                         """),{"email":user_email})
        row = find_user_id.fetchone()
        if row is None:
            return {"message":"no id"}
        user_id = row[0]

        row_cursor = conn.execute(text("""
                                    select egg_order
                                    from eggs
                                    where egg_id in(
                                    select egg_id
                                    from user_progress
                                    where user_id = :id)"""),{"id":user_id})
        row_actual = row_cursor.fetchall()
        if not row_actual:
            return {"message":"No progress.Go Hunt!"}
        for r in row_actual:
            found_egg_list.append(r[0])
        number_of_eggs = len(row_actual)
        return {"message":f"Found {number_of_eggs}/6 eggs. The eggs are {found_egg_list}"}

        
    