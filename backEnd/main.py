from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import func, and_
from sqlalchemy.orm import Session
from database import get_db, engine
import models
from schema import CashFlowBase, CashFlowModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정 - 모든 도메인에서 접근 가능하도록 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 최초 실행시 테이블 생성
models.Base.metadata.create_all(bind=engine)


# API 라우팅 Create
@app.post("/cashbook/", response_model=CashFlowModel)
async def create_cashbook(cashflow: CashFlowBase, db: Session = Depends(get_db)):
    db_cashflow = models.Cashflow(**cashflow.model_dump())
    db.add(db_cashflow)  # insert 실행
    db.commit()
    db.refresh(db_cashflow)
    return db_cashflow


# API 라우팅 Read(목록)
# http://localhost:8000/cashbook/?s=2021-01-01&e=2021-12-31
@app.get("/cashbook/")
async def getCashFlowList(s: str, e: str, db: Session = Depends(get_db)):

    # 전체 레코드에 대한 수입, 지출 합계 - 시작일과 종료일 무관.
    # select sum(income) as totalIncome, sum(outcome) as totalOutcome from cashflow;
    totalSumResult = db.query(
        func.sum(models.Cashflow.income).label("totalIncome"),
        func.sum(models.Cashflow.outcome).label("totalOutcome"),
    ).one()

    # 시작일과 종료일에 대한 수입, 지출 내역
    # 날짜 역순으로 정렬, 그리고 ID 역순으로 정렬
    cashFlows = (
        # select * from cashflow
        # where date >= '2021-01-01' and date <= '2021-12-31'
        # order by date desc, id desc;
        db.query(models.Cashflow)
        .filter(and_(models.Cashflow.date >= s, models.Cashflow.date <= e))
        .order_by(models.Cashflow.date.desc(), models.Cashflow.id.desc())
        .all()
    )
    return {
        "total": {
            "income": totalSumResult.totalIncome,
            "outcome": totalSumResult.totalOutcome,
        },
        "cashFlows": cashFlows,
    }


# API 라우팅 Read(상세)
# http://localhost:8000/cashbook/1
@app.get("/cashbook/{id}", response_model=CashFlowModel or None)
async def getCashFlow(id: int, db: Session = Depends(get_db)):
    # select * from cashflow where id = 1 limit 1;
    cashFlow = db.query(models.Cashflow).filter(models.Cashflow.id == id).first()
    if cashFlow is None:
        raise HTTPException(status_code=404, detail="CashFlow not found")
    return cashFlow


# API 라우팅 Update
@app.put("/cashbook/{id}", response_model=CashFlowModel)
async def updateCashFlow(
    id: int, cashflow: CashFlowBase, db: Session = Depends(get_db)
):
    db_cashflow = (
        db.query(models.Cashflow).filter(models.Cashflow.id == id).one_or_none()
    )

    if db_cashflow is None:
        raise HTTPException(status_code=404, detail="CashFlow not found")

    db_cashflow.date = cashflow.date
    db_cashflow.description = cashflow.description
    db_cashflow.income = cashflow.income
    db_cashflow.outcome = cashflow.outcome
    db.add(db_cashflow)
    db.commit()
    db.flush(db_cashflow)
    return db_cashflow


# API 라우팅 Delete
@app.delete("/cashbook/{id}")
async def deleteCashFlow(id: int, db: Session = Depends(get_db)):
    cashflowModel = (
        db.query(models.Cashflow).filter(models.Cashflow.id == id).one_or_none()
    )
    if cashflowModel is None:
        raise HTTPException(status_code=404, detail="CashFlow not found")

    db.query(models.Cashflow).filter(models.Cashflow.id == id).delete()

    db.commit()

    return {"id": id}
