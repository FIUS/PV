import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship
import util


class Member(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(100), nullable=False, unique=True)
    password = sql.Column(sql.LargeBinary(length=128), nullable=False)
    salt = sql.Column(sql.String(64), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }
