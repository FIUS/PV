import json
from operator import truediv
from unicodedata import name
import requests
from authenticator import TokenManager
import util
from datetime import datetime, timedelta
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import session
from sqlalchemy.sql import func
from database.Models import *
from sqlalchemy import desc
from typing import List
import constants
import os
from Nextcloud import Nextcloud
from database.Link import Link
from database.Share import Share
import secrets
import time


class Queries:
    def __init__(self, db):
        self.nc = Nextcloud(util.nextcloud_domain, util.nextcloud_username,
                            util.nextcloud_password)
        self.base_folder = util.nextcloud_path
        self.db: SQLAlchemy = db
        self.session: session.Session = self.db.session
        self.db.create_all()
        self.session.commit()

        self.create_dummy_data()

    def create_dummy_data(self) -> None:
        if self.session.query(Member).first() is None:
            hashedPassword, salt = TokenManager.hashPassword(
                util.admin_password)
            self.session.add(
                Member(name=util.admin_username, password=hashedPassword, salt=salt))
            hashedPassword, salt = TokenManager.hashPassword(
                util.moderator_password)
            self.session.add(
                Member(name=util.moderator_username, password=hashedPassword, salt=salt))
            self.session.commit()

        self.create_Links()

    def create_Links(self) -> None:
        error_occured = True
        while error_occured:
            error_occured = False
            try:
                folders = self.nc.list_subfolders(self.base_folder)

                for folder in folders:
                    db_result: Lecture = self.session.query(
                        Lecture).filter_by(name=folder).first()
                    folder_path = f"{self.base_folder}/{folder}"
                    link = self.nc.create_link(folder_path)
                    if db_result is None:

                        new_Lecture = Lecture(name=folder, folder=folder_path,
                                              link=link["link"], valid_until=link["valid_until"])
                        self.session.add(new_Lecture)
                    else:
                        db_result.link = link["link"]
                        db_result.valid_until = link["valid_until"]

                    self.session.commit()
                all_Lectures: List[Lecture] = self.session.query(Lecture).all()

                for lecture in all_Lectures:
                    if lecture.name not in folders:
                        lecture.link = None
                        lecture.valid_until = None
            except:
                error_occured = True
                print("Error while creating links")
                time.sleep(60*10)

    def create_share(self, lecture_ids):
        share: Share = Share(secret=secrets.token_urlsafe(16))
        self.session.add(share)
        self.session.commit()

        links: List[Link] = []
        for id in lecture_ids:
            lecture: Lecture = self.session.query(
                Lecture).filter_by(id=id).first()
            link_string = lecture.link
            link_name = lecture.name
            if link_string is not None:
                links.append(
                    Link(link=link_string, share_id=share.id, name=link_name))

        self.session.add_all(links)
        self.session.commit()

        return share.to_dict()

    def get_share(self, secret):
        return self.session.query(Share).filter_by(secret=secret).first().to_dict()

    def get_lectures(self):
        lectures: List[Lecture] = self.session.query(Lecture).all()
        output = []
        for l in lectures:
            output.append(l.to_dict())
        return output

    def add_alias(self, lecture_id, name):
        self.session.add(Alias(name=name, lecture_id=lecture_id))
        self.session.commit()

    def remove_alias(self, id):
        self.session.delete(self.session.query(Alias).filter_by(id=id).first())
        self.session.commit()

    def add_person(self, lecture_id, name):
        self.session.add(Person(name=name, lecture_id=lecture_id))
        self.session.commit()

    def remove_person(self, id):
        self.session.delete(self.session.query(
            Person).filter_by(id=id).first())
        self.session.commit()

    def checkPassword(self, name, password):
        member: Member = self.session.query(
            Member).filter_by(name=name).first()
        if member is None:
            return None

        hashed_pw = TokenManager.hashPassword(password, member.salt)

        if hashed_pw == member.password:
            return member.id
        else:
            return None
