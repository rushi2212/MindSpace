from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List
from ..db import get_session
from ..models import Task, TaskCreate, TaskUpdate

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("/{user_id}", response_model=List[Task])
def get_tasks(user_id: str, session=Depends(get_session)):
    tasks = session.exec(select(Task).where(Task.user_id == user_id)).all()
    return tasks


@router.post("", response_model=Task)
def add_task(payload: TaskCreate, session=Depends(get_session)):
    task = Task(title=payload.title, user_id=payload.user_id or None)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.put("/{task_id}", response_model=Task)
def toggle_task(task_id: int, payload: TaskUpdate, session=Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(404, detail="Task not found")
    if payload.title is not None:
        task.title = payload.title
    if payload.completed is not None:
        task.completed = payload.completed
    else:
        task.completed = not task.completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(task_id: int, session=Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"success": True}
