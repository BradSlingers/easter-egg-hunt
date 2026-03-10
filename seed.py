import os
from dotenv import load_dotenv
import time
from sqlalchemy import text
from database import engine
import bcrypt

load_dotenv()

LAT_1 = os.getenv("LAT_1")
LON_1 = os.getenv("LON_1")
LAT_2 = os.getenv("LAT_2")
LON_2 = os.getenv("LON_2")
LAT_3 = os.getenv("LAT_3")
LON_3 = os.getenv("LON_3")
LAT_4 = os.getenv("LAT_4")
LON_4 = os.getenv("LON_4")
LAT_5 = os.getenv("LAT_5")
LON_5 = os.getenv("LON_5")

with engine.connect() as conn:
    conn.execute(text("delete from user_progress"))
    conn.execute(text("delete from eggs"))
    conn.execute(text("delete from users"))
    conn.commit()

with engine.connect() as conn:
    mail = "string"
    password = "string"

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    conn.execute(text("insert into users(email, passhash, created_at) values (:email, :passhash, :created_at)"), {"email":mail,"passhash":hashed,"created_at":int(time.time())},)
    conn.commit()

with engine.connect() as conn:
    hint_1 = "Every curry, bredie and braai starts at this shop. The meat is not at the 'Bottom', it's at the ___. Find the first egg before your next stop!"
    hint_2 = "Pencils, pens, glue and a book, the second egg is at this next shop, go have a look!"
    hint_3 = "Between the books and shelves, the third egg is hinding quietly by itself. Knowledge is free at this place. Reading will put a smile on your face"
    hint_4 = "Your fourth egg is waitng where the chicken meets the flame and the spice is never tame. Grab a bite and your tongue will never be the same."
    hint_5 = "I scream, you scream, we all scream for... Your final egg is at the shop where Everyday they do what they do best — grab it now and finish your quest!"
     
    lat1 = LAT_1
    lon1 = LON_1
    lat2 = LAT_2
    lon2 = LON_2
    lat3 = LAT_3
    lon3 = LON_3
    lat4 = LAT_4
    lon4 = LON_4
    lat5 = LAT_5
    lon5 = LON_5
    conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":hint_1,"egg_order":1,"egg_lat":lat1,"egg_lon":lon1,"is_golden":0})
    conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":hint_2,"egg_order":2,"egg_lat":lat2,"egg_lon":lon2,"is_golden":0})
    conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":hint_3,"egg_order":3,"egg_lat":lat3,"egg_lon":lon3,"is_golden":0})
    conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":hint_4,"egg_order":4,"egg_lat":lat4,"egg_lon":lon4,"is_golden":0})
    conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":hint_5,"egg_order":5,"egg_lat":lat5,"egg_lon":lon5,"is_golden":1})
    conn.commit()

with engine.connect() as conn:
    result_users = conn.execute(text("select * from users"))
    result_eggs = conn.execute(text("select * from eggs"))

    for res in result_users:
        print(res)
    for res in result_eggs:
        print(res)