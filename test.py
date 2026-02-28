import time
from sqlalchemy import text
from database import engine
import bcrypt



with engine.connect() as conn:
    result_users = conn.execute(text("select * from users"))
    result_eggs = conn.execute(text("select * from eggs"))
    result_progress = conn.execute(text("select * from user_progress"))

    for res in result_users:
        print(res)
    for res in result_eggs:
        print(res)
    for res in result_progress:
        print(res)
