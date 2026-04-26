from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import solar_routes, ml_routes, dashboard_routes
from services.dummy_data_generator import DummyDataGenerator
import asyncio
import contextlib

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Start dummy data generator
    generator = DummyDataGenerator()
    task = asyncio.create_task(generator.generate_panel_data())
    yield
    # Cleanup
    task.cancel()
    with contextlib.suppress(asyncio.CancelledError):
        await task

app = FastAPI(
    title="Smart Solar Monitoring API",
    description="API for solar panel monitoring and fault detection",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(solar_routes.router, prefix="/api/solar", tags=["Solar"])
app.include_router(ml_routes.router, prefix="/api/ml", tags=["ML"])
app.include_router(dashboard_routes.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
async def root():
    return {"message": "Smart Solar Monitoring System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
