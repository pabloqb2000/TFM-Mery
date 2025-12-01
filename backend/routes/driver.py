import json
import os
from fastapi import APIRouter, HTTPException
from pathlib import Path
from typing import Dict, Any, List
from model.user import User
from routes.users import get_user_key, users_db
from utils.utils import get_user_folder_name
from tqdm import tqdm
from pathlib import Path


from selenium import webdriver

router = APIRouter()

driver = webdriver.Firefox()

@router.get("/show_file/{user_id}")
def get_user_file(user_id: str, file_name: str):
    try:
        key = get_user_key(user_id)
        if key not in users_db:
            raise HTTPException(404, "User not found")
        folder = get_user_folder_name(User(**users_db[key]))
        
        file_path = Path(f"{folder}/{file_name}").resolve()
        url = f"file:///{file_path}"
        url = url.replace('\\\\', '/')
        driver.get(url)
        return {"ok": True}
    except Exception:
        return {"ok": False}

@router.get("/clear")
def get_user_file():
    try:
        driver.get("about:blank")
        return {"ok": True}
    except Exception:
        return {"ok": False}
