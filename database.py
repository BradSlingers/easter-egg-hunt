from sqlalchemy import create_engine

engine = create_engine("sqlite:///eggs.db",echo=True)