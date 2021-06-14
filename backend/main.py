from flask import Flask
from flask import request
from flask_cors import CORS
from NextcloudWrapper import NextcloudWrapper
import time
import util
import os

app = Flask(__name__)
CORS(app)

lecture_cache = None
wr = NextcloudWrapper(os.environ.get("url"),
                      os.environ.get("username"), os.environ.get("password"), os.environ.get("path"))


@app.route('/refresh/cache', methods=["POST"])
def refresh_cache():
    global lecture_cache
    lecture_cache = wr.get_lectures()

    return util.build_response("OK")


@app.route('/lectures', methods=["GET"])
def get_lectures():
    global lecture_cache
    #print(request.cookies.get('token'))
    if lecture_cache:
        return util.build_response(lecture_cache)
    else:
        lecture_cache = wr.get_lectures()
        return util.build_response(lecture_cache)


@app.route('/create/token', methods=["POST"])
def createToken():
    # request.headers.get('token')
    post_data = request.json
    if post_data["password"]=="blablabla":
        return util.build_response("OK",200,cookie=["token","ldfukhsldfkugh"])
    else:
        return util.build_response("Unauthorized",403)

@app.route('/create/qr', methods=["POST"])
def createQr():
    # request.headers.get('token')
    global lecture_cache
    print(request.json)
    id=request.json[0]
    if lecture_cache is None:
        lecture_cache = wr.get_lectures()
    link=wr.link_from_server(lecture_cache[id]["folder"])
    return util.build_response({"url":link})


app.run("0.0.0.0")
