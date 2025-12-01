import json
import os
from fastapi import APIRouter, HTTPException
from pathlib import Path
from typing import Dict, Any, List
from model.user import User
from config import USERS_FILENAME
from utils.utils import get_user_folder_name
from tqdm import tqdm

router = APIRouter()

DATA_PATH = Path(USERS_FILENAME)

# Load JSON keyed by user_id (strings)
with open(DATA_PATH, "r", encoding="utf-8") as f:
    users_db: Dict[str, dict] = json.load(f)
    for user in tqdm(users_db.values(), "Processing users"):
        folder = get_user_folder_name(User(**user))
        user["files"] = (
            os.listdir(folder)
            if os.path.isdir(folder)
            else []
        )


# ----------------------------- Helpers -----------------------------

def save_users():
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(users_db, f, indent=4)


def get_user_key(user_id: str) -> str:
    return str(user_id)


# ----------------------------- READ -----------------------------

@router.get("/", response_model=List[User])
def get_users():
    return list(users_db.values())


@router.get("/ids", response_model=List[str])
def get_all_user_ids():
    """Return a list of all user IDs."""
    return [uid for uid in users_db.keys()]


@router.get("/{user_id}", response_model=User)
def get_user(user_id: str):
    key = get_user_key(user_id)
    if key not in users_db:
        raise HTTPException(404, "User not found")
    return users_db[key]


@router.get("/{user_id}/data", response_model=Dict[str, Any])
def get_user_extra_data(user_id: str):
    key = get_user_key(user_id)
    if key not in users_db:
        raise HTTPException(404, "User not found")
    return users_db[key].get("extra_data", {}) or {}


# ----------------------------- CUD extra_data only -----------------------------

@router.post("/{user_id}/data", response_model=Dict[str, Any])
def create_extra_data(user_id: str, data: Dict[str, Any]):
    key = get_user_key(user_id)
    if key not in users_db:
        raise HTTPException(404, "User not found")

    if users_db[key].get("extra_data"):
        raise HTTPException(400, "extra_data already exists. Use PUT to update.")

    users_db[key]["extra_data"] = data
    save_users()
    return data


@router.put("/{user_id}/data", response_model=Dict[str, Any])
def update_extra_data(user_id: str, data: Dict[str, Any]):
    key = get_user_key(user_id)
    if key not in users_db:
        raise HTTPException(404, "User not found")

    users_db[key].setdefault("extra_data", {}).update(data)
    save_users()
    return data


@router.delete("/{user_id}/data")
def delete_extra_data(user_id: str):
    key = get_user_key(user_id)
    if key not in users_db:
        raise HTTPException(404, "User not found")

    users_db[key]["extra_data"] = {}
    save_users()
    return {"message": "extra_data deleted"}
