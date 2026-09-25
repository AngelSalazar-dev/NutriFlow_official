from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import uvicorn

app = FastAPI()

# OAuth2 Password Bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database simulation
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    }
}

# Models
from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    full_name: str = None
    disabled: bool = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

# Dependency
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Validate token and get user
    # Placeholder logic here
    return fake_users_db.get("johndoe")

# Auth route
@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not user['hashed_password'] == "fakehashedsecret":
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": user['username'], "token_type": "bearer"}

# Food logging route
@app.post("/log-food/", response_model=str)
async def log_food(food_item: str, current_user: User = Depends(get_current_user)):
    # Log food item - Placeholder return
    return f"Food item '{food_item}' logged for user {current_user.username}"

# Exercise logging route
@app.post("/log-exercise/", response_model=str)
async def log_exercise(exercise_item: str, current_user: User = Depends(get_current_user)):
    # Log exercise item - Placeholder return
    return f"Exercise item '{exercise_item}' logged for user {current_user.username}"

# Run server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)