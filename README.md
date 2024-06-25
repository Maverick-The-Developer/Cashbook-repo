# 금전출납부 실습예제
>node v20, python 3.12를 사용하였음.

## frontEnd

vite를 사용하여 생성한 react app
```bash
npm install
npm run dev
```

## backEnd

python 실행 가능 확인 후
```bash
python -m venv ./venv
```
가상환경을 생성 한 후 해당 가상환경을 activate한다.  
```bash
pip install -r requirements.txt
```
필요한 패키지를 설치 한 후
```bash
uvicorn --port 8000 main:app --reload
```
