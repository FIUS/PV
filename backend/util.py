from flask import Response
import json
import os
import datetime
import time
cookie_expire = int(os.environ.get("COOKIE_EXPIRE_TIME")) * \
    60*60 if os.environ.get("COOKIE_EXPIRE_TIME") else 60**3
domain = os.environ.get("DOMAIN") if os.environ.get(
    "DOMAIN") else "127.0.0.1:3000"
logging_enabled = os.environ.get(
    "DEBUG") == "true" if os.environ.get("DEBUG") else False

admin_username = os.environ.get("ADMIN_USERNAME") if os.environ.get(
    "ADMIN_USERNAME") else "admin"
admin_password = os.environ.get("ADMIN_PASSWORD") if os.environ.get(
    "ADMIN_PASSWORD") else "unsafe"

moderator_username = os.environ.get(
    "MOD_USERNAME") if os.environ.get("MOD_USERNAME") else "moderator"
moderator_password = os.environ.get(
    "MOD_PASSWORD") if os.environ.get("MOD_PASSWORD") else "unsafe"

nextcloud_username = os.environ.get(
    "NEXTCLOUD_USERNAME") if os.environ.get("NEXTCLOUD_USERNAME") else None
nextcloud_password = os.environ.get(
    "NEXTCLOUD_PASSWORD") if os.environ.get("NEXTCLOUD_PASSWORD") else None
nextcloud_domain = os.environ.get(
    "NEXTCLOUD_DOMAIN") if os.environ.get("NEXTCLOUD_DOMAIN") else None
nextcloud_path = os.environ.get(
    "NEXTCLOUD_PATH") if os.environ.get("NEXTCLOUD_PATH") else None

tempfile_path = "tempfiles"
backup_file_name = "backup.json"

os.environ['TZ'] = 'Europe/London'
time.tzset()


def build_response(message: object, code: int = 200, type: str = "application/json", cookieMemberID=None, cookieToken=None):
    """
    Build a flask response, default is json format
    """
    r = Response(response=json.dumps(message), status=code, mimetype=type)
    if cookieMemberID and cookieToken:
        r.set_cookie("memberID", str(cookieMemberID),
                     domain=domain, max_age=cookie_expire, samesite='Strict')
        r.set_cookie("token", cookieToken,
                     domain=domain, max_age=cookie_expire, samesite='Strict')

    return r


def log(prefix, message):
    if logging_enabled:
        time = datetime.datetime.now().strftime("%x %X")
        output_string = f"[{time}] {prefix} -> {message}"
        with open("log.txt", 'a+') as f:
            f.write(f"{output_string}\n")
