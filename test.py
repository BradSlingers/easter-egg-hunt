import time
from sqlalchemy import text
from database import engine
import bcrypt
from math import radians, cos, sin, asin, sqrt



# with engine.connect() as conn:
#     result_users = conn.execute(text("select * from users"))
#     result_eggs = conn.execute(text("select * from eggs"))
#     result_progress = conn.execute(text("select * from user_progress"))

#     for res in result_users:
#         print(res)
#     for res in result_eggs:
#         print(res)
#     for res in result_progress:
#         print(res)
actual_loc = [-34.069641296880725,18.56797741281131]
user_loc = [-34.06957206212584, 18.568083233453983]
lon1 = actual_loc[0]
lat1 = actual_loc[1]
lon2 = user_loc[0]
lat2 = user_loc[1]
def haversine(lons1, lats1, lons2, lats2):
    # Convert decimal degrees to radians
    lons1, lats1, lons2, lats2 = map(radians, [lons1, lats1, lons2, lats2])
    
    # Haversine formula
    dlon, dlat = lons2 - lons1, lats2 - lats1
    a = sin(dlat/2)**2 + cos(lats1) * cos(lats2) * sin(dlon/2)**2
    print( (2 * asin(sqrt(a)) * 6371) * 1000)# 6371 km radius

haversine(lon1, lat1, lon2, lat2)