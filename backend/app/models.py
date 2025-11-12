from typing import Optional
from sqlmodel import SQLModel, Field


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    completed: bool = False
    user_id: Optional[str] = None


class TaskCreate(SQLModel):
    title: str
    user_id: Optional[str] = None


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
