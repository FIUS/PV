from difflib import SequenceMatcher
from datetime import datetime, timedelta
import os
from statistics import mode
import TaskScheduler
from flask import helpers
from flask import request
from flask import send_from_directory
from flask.wrappers import Request
from functools import wraps
import authenticator
import util
from web import *
import json
from database import Queries
from flask_restx import fields, Resource, Api
from flask_restx import reqparse
import flask

api_bp = flask.Blueprint("api", __name__, url_prefix="/api/")
api = Api(api_bp, doc='/docu/', base_url='/api')
app.register_blueprint(api_bp)

token_manager = authenticator.TokenManager()

with app.app_context():
    db = Queries.Queries(sql_database)

    taskScheduler = TaskScheduler.TaskScheduler()
    taskScheduler.add_Weekly_Task(db.create_Links)
    taskScheduler.start()


def is_admin():
    return int(request.cookies.get('memberID')) == 1 and token_manager.check_token(request.cookies.get('memberID'), request.cookies.get('token'))


def authenticated(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not token_manager.check_token(request.cookies.get('memberID'), request.cookies.get('token')):
            return util.build_response("Unauthorized", 403)
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


def admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not is_admin():
            return util.build_response("Unauthorized", 403)
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


def is_self_or_admin(request, member_id):
    return str(member_id) == str(request.cookies.get('memberID')) or str(request.cookies.get('memberID')) == "1"


@api.route('/login/check')
class login_Check(Resource):
    @authenticated
    def get(self):
        """
        Check if your login token is valid
        """
        return util.build_response("OK")


@api.route('/login/admin/check')
class login_Check_Admin(Resource):
    @admin
    def get(self):
        """
        Check if your token is a valid admin token
        """
        return util.build_response("OK")


model = api.model('Login', {
    'name': fields.String(description='Name of the user that wants to log in', required=True),
    'password': fields.String(description='Password of the user that wants to log in', required=True)
})


@api.route('/login')
class login(Resource):
    @api.doc(body=model)
    def post(self):
        """
        Get the memberID and token for using the api

        The <b>memberID</b> and <b>token</b> have to be send with every request as cookies
        """
        post_data = request.json
        name = post_data["name"]
        password = post_data["password"]
        member_id = db.checkPassword(name, password)

        if member_id is not None:
            util.log("Login", "User logged in")
            token = token_manager.create_token(member_id)
            return util.build_response("Login successfull", cookieToken=token, cookieMemberID=member_id)
        return util.build_response("Unauthorized", code=403)


@api.route('/cookies')
class cookie(Resource):
    def get(self):
        """
        Get the memberID and token for using the api
        """

        return util.build_response({"memberID": request.cookies.get('memberID'), "token": request.cookies.get('token')})


@api.route('/logout')
class logout(Resource):
    @authenticated
    def post(self):
        """
        Invalidates the current token
        """
        token_manager.delete_token(request.cookies.get('token'))
        util.log("Logout", f"MemberID: {request.cookies.get('memberID')}")
        return util.build_response("OK")


@api.route('/lectures')
class lectures(Resource):
    @authenticated
    def get(self):
        """
        Invalidates the current token
        """
        return util.build_response(db.get_lectures())


@api.route('/alias')
class alias(Resource):
    @admin
    def put(self):
        """
        Invalidates the current token
        """
        return util.build_response(db.add_alias(request.json["lectureID"], request.json["name"]))

    @admin
    def delete(self):
        """
        Invalidates the current token
        """
        return util.build_response(db.remove_alias(request.json["id"]))


@api.route('/person')
class person(Resource):
    @admin
    def put(self):
        """
        Invalidates the current token
        """
        return util.build_response(db.add_person(request.json["lectureID"], request.json["name"]))

    @admin
    def delete(self):
        """
        Invalidates the current token
        """
        return util.build_response(db.remove_person(request.json["id"]))


@api.route('/checkout')
class checkout(Resource):
    @authenticated
    def put(self):
        """
        Invalidates the current token
        """
        return util.build_response(db.create_share(request.json))


@api.route('/share/<string:share>')
class share(Resource):
    def get(self, share):
        """
        Invalidates the current token
        """
        return util.build_response(db.get_share(share))


if __name__ == "__main__":
    if util.logging_enabled:
        app.run("0.0.0.0", threaded=True)
    else:
        from waitress import serve
        serve(app, host="0.0.0.0", port=5000, threads=4)
