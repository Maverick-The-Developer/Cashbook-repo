from sqlalchemy import Column, Integer, String
from database import Base


class Cashflow(Base):
  __tablename__ = 'cashflow'
  id = Column(Integer, primary_key=True, index=True, autoincrement=True)
  date = Column(String)
  description = Column(String)
  income = Column(Integer)
  outcome = Column(Integer)
