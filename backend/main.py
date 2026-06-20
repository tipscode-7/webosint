import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, EmailStr, Field
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import uvicorn

load_dotenv()

# --- Конфигурация ---
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./osint.db")

# --- База данных ---
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Модель пользователя ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    subscription_type = Column(String, default="free")  # free, 1d, 1w, 1m, 1y, inf, admin
    subscription_until = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# --- Хеширование паролей ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- JWT ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(lambda: SessionLocal())):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# --- Pydantic схемы ---
class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    id: int
    email: str
    username: str
    subscription_type: str
    subscription_until: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class SubscriptionUpdate(BaseModel):
    plan: str  # free, 1d, 1w, 1m, 1y, inf

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class SearchRequest(BaseModel):
    fields: dict  # ключ-значение из полей поиска

# --- FastAPI приложение ---
app = FastAPI(title="ACRONIC Backend", version="1.0.0")

# CORS (разрешаем всё для разработки)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Эндпоинты ---
@app.get("/")
async def root():
    return {"message": "ACRONIC API работает"}

@app.post("/api/register", response_model=UserOut, status_code=201)
async def register(user_data: UserCreate, db: Session = Depends(lambda: SessionLocal())):
    existing = db.query(User).filter((User.email == user_data.email) | (User.username == user_data.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email или username уже зарегистрированы")
    hashed = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed,
        subscription_type="free",
        subscription_until=None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(lambda: SessionLocal())):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Пользователь заблокирован")
    access = create_access_token(data={"sub": str(user.id)})
    refresh = create_refresh_token(data={"sub": str(user.id)})
    return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}

@app.post("/api/token/refresh", response_model=Token)
async def refresh_token(refresh_token: str = Depends(oauth2_scheme), db: Session = Depends(lambda: SessionLocal())):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    new_access = create_access_token(data={"sub": str(user.id)})
    new_refresh = create_refresh_token(data={"sub": str(user.id)})
    return {"access_token": new_access, "refresh_token": new_refresh, "token_type": "bearer"}

@app.get("/api/profile", response_model=UserOut)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/api/subscribe", response_model=UserOut)
async def update_subscription(sub_data: SubscriptionUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(lambda: SessionLocal())):
    plan = sub_data.plan
    durations = {
        "1d": timedelta(days=1),
        "1w": timedelta(days=7),
        "1m": timedelta(days=30),
        "1y": timedelta(days=365),
        "inf": timedelta(days=365*100)
    }
    if plan == "free":
        current_user.subscription_type = "free"
        current_user.subscription_until = None
    elif plan in durations:
        current_user.subscription_type = plan
        now = datetime.utcnow()
        if current_user.subscription_until and current_user.subscription_until > now:
            current_user.subscription_until = current_user.subscription_until + durations[plan]
        else:
            current_user.subscription_until = now + durations[plan]
    elif plan == "admin":
        current_user.subscription_type = "admin"
        current_user.subscription_until = None
    else:
        raise HTTPException(status_code=400, detail="Неверный тариф")
    db.commit()
    db.refresh(current_user)
    return current_user

@app.post("/api/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    # В реальном проекте отправить письмо со ссылкой сброса
    return {"message": "Инструкция отправлена, если email зарегистрирован"}

@app.post("/api/search")
async def search(request: SearchRequest, current_user: User = Depends(get_current_user)):
    # Заглушка: возвращаем список полей
    results = []
    for key, value in request.fields.items():
        if value and value.strip():
            results.append({
                "field": key,
                "value": value,
                "found": [{"source": "example.com", "data": f"Sample data for {key}: {value}"}]
            })
    return {"results": results}

# --- Запуск (для разработки) ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)