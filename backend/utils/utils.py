from model.user import User
import re
import unicodedata


def get_user_folder_name(user: User):
    folder_name = sanitize_folder_name(f"{user.Nombre} {user.Apellidos}")
    folder_dir = f"./data/user_files/{folder_name}"
    return folder_dir


def sanitize_folder_name(name: str, replace_space_with="_") -> str:
    name = name.strip()
    
    # Normalize Unicode → quita tildes (á → a, ñ → n)
    nfkd = unicodedata.normalize("NFKD", name)
    name = "".join([c for c in nfkd if not unicodedata.combining(c)])

    # Replace spaces
    if replace_space_with is None:
        name = name.replace(" ", "")
    else:
        name = name.replace(" ", replace_space_with)

    # Allowed characters: alphanumeric, "_", "-", "."  
    # (folders allow dots but not at start/end)
    name = re.sub(r"[^A-Za-z0-9._-]", "", name)

    # Replace multiple underscores with one
    name = re.sub(r"_+", "_", name)

    # Strip dots or underscores at start/end
    name = name.strip("._-")

    # Avoid empty names
    if not name:
        name = "folder"

    return name