from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginData(BaseModel):
    username: str
    password: str

users_db = {
    "admin": "12345",
    "user": "password"
}

@router.post("/login")
async def login(data: LoginData):
    if data.username in users_db and users_db[data.username] == data.password:
        return {
            "success": True,
            "message": "Login successful",
            "redirect": "/dashboard.html"
        }
    else:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
