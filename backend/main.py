from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router  

app = FastAPI(title="WebOSINT Backend", version="1.0.0")

# Разрешаем CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутер авторизации
app.include_router(router)  

@app.get("/")
async def root():
    return {"message": "WebOSINT API работает!"}

@app.get("/api/search")
async def search(query: str):
    return {
        "query": query,
        "status": "search started",
        "message": "ИИ-агент ищет информацию..."
    }

@app.get("/api/status/{task_id}")
async def get_status(task_id: str):
    return {
        "task_id": task_id,
        "status": "processing",
        "progress": 50
    }