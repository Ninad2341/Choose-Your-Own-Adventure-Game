from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routers import story, job
from db.database import create_tables

create_tables()

app = FastAPI(
    title="Choose your own adventure game api",
    description="api to generate cool stories",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins= settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(story.router, prefix=settings.API_PREFIX)   #story.router means: "Give me the router that I created inside story.py."
# this creates /api/stories/create  api from env, stories from story.py and create from @router.post
app.include_router(job.router, prefix=settings.API_PREFIX)

if __name__ == "__main__":  #if we directly run this python file it will run , if its imported it will not run
    import uvicorn
    uvicorn.run("main:app",host="0.0.0.0",port=8000,reload=True)