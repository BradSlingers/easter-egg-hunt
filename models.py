#user table
#egg table
#userprogress table
from sqlalchemy import text
from database import engine

with engine.connect() as conn:
    conn.execute(text("""CREATE TABLE if not exists users(
                      ID integer primary key,
                      EMAIL text unique,
                      PASSHASH text,
                      created_at integer)"""))

    conn.execute(text("""CREATE TABLE if not exists eggs(
                      EGG_ID integer primary key,
                      EGG_HINT text,
                      EGG_LAT float, 
                      EGG_LON float, 
                      EGG_ORDER integer,
                      IS_GOLDEN integer)"""))

    conn.execute(text("""CREATE TABLE if not exists user_progress(
                      ID integer primary key,
                      USER_ID integer ,
                      EGG_ID integer ,
                      FOUND_AT integer,
                      FOREIGN key (EGG_ID) REFERENCES eggs(EGG_ID),
                      FOREIGN key(USER_ID) REFERENCES users(ID))"""))
    conn.commit()