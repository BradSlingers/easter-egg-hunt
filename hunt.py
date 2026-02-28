from fastapi import APIRouter
from math import radians, cos, sin, asin, sqrt
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

# Calculate great circle distance in km
def haversine(lon1, lat1, lon2, lat2):
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula
    dlon, dlat = lon2 - lon1, lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    return (2 * asin(sqrt(a)) * 6371) * 1000# 6371 km radius

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
            return {"message":"There are no more hints. You have found all the Eggs!"}
        return {"hint":row_with_hint[0],"egg":row_with_hint[1]}
        
@router.post("/hunt/check-location")
def check_location(user_coord:Coordinates,user_email: str = Depends(get_current_user)):
    with engine.connect() as conn:
        find_user_id = conn.execute(text("select id from users where email = :email "),{"email":user_email})
        row = find_user_id.fetchone()
        if row is None:
            raise HTTPException(status_code=500, detail="User not found in database")
        user_id = row[0]
        cursor_with_hint = conn.execute(text("""
        select egg_lat, egg_lon, egg_id,is_golden
        from eggs
        where egg_id not in (select egg_id
        from user_progress
        where user_id = :id)
        order by egg_order
        limit 1
        """),{"id":user_id})
        row_with_hint = cursor_with_hint.fetchone()
        if row_with_hint is None:
            return {"message":"Hunt Complete! You've found all the Eggs!"}
        egg_lat = row_with_hint[0]
        egg_lon = row_with_hint[1]
        egg_id = row_with_hint[2]
        egg_golden = row_with_hint[3]
        user_lat = user_coord.latitude
        user_lon = user_coord.longitude
        #Haversine to go here
        haversine_dist = haversine(egg_lat,egg_lon,user_lat,user_lon)
        if haversine_dist <= 20:
            conn.execute(text("""
                              insert into user_progress(user_id,egg_id,found_at) 
                              values(:user_id,:egg_id,:found_at)
                              """),
                              {"user_id":user_id,"egg_id":egg_id,"found_at":int(time.time())})        
            conn.commit()
            if egg_golden == 1:
                return {"message":"You have found the GOLDEN EGG!!!"}
            return {"message":f"You have found an egg! haversine = {haversine_dist} .egg lat = {egg_lat},  egg lon = {egg_lon}"}
        return {"message":f"No egg found. Try again. haversine = {haversine_dist} egg lat = {egg_lat},  egg lon = {egg_lon}"}

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
            raise HTTPException(status_code=500, detail="User not found in database")
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
        total = conn.execute(text("SELECT COUNT(*) FROM eggs")).fetchone()[0]
        if number_of_eggs == total:
            return {"message":"You have found all the Eggs!"}
        return {"message":f"Found {number_of_eggs}/{total} eggs. The eggs are {found_egg_list}"}

        
    