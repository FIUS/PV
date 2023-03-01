import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship
from database.Link import Link
import datetime
import secrets


class Share(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    creation_time = sql.Column(
        sql.DateTime, default=datetime.datetime.now, nullable=True)
    secret = sql.Column(sql.String(
        16), nullable=False)
    links = relationship(Link, lazy="joined")

    def to_dict(self):
        links = []
        for l in self.links:
            links.append({"link": l.link, "name": l.name})
        return {"secret": self.secret, "links": links}
