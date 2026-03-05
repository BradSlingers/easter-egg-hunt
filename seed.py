import time
from sqlalchemy import text
from database import engine
import bcrypt

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
    hint_1 = "This is the first hint"
    hint_2 = "This is the second hint"
    hint_3 = "This is the third hint"
    hint_4 = "This is the fourth hint"
    hint_5 = "This is the fifth hint"
    # #Remax PropT
    # lat1 = -34.069641296880725    
    # lon1 = 18.56797741281131
    # #OK Mini
    # lat2 = -34.06986281528706  
    # lon2 = 18.568542621337357
    # #Gamzas
    # lat3 = -34.069873707991576 
    # lon3 = 18.567892691816017
    #test 
    #add your test locations here
     
    lat1 = -34.069860126069145  
    lon1 = 18.568539443003324
    lat2 = -34.069860126069145  
    lon2 = 18.568539443003324
    lat3 = -34.069860126069145  
    lon3 = 18.568539443003324
    conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":hint_1,"egg_order":1,"egg_lat":lat1,"egg_lon":lon1,"is_golden":0})
    conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":hint_2,"egg_order":2,"egg_lat":lat2,"egg_lon":lon2,"is_golden":0})
    conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":hint_3,"egg_order":3,"egg_lat":lat3,"egg_lon":lon3,"is_golden":1})
    conn.commit()

with engine.connect() as conn:
    result_users = conn.execute(text("select * from users"))
    result_eggs = conn.execute(text("select * from eggs"))

    for res in result_users:
        print(res)
    for res in result_eggs:
        print(res)