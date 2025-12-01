from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router as users_router
from routes.driver import router as driver_router

app = FastAPI(
    title="User CRUD API",
    version="1.0"
)

# Enable CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the routers
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(driver_router, prefix="/driver", tags=["Driver"])

@app.get("/")
def root():
    return {"message": "User CRUD API is running"}
