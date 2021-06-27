from flask import Flask
from flask import request
from flask_cors import CORS
from NextcloudWrapper import NextcloudWrapper
from functools import wraps
import authenticator
import time
import util
import os
import secrets
import string

app = Flask(__name__)
CORS(app, supports_credentials=True)

lecture_cache = None
wr = NextcloudWrapper(os.environ.get("url"),
                      os.environ.get("username"), os.environ.get("password"), os.environ.get("path"))
link_cache = dict()
token_manager = authenticator.TokenManager()


def authenticated(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not token_manager.check_token(request.cookies.get('token')):
            return util.build_response("Unauthorized", 403)
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


@app.route('/refresh/cache', methods=["POST"])
@authenticated
def refresh_cache():
    global lecture_cache
    lecture_cache = wr.get_lectures()

    return util.build_response("OK")


@app.route('/lectures', methods=["GET"])
@authenticated
def get_lectures():
    global lecture_cache
    if lecture_cache:
        return util.build_response(lecture_cache)
    else:
        lecture_cache = wr.get_lectures()
        return util.build_response(lecture_cache)


@app.route('/links', methods=["GET"])
def get_links():
    print(request.args["code"])
    return util.build_response(link_cache[request.args["code"]])


@app.route('/create/token', methods=["POST"])
def createToken():
    post_data = request.json
    if post_data["password"] == authenticator.password:
        new_token = token_manager.create_token()
        return util.build_response("OK", 200, cookie=["token", new_token])
    else:
        return util.build_response("Unauthorized", 403)


@app.route('/logout', methods=["POST"])
@authenticated
def logout():
    token_manager.delete_token()
    return util.build_response("OK")


@app.route('/authenticated', methods=["GET"])
@authenticated
def is_authenticated():
    return util.build_response("OK")


@app.route('/create/qr', methods=["POST"])
@authenticated
def createQr():
    global lecture_cache
    print(request.json)
    if lecture_cache is None:
        lecture_cache = wr.get_lectures()
    links = list()
    for id in request.json:
        link = wr.link_from_server(lecture_cache[id]["folder"])
        print("Link generated:", link)
        links.append([lecture_cache[id]["name"], link])
    secret = ""
    for i in range(12):
        secret += string.ascii_letters[secrets.randbelow(52)]
    link_cache[secret] = links
    return util.build_response({"url": "https://info.pv.fg-inf.de/"+secret, "secret": secret})


app.run("0.0.0.0")
