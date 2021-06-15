from flask import Response
import json


def build_response(message: object, code: int = 200, type: str = "application/json",cookie=None):
    """
    Build a flask response, default is json format
    """
    r=Response(response=json.dumps(message), status=code, mimetype=type)
    if cookie:
        r.set_cookie(cookie[0],cookie[1],domain="pv.fg-inf.de")
    return r
