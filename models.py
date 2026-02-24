#user table
#egg table
#userprogress table
from sqlalchemy import text
from database import engine

with engine.connect() as conn:
    conn.execute(text("CREATE TABLE if not exists users(id integer primary key, email text unique, passhash text, created_at integer)"))
    conn.execute(text("CREATE TABLE if not exists eggs(egg_id integer primary key, egg_hint text, egg_lat float, egg_lon float, egg_order integer, is_golden integer)"))
    conn.execute(text("CREATE TABLE if not exists user_progress(id integer primary key, user_id integer , egg_id integer , found_at integer,foreign key (egg_id) references eggs(egg_id), foreign key(user_id) references users(id))"))
    conn.commit()