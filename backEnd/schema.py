from pydantic import BaseModel, Field

class CashFlowBase(BaseModel):
    date: str
    description: str
    income: int
    outcome: int

class CashFlowModel(CashFlowBase):
    id: int
    # date: str
    # description: str
    # income: int
    # outcome: int
