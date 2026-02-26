import time
from sqlalchemy import text
from database import engine

# with engine.connect() as conn:
#     conn.execute(text("delete from user_progress"))
#     conn.execute(text("delete from eggs"))
#     conn.execute(text("delete from users"))
#     conn.commit()

# with engine.connect() as conn:
#     conn.execute(text("insert into users(email, passhash, created_at) values (:email, :passhash, :created_at)"), {"email":"btsling@gmail.com","passhash":"asd123","created_at":int(time.time())},)
#     conn.commit()

# with engine.connect() as conn:
#     conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":"This is the first hint","egg_order":1,"egg_lat":1.234,"egg_lon":4.321,"is_golden":0})
#     conn.execute(text("insert into eggs(egg_hint, egg_lat, egg_lon, egg_order, is_golden) values(:egg_hint, :egg_lat, :egg_lon, :egg_order, :is_golden)"), {"egg_hint":"This is the second hint","egg_order":2,"egg_lat":5.234,"egg_lon":5.321,"is_golden":0})
#     conn.commit()

with engine.connect() as conn:
    result_users = conn.execute(text("select * from users"))
    result_eggs = conn.execute(text("select * from eggs"))

    for res in result_users:
        print(res)
    for res in result_eggs:
        print(res)